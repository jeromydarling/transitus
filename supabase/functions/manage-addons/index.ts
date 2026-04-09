import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * manage-addons — Add or remove add-ons from an existing Stripe subscription.
 *
 * POST body:
 *   { action: 'add' | 'remove', addon_key: string, quantity?: number }
 *
 * - 'add': creates a new subscription item on the customer's active subscription
 * - 'remove': removes the subscription item for the given add-on price
 */

const ADDON_PRICE_IDS: Record<string, string> = {
  bridge: "price_1T2YStRwrJkY2JxXVZ0x0nnf",
  additional_users: "price_1T2ujtRwrJkY2JxXsrxbfVXZ",
  expanded_ai: "price_1T2ujuRwrJkY2JxXfj9iw1Nz",
  expanded_local_pulse: "price_1T2ujwRwrJkY2JxXvIrddajT",
  advanced_nri: "price_1T2ujxRwrJkY2JxXIZQqwYeu",
  campaigns: "price_1T2uqQRwrJkY2JxXusi9ifgj",
  expansion_capacity: "price_1T2zjcRwrJkY2JxXVMdLZ6ds",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[MANAGE-ADDONS] ${step}${detailsStr}`);
};

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const userEmail = userData.user.email;
    logStep("User authenticated", { email: userEmail });

    const body = await req.json();
    const { action, addon_key, quantity } = body as {
      action: "add" | "remove";
      addon_key: string;
      quantity?: number;
    };

    if (!action || !addon_key) {
      return new Response(
        JSON.stringify({ error: "action and addon_key are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const priceId = ADDON_PRICE_IDS[addon_key];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `Unknown addon: ${addon_key}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    logStep("Addon resolved", { addon_key, priceId, action });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find Stripe customer
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found. Please subscribe first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active subscription found. Please subscribe first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const subscription = subscriptions.data[0];
    logStep("Found subscription", { subscriptionId: subscription.id });

    if (action === "add") {
      // Check if already has this price
      const existing = subscription.items.data.find(
        (item) => item.price.id === priceId,
      );
      if (existing) {
        logStep("Addon already active, updating quantity");
        await stripe.subscriptionItems.update(existing.id, {
          quantity: quantity ?? (existing.quantity ?? 1) + 1,
          proration_behavior: "create_prorations",
        });
      } else {
        logStep("Adding new addon item");
        await stripe.subscriptionItems.create({
          subscription: subscription.id,
          price: priceId,
          quantity: quantity ?? 1,
          proration_behavior: "create_prorations",
        });
      }
      logStep("Addon added successfully", { addon_key });

      return new Response(
        JSON.stringify({ success: true, action: "added", addon_key }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "remove") {
      const existing = subscription.items.data.find(
        (item) => item.price.id === priceId,
      );
      if (!existing) {
        return new Response(
          JSON.stringify({ error: `Addon ${addon_key} is not active on your subscription.` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      logStep("Removing addon item", { itemId: existing.id });
      await stripe.subscriptionItems.del(existing.id, {
        proration_behavior: "create_prorations",
      });
      logStep("Addon removed successfully", { addon_key });

      return new Response(
        JSON.stringify({ success: true, action: "removed", addon_key }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'add' or 'remove'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});