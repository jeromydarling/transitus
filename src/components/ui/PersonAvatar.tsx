/**
 * PersonAvatar — Realistic demo avatar for stakeholders and community members.
 * Uses a deterministic seed from the person's name to always show the same face.
 * For demo/development only — real app would use uploaded photos.
 */

interface PersonAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

// Pre-mapped demo photos from randomuser.me (deterministic by index)
// These are royalty-free portrait photos for demo purposes only
const DEMO_PHOTOS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/90.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
  'https://randomuser.me/api/portraits/men/86.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/women/76.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
];

function nameToIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % DEMO_PHOTOS.length;
}

export default function PersonAvatar({ name, size = 40, className = '' }: PersonAvatarProps) {
  const url = DEMO_PHOTOS[nameToIndex(name)];
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
          // Fallback to initials on load failure
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className="hidden absolute inset-0 flex items-center justify-center bg-[hsl(20_25%_30%)] text-white font-semibold" style={{ fontSize: size * 0.35 }}>
        {initials}
      </div>
    </div>
  );
}
