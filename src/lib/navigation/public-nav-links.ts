export type PublicNavRoute = {
  href: "/fields" | "/be-a-neighbor" | "/gift-a-trace" | "/contribute";
  integrated: boolean;
};

export const publicNavRoutes: PublicNavRoute[] = [
  { href: "/fields", integrated: false },
  { href: "/be-a-neighbor", integrated: false },
  { href: "/gift-a-trace", integrated: false },
  { href: "/contribute", integrated: true },
];
