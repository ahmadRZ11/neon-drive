/**
 * Theme token name -> hex. Needed wherever a colour has to reach something
 * that cannot read CSS variables: inline SVG attributes, canvas, and the
 * generated gradients on fallback tiles.
 */
export const HEX: Record<string, string> = {
  ink: "#05050c",
  midnight: "#0a0a1c",
  navy: "#10122e",
  slate: "#1b1d42",
  violet: "#6d28d9",
  electric: "#8b3dff",
  magenta: "#ff2d95",
  pink: "#ff5c9d",
  cyan: "#22e0ff",
  aqua: "#6df3ff",
  orange: "#ff7a2f",
  peach: "#ffb98a",
  gold: "#ffd36e",
  bone: "#f4ece6",
};

/** Falls back to cyan so a typo in a token name never renders nothing. */
export function hex(token: string, fallback = HEX.cyan) {
  return HEX[token] ?? fallback;
}
