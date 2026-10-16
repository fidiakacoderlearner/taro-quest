import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useI18n } from '../context/I18nContext.jsx';
import { CheckIcon, CloseIcon } from './icons.jsx';

export default function QuizFeedbackModal({ open, status, onTimeout, duration = 2000 }) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onTimeout, duration);
    return () => clearTimeout(id);
  }, [open, onTimeout, duration]);

  if (!open) return null;

  const isCorrect = status === 'correct';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-pop-in">
      <div className="absolute inset-0 bg-plum-900/60 backdrop-blur-xs" />

      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-cream p-6 text-center shadow-2xl ring-2 ring-plum-300">
        <div
          className={`mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full shadow-inner ring-4 ring-white ${
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isCorrect ? (
            <CheckIcon className="h-14 w-14 text-green-600" />
          ) : (
            <CloseIcon className="h-14 w-14 text-red-600" />
          )}
        </div>

        <h3 className={`font-display text-xl font-extrabold ${isCorrect ? 'text-green-800' : 'text-red-700'}`}>
          {isCorrect ? t('exploration.correct') : t('exploration.wrong')}
        </h3>
      </div>
    </div>,
    document.body
  );
}
