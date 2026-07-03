import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateLong } from "@/utils/formatters";
import type { Convidado, Familia, Confirmacao } from "@/types";

export function exportGuestsToExcel(guests: Convidado[], families: Familia[]): void {
  const familyById = new Map(families.map((f) => [f.id, f.nome]));

  const rows = guests.map((g) => ({
    Nome: g.nome,
    Família: familyById.get(g.familia_id) ?? "",
    Email: g.email ?? "",
    Telefone: g.telefone ?? "",
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Convidados");
  XLSX.writeFile(workbook, `convidados-amanda-deivison-${Date.now()}.xlsx`);
}

export function exportConfirmationsToPdf(
  confirmations: (Confirmacao & { familia_nome: string })[],
): void {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Confirmações — Amanda & Deivison", 14, 18);
  doc.setFontSize(10);
  doc.text(`Gerado em ${formatDateLong(new Date())}`, 14, 25);

  autoTable(doc, {
    startY: 32,
    head: [["Família", "Status", "Acompanhantes", "Restrição alimentar", "Confirmado em"]],
    body: confirmations.map((c) => [
      c.familia_nome,
      c.status,
      String(c.quantidade_acompanhantes),
      c.restricao_alimentar ?? "-",
      new Date(c.confirmado_em).toLocaleDateString("pt-BR"),
    ]),
    headStyles: { fillColor: [110, 31, 43] },
  });

  doc.save(`confirmacoes-amanda-deivison-${Date.now()}.pdf`);
}
