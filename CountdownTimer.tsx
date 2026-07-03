import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
}

const UNITS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "dias" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "minutos" },
  { key: "seconds", label: "segundos" },
];

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const timeLeft = useCountdown(targetDate);

  if (timeLeft.isPast) {
    return (
      <p className="font-display text-4xl text-wine" role="status">
        Já dissemos Sim!
      </p>
    );
  }

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`Faltam ${timeLeft.days} dias, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos e ${timeLeft.seconds} segundos para o casamento`}
      className="flex items-start justify-center gap-4 sm:gap-8"
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-start">
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl sm:text-5xl font-medium tabular-nums text-ink">
              {String(timeLeft[unit.key]).padStart(2, "0")}
            </span>
            <span className="mt-1 font-caption text-xs sm:text-sm uppercase tracking-[0.2em] text-ink-light">
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span
              aria-hidden="true"
              className="mx-3 sm:mx-6 mt-1 h-8 sm:h-12 w-px bg-ink/20 self-center"
            />
          )}
        </div>
      ))}
    </div>
  );
}
