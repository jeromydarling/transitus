import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Base plan price IDs — must match src/config/stripe.ts
const PRICE_IDS: Record<string, string> = {
  core: "price_1T7777RwrJkY2JxX9LNaJhcR",
  insight: "price_1T7778RwrJkY2JxXcpaMRIjq",
  story: "price_1T7779RwrJkY2JxXUVgWhGzo",
  bridge: "price_1T777ARwrJkY2JxXw0UpQJ7b",
};

// Add-on price IDs
const ADDON_PRICE_IDS: Record<string, string> = {
  capacity_expansion_25: "price_1T76dVRwrJkY2JxXN2QxxN9f",
  capacity_expansion_75: "price_1T76dWRwrJkY2JxXHtmMQTIa",
  capacity_expansion_200: "price_1T76dXRwrJkY2JxXRMMQPYMn",
  expanded_local_pulse: "price_1T2ujwRwrJkY2JxXvIrddajT",
  campaigns: "price_1T2uqQRwrJkY2JxXusi9ifgj",
  expansion_capacity: "price_1T2zjcRwrJkY2JxXVMdLZ6ds",
};

// Guided Activation one-time prices
const GUIDED_ACTIVATION_PRICES: Record<string, { price_id: string; sessions: number }> = {
  guided_activation: { price_id: "price_1T30WWRwrJkY2JxXzm7j0fDZ", sessions: 1 },
  guided_activation_plus: { price_id: "price_1T30WXRwrJkY2JxXS93Fc14m", sessions: 2 },
};

// Founding Garden membership (recognition add-on, $0/mo)
const FOUNDING_GARDEN_PRICE_ID = "price_1T4CBJRwrJkY2JxX11DvEKxQ";
const FOUNDING_GARDEN_PROGRAM_KEY = "founding_garden_2026_launch";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Stripe is not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    // Authenticate user (optional — allows guest checkout if no auth header)
    const authHeader = req.headers.get("Authorization");
    let userEmail: string | undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
    }

    const body = await req.json();
    const {
      tiers,
      email,
      addons,
      guided_activation,
      founding_garden_opt_in,
    } = body as {
      tiers: string[];
      email?: string;
      addons?: {
        capacity_expansion_25?: boolean;
        capacity_expansion_75?: boolean;
        capacity_expansion_200?: boolean;
        expanded_local_pulse?: boolean;
        campaigns?: boolean;
        expansion_capacity_qty?: number;
      };
      guided_activation?: string;
      founding_garden_opt_in?: boolean;
    };

    // Resolve email: authenticated user > body email
    const customerEmail = userEmail ?? email;

    if (!tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one tier is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build line items from base tiers
    const lineItems: { price: string; quantity: number }[] = [];
    for (const tier of tiers) {
      const priceId = PRICE_IDS[tier];
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `Unknown tier: ${tier}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      lineItems.push({ price: priceId, quantity: 1 });
    }

    // Add capacity add-ons
    if (addons) {
      if (addons.capacity_expansion_25) {
        lineItems.push({ price: ADDON_PRICE_IDS.capacity_expansion_25, quantity: 1 });
      }
      if (addons.capacity_expansion_75) {
        lineItems.push({ price: ADDON_PRICE_IDS.capacity_expansion_75, quantity: 1 });
      }
      if (addons.capacity_expansion_200) {
        lineItems.push({ price: ADDON_PRICE_IDS.capacity_expansion_200, quantity: 1 });
      }
      if (addons.expanded_local_pulse) {
        lineItems.push({ price: ADDON_PRICE_IDS.expanded_local_pulse, quantity: 1 });
      }
      if (addons.campaigns) {
        lineItems.push({ price: ADDON_PRICE_IDS.campaigns, quantity: 1 });
      }
      if (addons.expansion_capacity_qty && addons.expansion_capacity_qty > 0) {
        lineItems.push({ price: ADDON_PRICE_IDS.expansion_capacity, quantity: addons.expansion_capacity_qty });
      }
    }

    // Add Guided Activation one-time item
    if (guided_activation && GUIDED_ACTIVATION_PRICES[guided_activation]) {
      lineItems.push({ price: GUIDED_ACTIVATION_PRICES[guided_activation].price_id, quantity: 1 });
    }

    // Founding Garden opt-in: verify availability server-side before adding
    let foundingGardenRequested = false;
    if (founding_garden_opt_in) {
      const svc = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      const { data: program } = await svc
        .from("founding_garden_program")
        .select("is_active, cap, purchased_count, ends_at")
        .eq("key", FOUNDING_GARDEN_PROGRAM_KEY)
        .single();

      if (program && program.is_active && program.purchased_count < program.cap && !program.ends_at) {
        lineItems.push({ price: FOUNDING_GARDEN_PRICE_ID, quantity: 1 });
        foundingGardenRequested = true;

        // Log checkout_started event
        await svc.from("founding_garden_events").insert({
          tenant_id: "00000000-0000-0000-0000-000000000000", // resolved at webhook time
          program_key: FOUNDING_GARDEN_PROGRAM_KEY,
          event_type: "checkout_started",
          metadata: { email: customerEmail ?? null },
        });
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing Stripe customer
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    const origin = req.headers.get("origin") || "https://thecros.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${origin}/onboarding?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        tiers: tiers.join(","),
        capacity_expansion_25: String(!!addons?.capacity_expansion_25),
        capacity_expansion_75: String(!!addons?.capacity_expansion_75),
        capacity_expansion_200: String(!!addons?.capacity_expansion_200),
        expanded_local_pulse: String(!!addons?.expanded_local_pulse),
        campaigns: String(!!addons?.campaigns),
        expansion_capacity_qty: String(addons?.expansion_capacity_qty ?? 0),
        guided_activation: guided_activation ?? "",
        guided_activation_sessions: String(guided_activation ? (GUIDED_ACTIVATION_PRICES[guided_activation]?.sessions ?? 0) : 0),
        founding_garden_requested: String(foundingGardenRequested),
        founding_garden_program_key: foundingGardenRequested ? FOUNDING_GARDEN_PROGRAM_KEY : "",
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[create-checkout] Error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
