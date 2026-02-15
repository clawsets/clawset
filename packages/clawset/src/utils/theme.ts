import chalk from "chalk";

const PALETTE = {
  accent: "#FF5A2D",
  accentBright: "#FF7A3D",
  accentDim: "#D14A22",
  info: "#FF8A5B",
  success: "#2FBF71",
  warn: "#FFB020",
  error: "#E23D2D",
  muted: "#8B7F77",
};

export const theme = {
  accent: (s: string) => chalk.hex(PALETTE.accent)(s),
  accentBright: (s: string) => chalk.hex(PALETTE.accentBright)(s),
  accentDim: (s: string) => chalk.hex(PALETTE.accentDim)(s),
  info: (s: string) => chalk.hex(PALETTE.info)(s),
  success: (s: string) => chalk.hex(PALETTE.success)(s),
  warn: (s: string) => chalk.hex(PALETTE.warn)(s),
  error: (s: string) => chalk.hex(PALETTE.error)(s),
  muted: (s: string) => chalk.hex(PALETTE.muted)(s),
  heading: (s: string) => chalk.bold.hex(PALETTE.accent)(s),
  command: (s: string) => chalk.hex(PALETTE.accentBright)(s),
};
