// Stripe product + price mapping — single source of truth
// These IDs come from the Stripe dashboard / API

export const stripeProducts = {
  core: {
    product_id: 'prod_U5Hgv3sWJ7AOZy',
    price_id: 'price_1T7777RwrJkY2JxX9LNaJhcR',
    name: 'CROS Core',
  },
  insight: {
    product_id: 'prod_U5Hg2ZCJ38fIlU',
    price_id: 'price_1T7778RwrJkY2JxXcpaMRIjq',
    name: 'CROS Insight',
  },
  story: {
    product_id: 'prod_U5HgdYh1cNPYuV',
    price_id: 'price_1T7779RwrJkY2JxXUVgWhGzo',
    name: 'CROS Story',
  },
} as const;

export type StripeTierKey = keyof typeof stripeProducts;

/** Capacity add-on products */
export const stripeAddons = {
  bridge: {
    product_id: 'prod_U5HgeOmQmbdr2u',
    price_id: 'price_1T777ARwrJkY2JxXw0UpQJ7b',
    name: 'CROS Bridge™',
    lookup_key: 'cros_addon_bridge',
  },
  additional_users: {
    product_id: 'prod_U0wdg9CfDVL9m4',
    price_id: 'price_1T2ujtRwrJkY2JxXsrxbfVXZ',
    name: 'Additional Users',
    lookup_key: 'cros_addon_additional_users',
  },
  capacity_expansion_25: {
    product_id: 'prod_U5HBchqGkeDAKi',
    price_id: 'price_1T76dVRwrJkY2JxXN2QxxN9f',
    name: '+25 Active Team Capacity',
    lookup_key: 'cros_addon_capacity_25',
  },
  capacity_expansion_75: {
    product_id: 'prod_U5HBdZTiUhowNt',
    price_id: 'price_1T76dWRwrJkY2JxXHtmMQTIa',
    name: '+75 Active Team Capacity',
    lookup_key: 'cros_addon_capacity_75',
  },
  capacity_expansion_200: {
    product_id: 'prod_U5HBwEBmHRGbHW',
    price_id: 'price_1T76dXRwrJkY2JxXRMMQPYMn',
    name: '+200 Active Team Capacity',
    lookup_key: 'cros_addon_capacity_200',
  },
  campaigns: {
    product_id: 'prod_U0wjKIUakTmgTL',
    price_id: 'price_1T2uqQRwrJkY2JxXusi9ifgj',
    name: 'Relatio Campaigns™',
    lookup_key: 'cros_addon_campaigns',
  },
  expansion_capacity: {
    product_id: 'prod_U11nM03iYVAIZ5',
    price_id: 'price_1T2zjcRwrJkY2JxXVMdLZ6ds',
    name: 'Expansion Capacity',
    lookup_key: 'cros_addon_expansion_capacity',
  },
} as const;

export type StripeAddonKey = keyof typeof stripeAddons;

/** Guided Activation™ one-time products */
export const stripeGuidedActivation = {
  guided_activation: {
    product_id: 'prod_U12bTMTbR9W0wX',
    price_id: 'price_1T30WWRwrJkY2JxXzm7j0fDZ',
    name: 'Guided Activation™',
    sessions_total: 1,
  },
  guided_activation_plus: {
    product_id: 'prod_U12bgOeYD5kSDc',
    price_id: 'price_1T30WXRwrJkY2JxXS93Fc14m',
    name: 'Guided Activation Plus™',
    sessions_total: 2,
  },
} as const;

export type GuidedActivationKey = keyof typeof stripeGuidedActivation;

/** Founding Garden membership (recognition, $0/mo subscription add-on) */
export const stripeFoundingGarden = {
  product_id: 'prod_U2GiLy5Y55R4Lb',
  price_id: 'price_1T4CBJRwrJkY2JxX11DvEKxQ',
  name: 'Founding Garden Membership',
  program_key: 'founding_garden_2026_launch',
} as const;

/** Reverse lookup: price_id → addon key */
export const addonPriceToKey: Record<string, StripeAddonKey> = Object.fromEntries(
  Object.entries(stripeAddons).map(([k, v]) => [v.price_id, k as StripeAddonKey]),
) as Record<string, StripeAddonKey>;

/** Reverse lookup: price_id → base tier key */
export const basePriceToTier: Record<string, StripeTierKey> = Object.fromEntries(
  Object.entries(stripeProducts).map(([k, v]) => [v.price_id, k as StripeTierKey]),
) as Record<string, StripeTierKey>;
