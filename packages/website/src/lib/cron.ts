const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function cronToHuman(expr: string): string {
  const parts = expr.split(" ");
  if (parts.length !== 5) return expr;

  const [minute, hour, , , dayOfWeek] = parts;

  const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

  if (dayOfWeek === "*") {
    return `Every day at ${time}`;
  }

  if (dayOfWeek === "1-5") {
    return `Weekdays at ${time}`;
  }

  if (dayOfWeek === "0,6" || dayOfWeek === "6,0") {
    return `Weekends at ${time}`;
  }

  const dayNames = dayOfWeek.split(",").map((d) => DAYS[parseInt(d)] ?? d);
  return `${dayNames.join(", ")} at ${time}`;
}
