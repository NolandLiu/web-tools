type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

const paths: Record<string, React.ReactNode> = {
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  swap: <><path d="m7 7 3-3 3 3M10 4v12M17 17l-3 3-3-3M14 20V8" /></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  ruler: <><path d="m4 17 13-13 3 3L7 20 4 17Z" /><path d="m14 7 3 3M11 10l2 2M8 13l3 3" /></>,
  scale: <><path d="M6 20h12M8 20l2-12h4l2 12M9 8a3 3 0 1 1 6 0" /></>,
  temperature: <><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" /><path d="M12 17v-5" /></>,
  area: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 4v4H4M16 20v-4h4" /></>,
  volume: <><path d="M7 4h10l-1 16H8L7 4Z" /><path d="M8 9h8" /></>,
  speed: <><path d="M4 16a8 8 0 1 1 16 0" /><path d="m12 14 5-5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  storage: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>,
  binary: <><path d="M7 5v14M5 7l2-2 2 2M15 5a3 3 0 0 1 3 3v8a3 3 0 0 1-6 0V8a3 3 0 0 1 3-3Z" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></>,
  hash: <><path d="M10 3 8 21M16 3l-2 18M4 9h16M3 15h16" /></>,
  case: <><path d="m4 18 5-12 5 12M6 14h6M15 11h3a2 2 0 0 1 0 4h-3v-4Zm0 4h4a2 2 0 0 1 0 4h-4v-4Z" /></>,
  text: <><path d="M5 6h14M8 6v12M16 6v12M5 18h6M13 18h6" /></>,
  palette: <><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-3-4-5-9-5Z" /><path d="M7 9h.01M9 6h.01M15 6h.01" /></>,
  percent: <><circle cx="7" cy="7" r="2" /><circle cx="17" cy="17" r="2" /><path d="m6 19 12-14" /></>,
  tag: <><path d="M20 13 13 20 4 11V4h7l9 9Z" /><path d="M8 8h.01" /></>,
  activity: <><path d="M3 12h4l2-6 4 12 2-6h6" /></>,
  trend: <><path d="m4 16 5-5 4 4 7-8M15 7h5v5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  qr: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 14h2v6h-2M14 18h2v2h-2" /></>,
};

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] ?? paths.code}
    </svg>
  );
}
