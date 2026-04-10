/**
 * PersonAvatar — Realistic demo avatar for stakeholders and community members.
 * Uses first name to determine gender, then picks a deterministic photo.
 * For demo/development only — real app would use uploaded photos.
 */

interface PersonAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

const FEMALE_PHOTOS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/women/90.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
  'https://randomuser.me/api/portraits/women/76.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg',
];

const MALE_PHOTOS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/men/86.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/men/78.jpg',
];

// Common female first names for our demo characters
const FEMALE_NAMES = new Set([
  'maria', 'rosa', 'destiny', 'christina', 'elena', 'margaret', 'patricia',
  'lupita', 'fatima', 'ewa', 'lucia', 'carmen', 'sofia', 'sr.', 'sr',
]);

// Common male first names + titles
const MALE_NAMES = new Set([
  'james', 'thomas', 'antonio', 'deandre', 'jake', 'daniel', 'ahmed',
  'tomasz', 'fr.', 'fr', 'ald.', 'ald', 'rev.', 'rev',
]);

function detectGender(name: string): 'female' | 'male' {
  const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
  const prefix = name.split(' ')[0].toLowerCase();

  if (FEMALE_NAMES.has(firstName) || FEMALE_NAMES.has(prefix)) return 'female';
  if (MALE_NAMES.has(firstName) || MALE_NAMES.has(prefix)) return 'male';

  // For compound names like "The Reyes Family", default to female
  // For unknown names, use a simple heuristic (names ending in a/e/i tend female)
  const lastChar = firstName.slice(-1);
  if ('aei'.includes(lastChar)) return 'female';
  return 'male';
}

function nameToIndex(name: string, poolSize: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % poolSize;
}

export default function PersonAvatar({ name, size = 40, className = '' }: PersonAvatarProps) {
  const gender = detectGender(name);
  const pool = gender === 'female' ? FEMALE_PHOTOS : MALE_PHOTOS;
  const url = pool[nameToIndex(name, pool.length)];
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative shrink-0 rounded-full overflow-hidden bg-[hsl(30_18%_85%)] ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
          if (fallback) fallback.classList.remove('hidden');
        }}
      />
      <div className="hidden absolute inset-0 flex items-center justify-center bg-[hsl(20_25%_30%)] text-white font-semibold" style={{ fontSize: size * 0.35 }}>
        {initials}
      </div>
    </div>
  );
}
