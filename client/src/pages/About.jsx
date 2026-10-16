import { useState } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar.jsx';
import PageBackground from '../components/PageBackground.jsx';
import { TargetIcon, PinIcon, CheckCircleIcon } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';

const SECTIONS = [
  {
    id: 'outcomes',
    titleKey: 'learningOutcomes',
    descKey: 'outcomesDesc',
    icon: TargetIcon,
    bg: 'from-sand to-lilac-light',
  },
  {
    id: 'objectives',
    titleKey: 'learningObjectives',
    descKey: 'objectivesDesc',
    icon: PinIcon,
    bg: 'from-lilac to-lilac-light',
  },
  {
    id: 'indicators',
    titleKey: 'learningIndicators',
    descKey: 'indicatorsDesc',
    icon: CheckCircleIcon,
    bg: 'from-plum-200 to-plum-300',
  },
];

export default function About() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  function openedKey(id) {
    return `cv_about_${user?.id}_${id}`;
  }

  function isOpened(id) {
    return localStorage.getItem(openedKey(id)) === '1';
  }

  function openSection(id) {
    localStorage.setItem(openedKey(id), '1');
    setActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeSection = SECTIONS.find((s) => s.id === active);

  if (activeSection) {
    return (
      <div className="flex min-h-full flex-col">
        <PageBackground />
        <Navbar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10">
          <div className="w-full animate-pop-in rounded-3xl bg-white p-6 shadow-sm ring-1 ring-plum-200/60 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-plum-700">
                <activeSection.icon className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl font-bold text-plum-800">
                {t(`about.${activeSection.titleKey}`)}
              </h1>
            </div>

            {active === 'outcomes' && (
              <p className="leading-relaxed text-plum-700">{t('about.outcomesText')}</p>
            )}

            {active === 'objectives' && (
              <ol className="list-decimal space-y-2 pl-5 text-plum-700">
                {(Array.isArray(t('about.objectives')) ? t('about.objectives') : [t('about.objectives')]).map(
                  (o, i) => (
                    <li key={i}>{o}</li>
                  )
                )}
              </ol>
            )}

            {active === 'indicators' && (
              <ol className="space-y-3">
                {(Array.isArray(t('about.indicators')) ? t('about.indicators') : [t('about.indicators')]).map(
                  (ind, i) => (
                    <li key={i} className="rounded-2xl bg-cream p-4 text-plum-700">
                      <span className="leading-relaxed">{ind}</span>
                    </li>
                  )
                )}
              </ol>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setActive(null)}
              className="rounded-full bg-plum-100 px-6 py-2.5 font-semibold text-plum-800 transition-colors hover:bg-plum-200"
            >
              ← {t('about.back')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageBackground />
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <span className="rounded-full bg-lilac px-4 py-1 text-xs font-bold uppercase tracking-widest text-plum-800">
            {t('nav.about')}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-plum-800 md:text-4xl">
            {t('about.title')}
          </h1>
        </div>

        <section className="grid w-full gap-5 md:grid-cols-3">
          {SECTIONS.map((s) => {
            const done = isOpened(s.id);
            return (
              <button
                key={s.id}
                onClick={() => openSection(s.id)}
                className={`group flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br ${s.bg} p-8 text-center shadow-sm ring-1 ring-plum-200/50 transition-transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/60 text-plum-700 shadow-inner">
                  <s.icon className="h-9 w-9" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-plum-800">
                    {t(`about.${s.titleKey}`)}
                  </h2>
                  <p className="mt-1 text-sm text-plum-600">
                    {t(`about.${s.descKey}`)}
                  </p>
                </div>
                <span className="rounded-full bg-plum-800 px-5 py-1.5 text-sm font-semibold text-cream shadow transition-transform group-hover:scale-105">
                  {done ? t('about.read') : t('home.start')}
                </span>
              </button>
            );
          })}
        </section>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-plum-100 px-6 py-2.5 font-semibold text-plum-800 transition-colors hover:bg-plum-200"
          >
            ← {t('about.backToHome')}
          </button>
        </div>
      </main>
    </div>
  );
}
