import AssetImage from './AssetImage.jsx';

const LOGOS = [
  { name: 'logo-kemendiktisaintek', alt: 'Kemendiktisaintek' },
  { name: 'logo-unri', alt: 'UNRI' },
  { name: 'logo-dmgc', alt: 'DMGC' },
];

export default function SponsorLogos({ inline = false }) {
  const fallback = (alt) => (
    <span className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold text-plum-800 shadow-sm">{alt}</span>
  );

  return (
    <div
      className={inline ? 'flex flex-wrap items-center justify-center gap-3' : 'sponsor-logos'}
      aria-label="Sponsor logos"
    >
      {LOGOS.map((logo) => (
        <AssetImage
          key={logo.name}
          name={logo.name}
          alt={logo.alt}
          className={inline ? 'h-6 w-auto object-contain sm:h-8' : ''}
          fallback={fallback(logo.alt)}
        />
      ))}
    </div>
  );
}
