import { useState } from 'react';
import { OPEN_STEPS } from '../../data/story.js';
import { DRAG_CARDS, DRAG_BEST, formatRupiah } from '../../data/drag.js';
import MathText from '../MathText.jsx';
import AttemptTabs from './AttemptTabs.jsx';

function dragLabel(id) {
  return DRAG_CARDS.find((c) => c.id === id)?.label;
}

export default function EssayAnswersPanel({ student, t }) {
  const attempts = student?.attempts || [];
  const [active, setActive] = useState(() => Math.max(0, attempts.length - 1));

  if (attempts.length === 0) {
    return (
      <div className="py-6 text-center text-sm font-semibold text-plum-500">
        {t('teacher.noAttempts')}
      </div>
    );
  }

  const current = attempts[active];
  const essayByStep = {};
  for (const e of current.essays) essayByStep[e.stepId] = e.answer;
  const drag = current.drag;

  return (
    <div>
      <AttemptTabs
        attempts={attempts}
        t={t}
        attemptLabel="teacher.attempt"
        onChange={setActive}
        activeIndex={active}
      />

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-plum-200/70">
        <p className="text-[10px] font-bold uppercase tracking-wide text-plum-400">{t('teacher.dragAnswer')}</p>
        {drag && dragLabel(drag.slot1) && dragLabel(drag.slot2) ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#c9a9f0] px-2.5 py-1 font-mono text-xs font-bold text-plum-900">
              {t('exploration.dragStep1')}: <MathText text={dragLabel(drag.slot1)} />
            </span>
            <span className="font-bold text-plum-600">→</span>
            <span className="rounded-lg bg-[#c9a9f0] px-2.5 py-1 font-mono text-xs font-bold text-plum-900">
              {t('exploration.dragStep2')}: <MathText text={dragLabel(drag.slot2)} />
            </span>
            <span className="ml-auto font-display text-sm font-bold text-plum-900">
              {formatRupiah(drag.result)}
            </span>
            {Number(drag.result) === DRAG_BEST && (
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                🏆 {t('exploration.experimentBest')}
              </span>
            )}
          </div>
        ) : (
          <p className="mt-1 text-sm italic text-plum-300">{t('teacher.noAnswer')}</p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {OPEN_STEPS.map((stepId, n) => (
          <div key={stepId} className="rounded-2xl border border-plum-100 bg-white/70 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-plum-400">
              {t('teacher.essayN', { n: n + 1 })}
            </p>
            <p className={`mt-1 text-sm leading-relaxed ${essayByStep[stepId] ? 'text-plum-900' : 'italic text-plum-300'}`}>
              {essayByStep[stepId] || t('teacher.noAnswer')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}