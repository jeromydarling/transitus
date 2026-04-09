/**
 * Transitus API Connectors
 *
 * All external data sources for place intelligence.
 * Each module returns mock data now, with documented real API endpoints
 * for future integration.
 *
 * Production stack (from handoff document):
 * 1. Mapbox GL JS + USGS terrain + OSM — map foundation
 * 2. EPA EJScreen + ECHO + Census — place intelligence
 * 3. Library of Congress + National Archives — historical depth
 * 4. Smithsonian Open Access — visual enrichment
 * 5. NASA imagery — satellite/earth observation
 * 6. NOAA + FEMA — weather, climate, hazard context
 * 7. Grants.gov + EPA/DOE — funding opportunities
 */

export { fetchEJScreenData } from './ejscreen';
export { fetchNearbyFacilities } from './echo';
export { fetchActiveAlerts, fetchClimateNormals, fetchHazardRisks } from './noaa';
export { fetchCensusProfile } from './census';
export { fetchEarthImagery, getAvailableGIBSLayers } from './nasa';
export { fetchElevation, searchProducts } from './usgs';
export { searchGrants } from './grants';
export { searchLOC, searchNARA, searchSmithsonian } from './archives';
