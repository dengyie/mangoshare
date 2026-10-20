import React from "react";

// Icon geometry follows the Tabler Icons visual conventions (MIT licensed): https://github.com/tabler/tabler-icons

export type UiIconName =
  | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up" | "check"
  | "check-circle" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up"
  | "circle-x" | "code" | "copy" | "eye" | "external-link" | "globe"
  | "git-branch" | "image" | "layers" | "lock" | "loader" | "moon"
  | "monitor" | "paperclip" | "refresh" | "sparkles" | "square" | "sun"
  | "thumbs-down" | "thumbs-up" | "tool" | "x"
  | "gift" | "cloud" | "shield" | "server" | "graduation-cap" | "lightbulb"
  | "credit-card" | "coins" | "alert-triangle" | "trending-up" | "link" | "zap"
  | "star" | "tag" | "terminal" | "search" | "clock" | "phone" | "cpu" | "bot"
  | "download" | "info";

const paths: Record<UiIconName, React.ReactNode> = {
  "arrow-down": <path d="m6 9 6 6 6-6" />, "arrow-left": <path d="m15 6-6 6 6 6" />,
  "arrow-right": <path d="m9 6 6 6-6 6" />, "arrow-up": <path d="m6 15 6-6 6 6" />,
  check: <path d="m5 12 4 4L19 6" />, "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  "chevron-down": <path d="m6 9 6 6 6-6" />, "chevron-left": <path d="m14 6-6 6 6 6" />, "chevron-right": <path d="m10 6 6 6-6 6" />, "chevron-up": <path d="m6 15 6-6 6 6" />,
  "circle-x": <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
  code: <><path d="m8 9-3 3 3 3m8-6 3 3-3 3" /><path d="m14 5-4 14" /></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  "external-link": <><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 14v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  "git-branch": <><path d="M6 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" /><circle cx="6" cy="3" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="18" r="2" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-4-4L5 20" /></>,
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5" />, lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  loader: <><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" /></>,
  moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />, monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
  paperclip: <path d="m20 11-7.5 7.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-7.5 7.5a2 2 0 0 1-3-3L14 7" />, refresh: <><path d="M20 11a8 8 0 0 0-14.5-4L3 10m0-5v5h5M4 13a8 8 0 0 0 14.5 4L21 14m0 5v-5h-5" /></>,
  sparkles: <><path d="m12 3-1.2 4.8L6 9l4.8 1.2L12 15l1.2-4.8L18 9l-4.8-1.2L12 3Z" /><path d="m19 15-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15Z" /></>,
  square: <rect x="6" y="6" width="12" height="12" rx="1" />, sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>,
  "thumbs-down": <path d="M7 10v10H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2Zm0 0 3-7a2 2 0 0 1 2 2v3h6a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2h-7l-3-3" />, "thumbs-up": <path d="M7 14V4a2 2 0 0 1 2-2h2l1 6h6a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H9l-2-3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2" />,
  tool: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.2 2.2-2.7-.7-.7-2.7 2.2-2.2Z" /></>, x: <path d="m6 6 12 12M18 6 6 18" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13m7-9v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7m2.5-4a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  server: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></>,
  "graduation-cap": <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  lightbulb: <path d="M9 18h6m-4 4h2m-5-8a6 6 0 1 1 8 0c-.8.8-1.5 2-1.5 3h-5c0-1-.7-2.2-1.5-3Z" />,
  "credit-card": <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
  coins: <><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4" /></>,
  "alert-triangle": <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01" /></>,
  "trending-up": <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><circle cx="7" cy="7" r="1.5" /></>,
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
  cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3m6-3v3m-6 17v3m6-3v3M1 9h3m-3 6h3m17-6h3m-3 6h3" /></>,
  bot: <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4m-4 5h.01m8 0h.01" /></>,
  download: <><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /><polyline points="7 11 12 16 17 11" /><line x1="12" y1="4" x2="12" y2="16" /></>,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></>
};

export interface UiIconProps extends React.SVGProps<SVGSVGElement> { name: UiIconName; size?: number | string; strokeWidth?: number; }
export const UiIcon = React.forwardRef<SVGSVGElement, UiIconProps>(({ name, size = 20, strokeWidth = 1.8, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden={props["aria-label"] ? undefined : true} {...props}>{paths[name]}</svg>
));
UiIcon.displayName = "UiIcon";

export const icon = (name: UiIconName) => (props: Omit<UiIconProps, "name">) => <UiIcon name={name} {...props} />;
export const ArrowDown = icon("arrow-down");
export const ArrowLeft = icon("arrow-left");
export const ArrowRight = icon("arrow-right");
export const ArrowUp = icon("arrow-up");
export const Check = icon("check");
export const CheckCircle2 = icon("check-circle");
export const ChevronDown = icon("chevron-down");
export const ChevronLeft = icon("chevron-left");
export const ChevronRight = icon("chevron-right");
export const ChevronUp = icon("chevron-up");
export const CircleX = icon("circle-x");
export const Code2 = icon("code");
export const Copy = icon("copy");
export const Eye = icon("eye");
export const ExternalLink = icon("external-link");
export const Globe = icon("globe");
export const GitBranch = icon("git-branch");
export const ImageIcon = icon("image");
export const Layers = icon("layers");
export const Lock = icon("lock");
export const Loader2 = icon("loader");
export const Moon = icon("moon");
export const Monitor = icon("monitor");
export const Paperclip = icon("paperclip");
export const RotateCcw = icon("refresh");
export const Sparkles = icon("sparkles");
export const Square = icon("square");
export const Sun = icon("sun");
export const ThumbsDown = icon("thumbs-down");
export const ThumbsUp = icon("thumbs-up");
export const Wrench = icon("tool");
export const X = icon("x");
export const XCircle = icon("circle-x");
export const Gift = icon("gift");
export const Cloud = icon("cloud");
export const Shield = icon("shield");
export const Server = icon("server");
export const GraduationCap = icon("graduation-cap");
export const Lightbulb = icon("lightbulb");
export const CreditCard = icon("credit-card");
export const Coins = icon("coins");
export const AlertTriangle = icon("alert-triangle");
export const TrendingUp = icon("trending-up");
export const LinkIcon = icon("link");
export const Zap = icon("zap");
export const Star = icon("star");
export const Tag = icon("tag");
export const Terminal = icon("terminal");
export const Search = icon("search");
export const Clock = icon("clock");
export const Phone = icon("phone");
export const Cpu = icon("cpu");
export const Bot = icon("bot");
