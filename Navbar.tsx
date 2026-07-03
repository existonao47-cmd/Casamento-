import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/nossa-historia", label: "Nossa História" },
  { to: "/galeria", label: "Galeria" },
  { to: "/cerimonia", label: "Cerimônia" },
  { to: "/dress-code", label: "Dress Code" },
  { to: "/presentes", label: "Presentes" },
  { to: "/rsvp", label: "Confirmar Presença" },
  { to: "/mural", label: "Mural" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur dark:bg-ink/90 dark:border-paper/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <NavLink to="/" className="font-display text-2xl text-ink dark:text-paper">
          A&nbsp;|&nbsp;D
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "font-caption text-sm uppercase tracking-wider text-ink-light dark:text-paper/70 transition-colors hover:text-wine dark:hover:text-sunflower",
                  isActive && "text-wine dark:text-sunflower",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="rounded-full p-2 text-ink-light hover:text-wine dark:text-paper/70 dark:hover:text-sunflower"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>

        <button
          type="button"
          className="lg:hidden text-ink dark:text-paper"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden flex flex-col gap-1 border-t border-ink/10 bg-paper px-6 py-4 dark:bg-ink dark:border-paper/10">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "py-2 font-caption text-sm uppercase tracking-wider text-ink-light dark:text-paper/70",
                  isActive && "text-wine dark:text-sunflower",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="mt-2 flex items-center gap-2 py-2 font-caption text-sm uppercase tracking-wider text-ink-light dark:text-paper/70"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "light" ? "Modo escuro" : "Modo claro"}
          </button>
        </nav>
      )}
    </header>
  );
}
