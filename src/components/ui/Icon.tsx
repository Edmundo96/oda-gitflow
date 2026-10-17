import type { ReactNode } from "react";

export type IconName =
  | "token"
  | "barcode"
  | "search"
  | "close"
  | "cart"
  | "delete"
  | "pos"
  | "inventory"
  | "reports"
  | "settings"
  | "add"
  | "edit"
  | "badge"
  | "dialpad"
  | "arrow"
  | "eye"
  | "eyeOff"
  | "card";

const paths: Record<IconName, ReactNode> = {
  token: (
    <>
      <path d="M12 2 22 12 12 22 2 12 12 2Z" />
      <path d="m12 6 6 6-6 6-6-6 6-6Z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  barcode: (
    <>
      <path d="M3 6v12M6 6v12M9 6v12M14 6v12M17 6v12M21 6v12" />
      <path d="M1 4h4M19 4h4M1 20h4M19 20h4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  cart: (
    <>
      <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L22 8H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </>
  ),
  delete: (
    <>
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" />
    </>
  ),
  pos: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8" />
    </>
  ),
  inventory: (
    <>
      <path d="M4 7h16v14H4zM3 3h18v4H3zM9 11h6" />
    </>
  ),
  reports: (
    <>
      <path d="M4 20V11h4v9M10 20V4h4v16M16 20v-7h4v7" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 1.8Z" transform="translate(-1 -1)" />
    </>
  ),
  add: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4 4 16.5Z" />
      <path d="m14.8 5.7 3.5 3.5" />
    </>
  ),
  badge: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M9 5V3h6v2M8 11h3M8 15h8M15 10v2" />
    </>
  ),
  dialpad: (
    <>
      {[6, 12, 18].flatMap((y) => [6, 12, 18].map((x) => <circle cx={x} cy={y} key={`${x}-${y}`} r="1" />))}
    </>
  ),
  arrow: <path d="M4 12h16m-7-7 7 7-7 7" />,
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.3 0 2.4-.3 3.4-.8" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`h-[1em] w-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
