import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Gift, MessageSquare, Image, LogOut, ClipboardCheck } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/convidados", label: "Convidados & Famílias", icon: Users },
  { to: "/admin/confirmacoes", label: "Confirmações", icon: ClipboardCheck },
  { to: "/admin/presentes", label: "Presentes", icon: Gift },
  { to: "/admin/mensagens", label: "Mural", icon: MessageSquare },
  { to: "/admin/galeria", label: "Galeria", icon: Image },
];

export default function AdminLayout() {
  const { logout, session } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-paper dark:bg-ink">
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink/10 bg-paper px-4 py-6 dark:bg-ink dark:border-paper/10">
        <span className="px-2 font-display text-2xl text-ink dark:text-paper">A&nbsp;|&nbsp;D Admin</span>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 font-caption text-sm uppercase tracking-wider text-ink-light dark:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5",
                  isActive && "bg-wine/10 text-wine dark:text-sunflower",
                )
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink/10 pt-4 dark:border-paper/10">
          <p className="truncate px-2 font-caption text-xs text-ink-light dark:text-paper/60">{session?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2 flex w-full items-center gap-3 rounded-sm px-3 py-2 font-caption text-sm uppercase tracking-wider text-ink-light hover:text-wine dark:text-paper/70 dark:hover:text-sunflower"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
