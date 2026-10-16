import { Link } from 'react-router';
import PageBackground from '../components/PageBackground.jsx';
import AssetImage from '../components/AssetImage.jsx';
import SponsorLogos from '../components/SponsorLogos.jsx';
import LetterTitle from '../components/LetterTitle.jsx';
import { useI18n } from '../context/I18nContext.jsx';
import { playBubble } from '../context/AudioContext.jsx';
import { SPEAKERS } from '../data/story.js';

const CARDS = [
  { asset: 'taro', key: 'about', bg: 'from-sand to-lilac-light', emoji: '📚' },
  { asset: 'taro', key: 'exploration', bg: 'from-lilac to-lilac-light', emoji: '🔍' },
  { asset: 'taro', key: 'evaluation', bg: 'from-plum-200 to-plum-300', emoji: '🏆' },
];

const HOW_STEPS = [
  { key: '1', emoji: '👋' },
  { key: '2', emoji: '⚙️' },
  { key: '3', emoji: '✏️' },
];

function HeroFriend({ asset, label, emoji, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <AssetImage
        name={asset}
        alt={label}
        className="h-32 w-24 object-contain object-bottom drop-shadow-lg sm:h-40 sm:w-28 md:h-48 md:w-32 lg:h-56 lg:w-36"
        fallback={<span className="text-6xl drop-shadow-lg sm:text-7xl md:text-8xl">{emoji}</span>}
      />
      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-plum-800 shadow-md sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export default function Landing() {
  const { t, lang, setLanguage } = useI18n();

  return (
    <div className="relative min-h-screen">
      <PageBackground />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <button
          onClick={() => setLanguage(lang === 'en' ? 'id' : 'en')}
          className="rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-semibold text-plum-800 backdrop-blur transition-colors hover:bg-white/70"
        >
          {lang === 'en' ? 'ID' : 'EN'}
        </button>
        <div className="rounded-2xl bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-white/60 backdrop-blur">
          <SponsorLogos inline />
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-2 md:gap-12">
        <section className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
          <div className="text-center md:text-left">
            <LetterTitle
              lines={[{ text: 'Taro Quest' }]}
              sound={playBubble}
              className="text-[38px] text-cream [text-shadow:0_4px_18px_rgba(43,22,74,0.6)] sm:text-[46px] lg:text-[56px] xl:text-[64px]"
            />
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.28em] text-cream/90 sm:text-base">
              Machine Mystery
            </p>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-cream sm:text-lg md:mx-0">
              {t('landing.tagline')}
            </p>
            <div className="mt-7 flex flex-col items-center gap-2 md:items-start">
              <Link
                to="/login"
                onMouseEnter={playBubble}
                className="inline-flex items-center gap-2 rounded-full bg-plum-800 px-9 py-3.5 font-display text-lg font-bold text-cream shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {t('landing.enter')} <span aria-hidden>→</span>
              </Link>
              <span className="text-xs font-semibold text-cream/80 sm:text-sm">
                {t('landing.enterHint')}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-center gap-1 sm:gap-3 md:gap-2 lg:gap-4">
            <HeroFriend asset="bu-aza" label={SPEAKERS['bu-aza'].name} emoji={SPEAKERS['bu-aza'].emoji} />
            <HeroFriend asset="taro" label={t('exploration.taro')} emoji="🍠" />
            <HeroFriend asset="bu-zia" label={SPEAKERS['bu-zia'].name} emoji={SPEAKERS['bu-zia'].emoji} />
          </div>
        </section>

        <section className="rounded-3xl bg-cream/95 p-6 shadow-lg ring-1 ring-plum-200 backdrop-blur md:p-10">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-plum-800 md:text-3xl">
              {t('landing.aboutTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-plum-700">{t('landing.aboutText')}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-center font-display text-lg font-bold text-plum-800 md:text-xl">
              {t('landing.learnTitle')}
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {CARDS.map((card) => (
                <div
                  key={card.key}
                  className={`flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br ${card.bg} p-6 text-center shadow-sm ring-1 ring-plum-200/50 transition-transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  <AssetImage
                    name={card.asset}
                    alt={t(`home.cards.${card.key}`)}
                    className="h-20 w-20 object-contain drop-shadow-md"
                    fallback={<span className="text-5xl">{card.emoji}</span>}
                  />
                  <h4 className="font-display text-xl font-bold text-plum-800">{t(`home.cards.${card.key}`)}</h4>
                  <p className="text-sm text-plum-700">{t(`home.cards.${card.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-center font-display text-lg font-bold text-plum-800 md:text-xl">
              {t('landing.stepsTitle')}
            </h3>
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              {HOW_STEPS.map((step, i) => (
                <li
                  key={step.key}
                  className="flex items-start gap-3 rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-plum-200/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-plum-800 text-2xl text-cream shadow-md">
                    {step.emoji}
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-plum-800">
                      {t(`landing.step${step.key}Title`)}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-plum-700">
                      {t(`landing.step${step.key}Desc`)}
                    </p>
                  </div>
                  <span className="sr-only">{i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs font-semibold text-cream/90">
        Made with ❤️ by teaMate
      </footer>
    </div>
  );
}
