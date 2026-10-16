import MathText from './MathText.jsx';

export default function CalcContextBanner({ text, pillLabel, prevAnswer }) {
  return (
    <div className="w-full animate-pop-in space-y-2">
      <div className="rounded-2xl bg-[#d6b4f2]/50 px-4 py-3 text-left text-sm font-medium leading-relaxed text-plum-800 ring-1 ring-lilac">
        <MathText text={text} />
      </div>
      {pillLabel && prevAnswer && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/85 px-4 py-2 shadow-sm ring-1 ring-plum-200/70">
          <span className="rounded-full bg-lilac px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-plum-800">
            {pillLabel}
          </span>
          <span className="min-w-0 text-left text-xs font-semibold text-plum-800">{prevAnswer}</span>
        </div>
      )}
    </div>
  );
}