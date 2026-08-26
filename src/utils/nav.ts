import type { IconName } from "../components/ui/Icon/Icon.tsx";

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/posts", label: "Posts" },
      { href: "/lab", label: "Lab" },
      { href: "/work", label: "Work" },
    ],
  },
  {
    label: "More",
    items: [
      { href: "/now", label: "Now" },
      { href: "/bookshelf", label: "Bookshelf" },
      { href: "/bookmarks", label: "Bookmarks" },
      { href: "/scraps", label: "Scraps" },
      { href: "/travel", label: "Travel" },
      { href: "/guestbook", label: "Guestbook" },
      { href: "/webrings", label: "Webrings" },
      { href: "/colophon", label: "Colophon" },
    ],
  },
];

export const SOCIALS: {
  href: string;
  label: string;
  icon: IconName;
  external?: boolean;
}[] = [
  {
    href: "https://x.com/theumoru",
    label: "X",
    icon: "xLogo",
    external: true,
  },
  {
    href: "https://github.com/davidumoru",
    label: "GitHub",
    icon: "github",
    external: true,
  },
  {
    href: "https://linkedin.com/in/david-umoru/",
    label: "LinkedIn",
    icon: "linkedin",
    external: true,
  },
];

export const EMAIL = "hey@davidumoru.me";

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

const ITEMS = NAV_GROUPS.flatMap((group) => group.items).filter(
  (item) => item.href !== "/",
);

export function resolveSection(pathname: string): NavItem | null {
  const path = normalizePath(pathname);
  if (path === "/") return null;

  return (
    ITEMS.filter(
      (item) => path === item.href || path.startsWith(`${item.href}/`),
    ).sort((a, b) => b.href.length - a.href.length)[0] ?? null
  );
}

export function isCurrent(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);
  return href === "/"
    ? path === "/"
    : path === href || path.startsWith(`${href}/`);
}
