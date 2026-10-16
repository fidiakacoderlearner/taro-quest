import { useState } from 'react';

export default function AttemptTabs({ attempts, t, attemptLabel, onChange, activeIndex }) {
  if (attempts.length === 0) return null;

  const active = activeIndex ?? Math.max(0, attempts.length - 1);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {attempts.map((a, i) => (
        <button
          key={a.attemptNo}
          onClick={() => onChange(i)}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
            i === active ? 'bg-plum-800 text-cream' : 'bg-plum-100 text-plum-700 hover:bg-plum-200'
          }`}
        >
          {t(attemptLabel, { n: a.attemptNo })}
        </button>
      ))}
      <span className="ml-auto text-xs font-medium text-plum-400">
        {t('teacher.submittedAt', { date: attempts[active].submittedAt })}
      </span>
    </div>
  );
}