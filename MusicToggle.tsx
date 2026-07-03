import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Arquivo de música ainda não adicionado em /public/assets — ignora silenciosamente.
      });
    }
    setPlaying((v) => !v);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} loop preload="none" src="/assets/musica-fundo.mp3" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        aria-pressed={playing}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:border-wine hover:text-wine dark:bg-ink/90 dark:text-paper dark:border-paper/20 dark:hover:text-sunflower"
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
}
