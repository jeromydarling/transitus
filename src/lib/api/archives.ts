/**
 * Cultural Archives API Connectors
 *
 * Library of Congress, National Archives, and Smithsonian Open Access
 * for historical imagery, documents, and place memory.
 *
 * @see https://data.labs.loc.gov/apis/
 * @see https://www.archives.gov/research/catalog/help/api
 * @see https://www.si.edu/openaccess
 * @see https://github.com/Smithsonian/OpenAccess
 */

// ── Library of Congress ──

export interface LOCItem {
  id: string;
  title: string;
  date: string;
  description: string;
  subjects: string[];
  image_url?: string;
  iiif_manifest?: string; // IIIF image viewer for zoom/crop
  medium: string;
  call_number?: string;
  rights: string;
  url: string;
}

export async function searchLOC(query: string, place?: string): Promise<LOCItem[]> {
  // TODO: Wire to https://www.loc.gov/search/?q={query}&fo=json
  return [
    {
      id: 'loc-2023678451',
      title: 'Southeast Chicago industrial district, aerial view, 1952',
      date: '1952',
      description: 'Aerial photograph showing steel mills, railyards, and residential neighborhoods along the Calumet River.',
      subjects: ['Aerial photographs', 'Steel industry', 'Chicago (Ill.)', 'Industrial districts'],
      image_url: 'https://tile.loc.gov/storage-services/service/pnp/det/4a00000/4a08000/4a08400/4a08406v.jpg',
      medium: 'Photograph',
      call_number: 'LOT 12345',
      rights: 'No known restrictions on publication.',
      url: 'https://www.loc.gov/pictures/item/2023678451/',
    },
    {
      id: 'loc-2018692315',
      title: 'Map of Chicago showing smoke zones and industrial areas, 1911',
      date: '1911',
      description: 'City planning map delineating smoke-producing industrial zones and their proximity to residential areas.',
      subjects: ['Maps', 'Air pollution', 'City planning', 'Chicago (Ill.)'],
      image_url: 'https://tile.loc.gov/storage-services/service/gmd/gmd5/g4104/g4104c/ct003991.jp2',
      iiif_manifest: 'https://www.loc.gov/item/2018692315/manifest.json',
      medium: 'Map',
      rights: 'No known restrictions on publication.',
      url: 'https://www.loc.gov/item/2018692315/',
    },
  ];
}

// ── National Archives ──

export interface NARAItem {
  id: string;
  title: string;
  date: string;
  description: string;
  creator: string;
  series: string;
  record_group: string;
  thumbnail_url?: string;
  full_url?: string;
  ocr_text?: string;
  rights: string;
  url: string;
}

export async function searchNARA(query: string): Promise<NARAItem[]> {
  // TODO: Wire to https://catalog.archives.gov/api/v1/?q={query}&resultTypes=item
  return [
    {
      id: 'nara-6821045',
      title: 'EPA Enforcement Action Report: Republic Steel Corporation, Chicago, IL',
      date: '1974-03-15',
      description: 'Federal enforcement action documentation for air quality violations at the Republic Steel South Works facility.',
      creator: 'Environmental Protection Agency. Region 5.',
      series: 'Enforcement Case Files',
      record_group: 'RG 412',
      rights: 'Unrestricted',
      url: 'https://catalog.archives.gov/id/6821045',
    },
  ];
}

// ── Smithsonian Open Access ──

export interface SmithsonianItem {
  id: string;
  title: string;
  date: string;
  description: string;
  collection: string;
  museum: string;
  image_url?: string;
  medium: string;
  rights: 'CC0' | 'open_access';
  url: string;
  tags: string[];
}

export async function searchSmithsonian(query: string): Promise<SmithsonianItem[]> {
  // TODO: Wire to https://api.si.edu/openaccess/api/v1.0/search?q={query}&api_key=YOUR_KEY
  return [
    {
      id: 'si-nmah-2009-0123',
      title: 'Steel Worker, South Chicago, 1943',
      date: '1943',
      description: 'Documentary photograph of a steelworker at U.S. Steel South Works during wartime production.',
      collection: 'National Museum of American History',
      museum: 'NMAH',
      image_url: 'https://ids.si.edu/ids/deliveryService?id=NMAH-2009-0123',
      medium: 'Gelatin silver print',
      rights: 'CC0',
      url: 'https://www.si.edu/object/nmah_2009-0123',
      tags: ['industry', 'labor', 'chicago', 'steel', 'world war ii'],
    },
  ];
}
