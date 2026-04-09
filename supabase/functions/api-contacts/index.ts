import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Validate API Key
    const authHeader = req.headers.get("Authorization");
    const expectedApiKey = Deno.env.get("CONTACTS_API_KEY");

    if (!expectedApiKey) {
      console.error("CONTACTS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for Bearer token format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header. Use: Bearer <API_KEY>" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providedApiKey = authHeader.replace("Bearer ", "");
    if (providedApiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { name, title, email, phone, notes, opportunity_id } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Name is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be less than 100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (title && title.length > 100) {
      return new Response(
        JSON.stringify({ error: "Title must be less than 100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (email && email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email must be less than 255 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (phone && phone.length > 30) {
      return new Response(
        JSON.stringify({ error: "Phone must be less than 30 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (notes && notes.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Notes must be less than 2000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for API access
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare contact data
    const contactData: Record<string, unknown> = {
      name: name.trim(),
      title: title?.trim() || null,
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      is_primary: false,
    };

    // If opportunity_id is provided, validate it exists
    if (opportunity_id) {
      const { data: opp, error: oppError } = await supabase
        .from("opportunities")
        .select("id")
        .eq("id", opportunity_id)
        .single();

      if (oppError || !opp) {
        return new Response(
          JSON.stringify({ error: "Invalid opportunity_id - opportunity not found" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      contactData.opportunity_id = opportunity_id;
    }

    // Insert contact
    const { data: contact, error: insertError } = await supabase
      .from("contacts")
      .insert(contactData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create contact", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        contact: {
          id: contact.id,
          contact_id: contact.contact_id,
          name: contact.name,
          title: contact.title,
          email: contact.email,
          phone: contact.phone,
          notes: contact.notes,
          opportunity_id: contact.opportunity_id,
          created_at: contact.created_at,
        },
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in api-contacts:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
