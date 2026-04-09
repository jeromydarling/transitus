/**
 * relatio-dry-run — Previews a migration without writing to CRM tables.
 * POST { tenant_id, connector_key, source, records? }
 *
 * Returns mapping preview, warnings, and sample records.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/** Default field maps per connector */
const DEFAULT_MAPS: Record<string, { source: string; target: string; object: string }[]> = {
  hubspot: [
    { source: "company_name", target: "organization", object: "organizations" },
    { source: "company_domain", target: "website_url", object: "organizations" },
    { source: "contact_email", target: "email", object: "contacts" },
    { source: "contact_name", target: "name", object: "contacts" },
    { source: "note_body", target: "notes", object: "activities" },
  ],
  salesforce: [
    { source: "Account.Name", target: "organization", object: "organizations" },
    { source: "Account.Website", target: "website_url", object: "organizations" },
    { source: "Contact.Email", target: "email", object: "contacts" },
    { source: "Contact.Name", target: "name", object: "contacts" },
  ],
  civicrm: [
    { source: "organization_name", target: "organization", object: "organizations" },
    { source: "website_primary.url", target: "website_url", object: "organizations" },
    { source: "display_name", target: "name", object: "contacts" },
    { source: "email_primary.email", target: "email", object: "contacts" },
    { source: "phone_primary.phone", target: "phone", object: "contacts" },
    { source: "job_title", target: "title", object: "contacts" },
    { source: "subject", target: "title", object: "activities" },
    { source: "activity_date_time", target: "date", object: "activities" },
    { source: "title", target: "event_name", object: "events" },
    { source: "start_date", target: "start_date", object: "events" },
  ],
  csv: [
    { source: "organization", target: "organization", object: "organizations" },
    { source: "email", target: "email", object: "contacts" },
    { source: "name", target: "name", object: "contacts" },
    { source: "phone", target: "phone", object: "contacts" },
  ],
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { tenant_id, connector_key, records } = await req.json();

    if (!tenant_id || !connector_key) {
      return new Response(
        JSON.stringify({ error: "tenant_id and connector_key are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify membership
    const { data: membership } = await supabase
      .from("tenant_users")
      .select("tenant_id")
      .eq("tenant_id", tenant_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not a member of this tenant" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fieldMaps = DEFAULT_MAPS[connector_key] || DEFAULT_MAPS["csv"];
    const inputRecords = Array.isArray(records) ? records : [];
    const warnings: string[] = [];

    // Count by object type
    const previewCounts: Record<string, number> = {};
    const sampleRecords: Record<string, unknown[]> = {};
    const objectTypes = [...new Set(fieldMaps.map((m) => m.object))];

    for (const objType of objectTypes) {
      previewCounts[objType] = inputRecords.length > 0
        ? inputRecords.filter(() => true).length // Each record maps to each object type
        : 0;
      sampleRecords[objType] = inputRecords.slice(0, 3);
    }

    if (inputRecords.length > 50000) {
      warnings.push("CSV exceeds 50,000 rows. Only the first 50,000 will be processed.");
    }

    if (inputRecords.length === 0) {
      warnings.push(
        "No records provided. For API-based connectors, records will be pulled during commit.",
      );
    }

    // Create dry_run sync job
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: job, error: jobErr } = await admin
      .from("relatio_sync_jobs")
      .insert({
        tenant_id,
        connector_key,
        direction: "pull",
        mode: "dry_run",
        status: "completed",
        summary: { preview_counts: previewCounts, warnings, field_maps: fieldMaps },
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (jobErr) {
      return new Response(JSON.stringify({ error: jobErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sync_job_id: job.id,
        preview_counts: previewCounts,
        warnings,
        field_maps: fieldMaps,
        sample_records: sampleRecords,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
