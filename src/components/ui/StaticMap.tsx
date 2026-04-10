/**
 * StaticMap — Renders a Mapbox Static Image as an <img> tag.
 *
 * Falls back to a colored gradient placeholder when no Mapbox token is available.
 */

interface StaticMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
  style?: string;
  className?: string;
}

export default function StaticMap({
  lat,
  lng,
  zoom = 12,
  width = 300,
  height = 200,
  style = 'mapbox/satellite-v9',
  className = '',
}: StaticMapProps) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div
        className={`bg-gradient-to-br from-[hsl(152_30%_40%)] to-[hsl(200_35%_30%)] ${className}`}
        style={{ width: '100%', height, minHeight: height }}
        role="img"
        aria-label={`Map placeholder for ${lat}, ${lng}`}
      />
    );
  }

  const url = `https://api.mapbox.com/styles/v1/${style}/static/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=${token}`;

  return (
    <img
      src={url}
      alt={`Satellite map at ${lat}, ${lng}`}
      className={className}
      style={{ width: '100%', height, objectFit: 'cover' }}
      loading="lazy"
    />
  );
}
