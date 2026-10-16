import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Navbar from '../components/Navbar.jsx';
import PageBackground from '../components/PageBackground.jsx';
import AssetImage from '../components/AssetImage.jsx';
import { ImageIcon } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../context/I18nContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { STORY } from '../data/story.js';

const CARDS = [
  {
    to: '/about',
    key: 'about',
    asset: 'taro',
    bg: 'from-sand to-lilac-light',
    flag: null,
  },
  {
    to: '/exploration',
    key: 'exploration',
    asset: 'taro',
    bg: 'from-lilac to-lilac-light',
    flag: null,
  },
  {
    to: '/evaluation',
    key: 'evaluation',
    asset: 'taro',
    bg: 'from-plum-200 to-plum-300',
    flag: null,
  },
];

export default function Home() {
  const { user, token, api } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const progress = useProgress();
  const [showResume, setShowResume] = useState(false);

  const storageKey = `cv_step_${user?.id}`;
  const savedStep = Number(localStorage.getItem(storageKey));
  const hasSavedStep = Number.isFinite(savedStep) && savedStep > 0;

  function openExploration() {
    if (hasSavedStep) {
      setShowResume(true);
      return;
    }
    if (progress.explorationDone) {
      startOver();
      return;
    }
    navigate('/exploration');
  }

  async function startOver() {
    setShowResume(false);
    try {
      await api('/api/progress/reset-exploration', { method: 'POST' });
    } catch {
      /* ignore */
    }
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`cv_essays_${user?.id}`);
    localStorage.removeItem(`cv_drag_answer_${user?.id}`);
    navigate('/exploration');
  }

  function continueResume() {
    setShowResume(false);
    navigate('/exploration');
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageBackground />
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10">
        <section className="mb-6 text-center">
          <p className="font-display text-4xl font-bold text-white [text-shadow:0_4px_18px_rgba(43,22,74,0.6)] md:text-5xl">
            {t('home.greeting').replace('{name}', user?.name || '')}
          </p>
        </section>

        <div className="w-full rounded-[2.5rem] bg-[#e9dafb] p-5 shadow-xl ring-1 ring-plum-300 md:p-7">
        <section className="text-center">
          <p className="mx-auto max-w-2xl leading-relaxed text-plum-800">
            {t('home.intro')}
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {CARDS.map((card) => {
            const content = (
              <>
                <div className="relative">
                  <AssetImage
                    name={card.asset}
                    alt={t(`home.cards.${card.key}`)}
                    className="h-20 w-20 object-contain drop-shadow-md"
                    fallback={
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-dashed border-plum-300 bg-white/40 shadow-inner">
                        <ImageIcon className="h-7 w-7 text-plum-300" />
                      </div>
                    }
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-plum-800">
                    {t(`home.cards.${card.key}`)}
                  </h2>
                  <p className="mt-1 text-sm text-plum-600">
                    {t(`home.cards.${card.key}Desc`)}
                  </p>
                </div>
                <span className="rounded-full px-5 py-1.5 text-sm font-semibold shadow transition-transform bg-plum-800 text-cream group-hover:scale-105">
                  {t('home.start')}
                </span>
              </>
            );

            if (card.to === '/exploration') {
              return (
                <button
                  key={card.key}
                  onClick={openExploration}
                  className={`group flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br ${card.bg} p-6 text-center shadow-sm ring-1 ring-plum-200/50 transition-transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={card.key}
                to={card.to}
                className={`group flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br ${card.bg} p-6 text-center shadow-sm ring-1 ring-plum-200/50 transition-transform hover:-translate-y-1 hover:shadow-lg`}
              >
                {content}
              </Link>
            );
          })}
        </section>
        </div>

        {showResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-plum-900/60 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative w-full max-w-md animate-pop-in rounded-3xl bg-white p-6 text-center shadow-xl ring-1 ring-plum-200">
              <h2 className="font-display text-xl font-bold text-plum-800">
                {t('exploration.resumeTitle')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-plum-600">
                {t('exploration.resumeMessage', { current: Math.min(savedStep + 1, STORY.length), total: STORY.length })}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={startOver}
                  className="rounded-full bg-plum-100 px-6 py-2.5 font-semibold text-plum-800 transition-colors hover:bg-plum-200"
                >
                  {t('exploration.restart')}
                </button>
                <button
                  onClick={continueResume}
                  className="rounded-full bg-plum-800 px-6 py-2.5 font-display font-semibold text-cream shadow transition-transform hover:scale-105"
                >
                  {t('exploration.resume')} →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
