import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { listGalleryItems, uploadGalleryImage, deleteGalleryItem } from "@/services/galleryService";
import { useSEO } from "@/hooks/useSEO";

export default function GaleriaAdmin() {
  useSEO({ title: "Gerenciar Galeria" });
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: items = [] } = useQuery({ queryKey: ["galeria"], queryFn: listGalleryItems });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      await uploadGalleryImage(file, undefined, items.length);
      await queryClient.invalidateQueries({ queryKey: ["galeria"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink dark:text-paper">Galeria</h1>
        <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-wine bg-wine px-4 py-2 font-caption text-xs uppercase tracking-wider text-paper">
          <Upload size={14} /> {isUploading ? "Enviando…" : "Adicionar Foto"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-wine">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-sm border border-ink/10 dark:border-paper/10">
            <img src={item.imagem_url} alt={item.legenda ?? ""} className="aspect-square w-full object-cover" />
            <button
              type="button"
              onClick={async () => {
                await deleteGalleryItem(item.id);
                await queryClient.invalidateQueries({ queryKey: ["galeria"] });
              }}
              aria-label="Remover foto"
              className="absolute right-2 top-2 rounded-full bg-ink/70 p-1.5 text-paper opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
