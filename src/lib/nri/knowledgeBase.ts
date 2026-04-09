/**
 * NRI RAG Knowledge Base Index
 *
 * Document index for retrieval-augmented generation powering the Narrative
 * Research Intelligence module. Provides structured references to methodology
 * documents, policy guides, case studies, and data documentation from
 * authoritative environmental justice sources.
 *
 * @see https://screeningtool.geoplatform.gov/
 * @see https://www.epa.gov/ejscreen
 * @see https://www.nrdc.org/
 * @see https://www.wri.org/
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: 'nrdc' | 'wri' | 'epa' | 'cejst' | 'sabin_center' | 'pedp' | 'propublica' | 'first_street' | 'noaa';
  category: 'methodology' | 'policy' | 'case_study' | 'legal' | 'data_guide' | 'best_practice';
  url: string;
  description: string;
  topics: string[];
  date_published?: string;
  machine_readable: boolean;
  format: 'pdf' | 'html' | 'csv' | 'json' | 'geojson' | 'api';
}

/** Seed knowledge base with real source documents */
const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  // --- CEJST / Justice40 ---
  {
    id: 'cejst-methodology-v1',
    title: 'CEJST Technical Support Document',
    source: 'cejst',
    category: 'methodology',
    url: 'https://static-data-screeningtool.geoplatform.gov/data-versions/1.0/data/score/technical-support-document.pdf',
    description: 'Full methodology for the Climate & Economic Justice Screening Tool, including threshold definitions for 8 burden categories, data sources, and statistical approach.',
    topics: ['ej_screening', 'justice40', 'census_tracts', 'burden_categories'],
    date_published: '2022-11-22',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'cejst-github-source',
    title: 'Justice40 Tool Source Code & Data Pipeline',
    source: 'cejst',
    category: 'data_guide',
    url: 'https://github.com/usds/justice40-tool',
    description: 'Open-source repository for the CEJST including ETL pipelines, scoring algorithms, and census tract data processing.',
    topics: ['justice40', 'open_source', 'data_pipeline', 'census_tracts'],
    date_published: '2022-11-22',
    machine_readable: true,
    format: 'json',
  },
  {
    id: 'cejst-data-download',
    title: 'CEJST Communities List (CSV download)',
    source: 'cejst',
    category: 'data_guide',
    url: 'https://static-data-screeningtool.geoplatform.gov/data-versions/1.0/data/score/downloadable/1.0-communities.csv',
    description: 'Complete listing of all census tracts scored as disadvantaged under Justice40, with per-category burden indicators.',
    topics: ['justice40', 'census_tracts', 'disadvantaged_communities'],
    date_published: '2022-11-22',
    machine_readable: true,
    format: 'csv',
  },

  // --- EPA EJScreen ---
  {
    id: 'ejscreen-technical-doc-2024',
    title: 'EJScreen Technical Documentation (2024)',
    source: 'epa',
    category: 'methodology',
    url: 'https://www.epa.gov/system/files/documents/2024-08/ejscreen-technical-documentation-2024.pdf',
    description: 'Comprehensive technical documentation for EPA EJScreen including indicator calculations, data sources, percentile methodology, and supplemental indexes.',
    topics: ['ej_screening', 'air_quality', 'demographics', 'percentiles'],
    date_published: '2024-08-01',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'ejscreen-api-documentation',
    title: 'EJScreen REST API Documentation',
    source: 'epa',
    category: 'data_guide',
    url: 'https://ejscreen.epa.gov/mapper/ejscreenRESTbroker.aspx',
    description: 'API reference for querying EJScreen data programmatically by geographic coordinates, block group, or area.',
    topics: ['ej_screening', 'api', 'block_groups'],
    date_published: '2024-01-15',
    machine_readable: true,
    format: 'api',
  },

  // --- NRDC Reports ---
  {
    id: 'nrdc-chicago-cumulative-impacts',
    title: 'Fumes Across the Fence-Line: Health Impacts of Air Pollution from Chicago Industrial Corridors',
    source: 'nrdc',
    category: 'case_study',
    url: 'https://www.nrdc.org/resources/fumes-across-fence-line',
    description: 'Analysis of cumulative pollution exposure in Chicago industrial corridors including Southeast Side and Little Village, with health outcome data and environmental justice mapping.',
    topics: ['air_quality', 'chicago', 'cumulative_impacts', 'industrial_corridors', 'health'],
    date_published: '2023-04-12',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'nrdc-flooded-again',
    title: 'Flooding and Climate Change: Everything You Need to Know',
    source: 'nrdc',
    category: 'policy',
    url: 'https://www.nrdc.org/stories/flooding-and-climate-change-everything-you-need-know',
    description: 'Comprehensive overview of how climate change increases flood risk, disproportionate impacts on low-income communities and communities of color, and policy solutions.',
    topics: ['flooding', 'climate_change', 'equity', 'adaptation'],
    date_published: '2024-03-08',
    machine_readable: false,
    format: 'html',
  },
  {
    id: 'nrdc-climate-health-equity',
    title: 'Climate Change and Health Equity: A Guide for Local Health Departments',
    source: 'nrdc',
    category: 'best_practice',
    url: 'https://www.nrdc.org/resources/climate-change-and-health-equity',
    description: 'Framework for local health departments to integrate climate and health equity, with community engagement best practices and data-driven planning tools.',
    topics: ['climate_change', 'health', 'equity', 'local_government', 'community_engagement'],
    date_published: '2023-09-15',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'nrdc-carto-datasets',
    title: 'NRDC Environmental Data on CARTO',
    source: 'nrdc',
    category: 'data_guide',
    url: 'https://nrdcmaps.carto.com/',
    description: '29 datasets published on CARTO covering pollution burden, cancer risk, diesel PM, energy burden, drinking water violations, and environmental justice indicators at census tract level.',
    topics: ['pollution', 'cancer_risk', 'energy_burden', 'water', 'ej_screening'],
    date_published: '2024-08-30',
    machine_readable: true,
    format: 'api',
  },

  // --- WRI ---
  {
    id: 'wri-just-transition-monitoring',
    title: 'A Just Transition Monitoring Framework: Tracking Progress Toward an Equitable Energy Transition',
    source: 'wri',
    category: 'methodology',
    url: 'https://www.wri.org/research/just-transition-monitoring-framework',
    description: 'Framework for monitoring whether energy transitions are delivering equitable outcomes, with indicators for worker support, community investment, and environmental remediation.',
    topics: ['just_transition', 'energy', 'equity', 'monitoring', 'workforce'],
    date_published: '2023-06-20',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'wri-community-benefits-analysis',
    title: 'Community Benefits from Clean Energy Projects: Lessons Learned',
    source: 'wri',
    category: 'best_practice',
    url: 'https://www.wri.org/research/community-benefits-clean-energy',
    description: 'Analysis of community benefit agreements in the clean energy sector, covering negotiation processes, key provisions, enforcement mechanisms, and outcomes for host communities.',
    topics: ['community_benefits', 'clean_energy', 'cba', 'negotiation', 'enforcement'],
    date_published: '2024-02-14',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'wri-ckan-datasets',
    title: 'WRI Open Data Portal (CKAN)',
    source: 'wri',
    category: 'data_guide',
    url: 'https://datasets.wri.org/',
    description: 'WRI open data catalog with datasets on climate, energy, forests, water, cities, and governance, accessible via CKAN API.',
    topics: ['open_data', 'climate', 'energy', 'water', 'governance'],
    date_published: '2024-01-01',
    machine_readable: true,
    format: 'api',
  },

  // --- Sabin Center ---
  {
    id: 'sabin-cba-database',
    title: 'Community Benefit Agreement Database',
    source: 'sabin_center',
    category: 'legal',
    url: 'https://climate.law.columbia.edu/content/community-benefit-agreements',
    description: 'Searchable database of community benefit agreements related to energy and infrastructure projects, maintained by Columbia Law School Sabin Center for Climate Change Law.',
    topics: ['cba', 'legal', 'energy', 'infrastructure', 'community_benefits'],
    date_published: '2024-05-01',
    machine_readable: false,
    format: 'html',
  },

  // --- ProPublica ---
  {
    id: 'propublica-sacrifice-zones',
    title: 'Sacrifice Zones: The Front Lines of Toxic Chemical Exposure (Methodology)',
    source: 'propublica',
    category: 'methodology',
    url: 'https://www.propublica.org/article/toxmap-poison-in-the-air',
    description: 'Methodology behind ProPublica\'s investigation into EPA air toxics data, mapping cancer risk from industrial emissions at census tract level across the US.',
    topics: ['air_quality', 'cancer_risk', 'industrial_emissions', 'investigative', 'mapping'],
    date_published: '2021-11-02',
    machine_readable: false,
    format: 'html',
  },
  {
    id: 'propublica-climate-migration',
    title: 'Climate Migration Data and Methodology',
    source: 'propublica',
    category: 'methodology',
    url: 'https://www.propublica.org/article/climate-change-will-force-a-new-american-migration',
    description: 'Methodology for modeling climate-driven migration patterns using heat, drought, flood, wildfire, and sea level rise projections at county level.',
    topics: ['climate_migration', 'heat', 'flooding', 'wildfire', 'sea_level_rise'],
    date_published: '2020-09-15',
    machine_readable: false,
    format: 'html',
  },

  // --- PEDP ---
  {
    id: 'pedp-data-preservation',
    title: 'Environmental Justice Requires High-Quality Information — Now More Than Ever',
    source: 'pedp',
    category: 'policy',
    url: 'https://screening-tools.com/blog/environmental-justice-requires-high-quality-information-now-more-than-ever',
    description: 'Public Environmental Data Partners analysis of threats to environmental data availability and strategies for community-driven data preservation.',
    topics: ['data_preservation', 'ej_screening', 'open_data', 'data_access'],
    date_published: '2025-01-28',
    machine_readable: false,
    format: 'html',
  },
  {
    id: 'pedp-screening-tools-archive',
    title: 'PEDP Screening Tools Data Archive',
    source: 'pedp',
    category: 'data_guide',
    url: 'https://screening-tools.com/',
    description: 'Archived copies of EPA screening tool data maintained by Public Environmental Data Partners for resilience against data takedowns.',
    topics: ['data_preservation', 'ej_screening', 'archive', 'ejscreen'],
    date_published: '2025-02-15',
    machine_readable: true,
    format: 'json',
  },

  // --- First Street Foundation ---
  {
    id: 'first-street-methodology',
    title: 'First Street Foundation Flood Model Methodology',
    source: 'first_street',
    category: 'methodology',
    url: 'https://firststreet.org/research-lab/published-research/flood-model-methodology',
    description: 'Peer-reviewed methodology for property-level flood risk modeling incorporating climate change projections, including fluvial, pluvial, coastal, and storm surge models.',
    topics: ['flooding', 'climate_change', 'risk_modeling', 'property_level'],
    date_published: '2023-07-01',
    machine_readable: false,
    format: 'pdf',
  },
  {
    id: 'first-street-climate-risk-api',
    title: 'First Street Foundation Climate Risk API',
    source: 'first_street',
    category: 'data_guide',
    url: 'https://firststreet.org/api',
    description: 'API documentation for accessing property-level flood, fire, heat, and wind risk scores with climate change projections through 2050.',
    topics: ['flooding', 'wildfire', 'heat', 'wind', 'api', 'property_level'],
    date_published: '2024-04-01',
    machine_readable: true,
    format: 'api',
  },

  // --- NOAA ---
  {
    id: 'noaa-climate-normals',
    title: 'NOAA U.S. Climate Normals (1991-2020)',
    source: 'noaa',
    category: 'data_guide',
    url: 'https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals',
    description: 'Baseline climate statistics including temperature, precipitation, and degree days computed from 30-year observation records at weather stations nationwide.',
    topics: ['climate', 'temperature', 'precipitation', 'baseline', 'weather_stations'],
    date_published: '2021-05-04',
    machine_readable: true,
    format: 'csv',
  },
  {
    id: 'noaa-sea-level-rise',
    title: 'NOAA Sea Level Rise Technical Report (2022)',
    source: 'noaa',
    category: 'methodology',
    url: 'https://oceanservice.noaa.gov/hazards/sealevelrise/sealevelrise-tech-report-sections.html',
    description: 'Updated sea level rise projections for the US coastline through 2150 under multiple climate scenarios, with regional breakdowns and methodological documentation.',
    topics: ['sea_level_rise', 'coastal', 'climate_change', 'projections'],
    date_published: '2022-02-15',
    machine_readable: false,
    format: 'pdf',
  },

  // --- CalEnviroScreen ---
  {
    id: 'calenviroscreen-methodology',
    title: 'CalEnviroScreen 4.0 Methodology',
    source: 'epa',
    category: 'methodology',
    url: 'https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40',
    description: 'California EPA methodology for cumulative impact screening combining pollution burden and population characteristics at census tract level. Influential model for national EJ screening approaches.',
    topics: ['ej_screening', 'cumulative_impacts', 'california', 'methodology', 'census_tracts'],
    date_published: '2021-10-20',
    machine_readable: false,
    format: 'pdf',
  },
];

/** Search the knowledge base by keyword query and optional topic filters */
export function searchKnowledgeBase(query: string, topics?: string[]): KnowledgeDocument[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter((t) => t.length > 2);

  return KNOWLEDGE_BASE.filter((doc) => {
    // Topic filter: if topics provided, document must match at least one
    if (topics && topics.length > 0) {
      const hasMatchingTopic = topics.some((topic) =>
        doc.topics.includes(topic.toLowerCase()),
      );
      if (!hasMatchingTopic) return false;
    }

    // Keyword matching: check title, description, topics, and source
    const searchableText = [
      doc.title,
      doc.description,
      doc.source,
      doc.category,
      ...doc.topics,
    ]
      .join(' ')
      .toLowerCase();

    return queryTerms.some((term) => searchableText.includes(term));
  });
}

/** Get all documents in the knowledge base */
export function getAllDocuments(): KnowledgeDocument[] {
  return [...KNOWLEDGE_BASE];
}

/** Get documents by source */
export function getDocumentsBySource(source: KnowledgeDocument['source']): KnowledgeDocument[] {
  return KNOWLEDGE_BASE.filter((doc) => doc.source === source);
}

/** Get documents by category */
export function getDocumentsByCategory(category: KnowledgeDocument['category']): KnowledgeDocument[] {
  return KNOWLEDGE_BASE.filter((doc) => doc.category === category);
}
