/**
 * Generate URL-friendly slugs from entity names.
 * Used for pretty permalinks: /app/places/southeast-chicago-industrial-corridor
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, '-')     // spaces to hyphens
    .replace(/-+/g, '-')      // collapse multiple hyphens
    .replace(/^-|-$/g, '');   // trim leading/trailing hyphens
}

/**
 * Find an entity by either its ID or its slug (generated from name).
 */
export function findByIdOrSlug<T extends { id: string; name: string }>(
  items: T[],
  idOrSlug: string,
): T | undefined {
  // Try exact ID match first
  const byId = items.find(item => item.id === idOrSlug);
  if (byId) return byId;

  // Try slug match
  return items.find(item => slugify(item.name) === idOrSlug);
}

/**
 * Get the slug URL for a place by its ID.
 * Falls back to ID if place not found.
 */
export function placeSlug(places: { id: string; name: string }[], id: string): string {
  const place = places.find(p => p.id === id);
  return place ? slugify(place.name) : id;
}

/**
 * Get the slug URL for a stakeholder by their ID.
 */
export function personSlug(stakeholders: { id: string; name: string }[], id: string): string {
  const person = stakeholders.find(s => s.id === id);
  return person ? slugify(person.name) : id;
}
