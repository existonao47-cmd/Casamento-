import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/admin/StatCard";
import { getDashboardStats } from "@/services/adminDataService";
import { useSEO } from "@/hooks/useSEO";

export default function Dashboard() {
  useSEO({ title: "Dashboard" });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
    refetchInterval: 60_000,
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink dark:text-paper">Dashboard</h1>
      <p className="mt-1 font-serif text-ink-light dark:text-paper/70">Visão geral em tempo real.</p>

      {isLoading && <p className="mt-8 font-caption text-ink-light dark:text-paper/70">Carregando…</p>}

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total de convidados" value={stats.totalConvidados} />
          <StatCard label="Confirmados" value={stats.confirmados} />
          <StatCard label="Pendentes" value={stats.pendentes} />
          <StatCard label="Recusas" value={stats.recusados} />
          <StatCard label="Total de acompanhantes" value={stats.totalAcompanhantes} />
          <StatCard label="Presentes reservados" value={stats.presentesReservados} />
          <StatCard label="Mensagens no mural" value={stats.totalMensagens} />
        </div>
      )}
    </div>
  );
}
