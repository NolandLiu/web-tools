type DiscoverIconProps = {
  type: "tool" | "website" | "guide" | "collection" | "category";
  canonicalSlug?: string;
  className?: string;
};

const paths = {
  tool: (
    <>
      <path d="M7 8.5h10" />
      <path d="M8.5 6.5 7 8.5l1.5 2" />
      <path d="M15.5 13.5 17 15.5l-1.5 2" />
      <path d="M7 15.5h10" />
      <path d="M10 12h4" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4.5 12h15" />
      <path d="M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8" />
      <path d="M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8" />
    </>
  ),
  guide: (
    <>
      <path d="M6.5 5.5h7a3 3 0 0 1 3 3v10h-7a3 3 0 0 0-3 3v-16Z" />
      <path d="M16.5 8.5h1a3 3 0 0 1 3 3v7h-4" />
      <path d="M9 9h4" />
      <path d="M9 12h4" />
    </>
  ),
  collection: (
    <>
      <rect x="4.5" y="5" width="6" height="6" rx="1.4" />
      <rect x="13.5" y="5" width="6" height="6" rx="1.4" />
      <rect x="4.5" y="14" width="6" height="6" rx="1.4" />
      <rect x="13.5" y="14" width="6" height="6" rx="1.4" />
    </>
  ),
  category: (
    <>
      <path d="M5 8.5h14" />
      <path d="M5 15.5h14" />
      <circle cx="8" cy="8.5" r="2" />
      <circle cx="16" cy="15.5" r="2" />
    </>
  ),
};

const toolIconPaths = {
  "json-tools": (
    <>
      <path d="M8.5 8 6 12l2.5 4" />
      <path d="M15.5 8 18 12l-2.5 4" />
      <path d="M11 17 13 7" />
    </>
  ),
  "ipv4-network-toolbox": (
    <>
      <rect x="4.5" y="5" width="15" height="11" rx="2" />
      <path d="M8 19h8" />
      <path d="M12 16v3" />
      <path d="M8 9h3" />
      <path d="M13 9h3" />
      <path d="M8 12h8" />
    </>
  ),
  "ipv6-network-toolbox": (
    <>
      <path d="M6 7h12" />
      <path d="M6 12h12" />
      <path d="M6 17h12" />
      <circle cx="7" cy="7" r="1.4" />
      <circle cx="17" cy="12" r="1.4" />
      <circle cx="11" cy="17" r="1.4" />
    </>
  ),
  "password-generator": (
    <>
      <rect x="6" y="10" width="12" height="9" rx="2" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" />
      <path d="M12 14.5v1.5" />
    </>
  ),
  "qr-code-generator": (
    <>
      <rect x="5" y="5" width="5" height="5" rx="1" />
      <rect x="14" y="5" width="5" height="5" rx="1" />
      <rect x="5" y="14" width="5" height="5" rx="1" />
      <path d="M14 14h2v2h-2z" />
      <path d="M18 14h1v5h-5v-1" />
    </>
  ),
  "irr-calculator": (
    <>
      <path d="M5 17h14" />
      <path d="M7 15c2.5-5.5 5.5-7 10-8" />
      <path d="M7 9v6h6" />
      <path d="M16 7h1v4" />
    </>
  ),
  "cheque-amount-converter": (
    <>
      <rect x="4.5" y="7" width="15" height="10" rx="2" />
      <path d="M7.5 10h5" />
      <path d="M7.5 13.5h8" />
      <path d="M16 10.5h1.5" />
    </>
  ),
  "base64-encoder-decoder": paths.tool,
  "url-encoder-decoder": paths.website,
  "uuid-generator": paths.collection,
  "timestamp-converter": (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8v4l3 2" />
      <path d="M7 4.5 5.5 6" />
      <path d="M17 4.5 18.5 6" />
    </>
  ),
};

export function DiscoverIcon({ type, canonicalSlug, className }: DiscoverIconProps) {
  const iconPath = type === "tool" && canonicalSlug
    ? (toolIconPaths[canonicalSlug as keyof typeof toolIconPaths] ?? paths.tool)
    : paths[type];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="22"
      viewBox="0 0 24 24"
      width="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
    >
      {iconPath}
    </svg>
  );
}
