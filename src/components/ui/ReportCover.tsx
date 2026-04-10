/**
 * ReportCover — Auto-generated SVG "cover page" thumbnail for reports.
 *
 * Renders a 280x160 SVG card with terrain gradient background,
 * place name, report type badge, date, and contour line decoration.
 */

const REPORT_TYPE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  place_brief: { bg: 'hsl(152, 35%, 32%)', text: '#fff' },
  stakeholder_engagement_log: { bg: 'hsl(198, 50%, 38%)', text: '#fff' },
  commitment_status: { bg: 'hsl(16, 65%, 48%)', text: '#fff' },
  quarter_in_review: { bg: 'hsl(270, 40%, 45%)', text: '#fff' },
  community_listening_summary: { bg: 'hsl(340, 45%, 48%)', text: '#fff' },
  transition_readiness: { bg: 'hsl(38, 75%, 50%)', text: '#fff' },
  ej_snapshot: { bg: 'hsl(0, 55%, 48%)', text: '#fff' },
  board_memo: { bg: 'hsl(210, 35%, 42%)', text: '#fff' },
  investor_packet: { bg: 'hsl(20, 30%, 38%)', text: '#fff' },
  public_story: { bg: 'hsl(152, 40%, 28%)', text: '#fff' },
};

const REPORT_TYPE_LABELS: Record<string, string> = {
  place_brief: 'Place Brief',
  stakeholder_engagement_log: 'Engagement Log',
  commitment_status: 'Commitment Status',
  quarter_in_review: 'Quarter in Review',
  community_listening_summary: 'Listening Summary',
  transition_readiness: 'Transition Readiness',
  ej_snapshot: 'EJ Snapshot',
  board_memo: 'Board Memo',
  investor_packet: 'Investor Packet',
  public_story: 'Public Story',
};

interface ReportCoverProps {
  title: string;
  placeName: string;
  date: string;
  reportType: string;
}

export default function ReportCover({ title, placeName, date, reportType }: ReportCoverProps) {
  const badgeColors = REPORT_TYPE_BADGE_COLORS[reportType] || { bg: 'hsl(20, 12%, 46%)', text: '#fff' };
  const badgeLabel = REPORT_TYPE_LABELS[reportType] || reportType.replace(/_/g, ' ');

  // Format date for display
  const formattedDate = (() => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return date;
    }
  })();

  // Truncate place name for display
  const displayPlace = placeName.length > 32 ? placeName.slice(0, 30) + '\u2026' : placeName;

  return (
    <svg
      viewBox="0 0 280 160"
      width={280}
      height={160}
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-lg overflow-hidden shrink-0"
      role="img"
      aria-label={`Cover for ${title}`}
    >
      {/* Terrain gradient background */}
      <defs>
        <linearGradient id={`terrain-${reportType}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(20, 28%, 18%)" />
          <stop offset="40%" stopColor="hsl(152, 25%, 22%)" />
          <stop offset="100%" stopColor="hsl(210, 20%, 16%)" />
        </linearGradient>
        {/* Subtle overlay gradient for depth */}
        <linearGradient id={`overlay-${reportType}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width="280" height="160" fill={`url(#terrain-${reportType})`} />
      <rect width="280" height="160" fill={`url(#overlay-${reportType})`} />

      {/* Contour line decorations — subtle topographic feel */}
      <g opacity="0.08" stroke="#fff" strokeWidth="0.8" fill="none">
        <ellipse cx="200" cy="100" rx="90" ry="50" />
        <ellipse cx="200" cy="100" rx="70" ry="38" />
        <ellipse cx="200" cy="100" rx="50" ry="26" />
        <ellipse cx="200" cy="100" rx="30" ry="14" />
        <path d="M 0 130 Q 70 105 140 118 T 280 100" />
        <path d="M 0 145 Q 80 120 160 135 T 280 115" />
      </g>

      {/* Report type badge */}
      <rect
        x="16"
        y="16"
        width={badgeLabel.length * 6.5 + 16}
        height="20"
        rx="10"
        fill={badgeColors.bg}
        opacity="0.9"
      />
      <text
        x="24"
        y="29"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9"
        fontWeight="600"
        fill={badgeColors.text}
        letterSpacing="0.03em"
      >
        {badgeLabel}
      </text>

      {/* Place name — large serif text */}
      <text
        x="16"
        y="78"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        fontWeight="700"
        fill="#fff"
        opacity="0.95"
      >
        {displayPlace}
      </text>

      {/* Title — smaller, below place name */}
      <text
        x="16"
        y="98"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="10"
        fill="#fff"
        opacity="0.55"
      >
        {title.length > 42 ? title.slice(0, 40) + '\u2026' : title}
      </text>

      {/* Date at bottom */}
      <text
        x="16"
        y="144"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="9"
        fill="#fff"
        opacity="0.4"
        letterSpacing="0.05em"
      >
        {formattedDate}
      </text>

      {/* Decorative line separator */}
      <line x1="16" y1="110" x2="80" y2="110" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}
