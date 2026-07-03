interface IcsEventOptions {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function downloadIcsEvent(options: IcsEventOptions): void {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amanda e Deivison//Casamento//PT-BR",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@amandaedeivison.com.br`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(options.start)}`,
    `DTEND:${toIcsDate(options.end)}`,
    `SUMMARY:${options.title}`,
    `DESCRIPTION:${options.description}`,
    `LOCATION:${options.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "casamento-amanda-e-deivison.ics";
  link.click();
  URL.revokeObjectURL(url);
}
