import * as React from "react";

type AppLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

/**
 * AppLink - a lightweight link component that uses a regular <a> under the hood.
 * Purpose: avoid strict TanStack Link type restrictions in places where we simply
 * need to navigate with standard hrefs (keeps TypeScript simple and predictable).
 */
export default function AppLink({ to, children, className, target, rel, ...rest }: AppLinkProps) {
  const isExternal = /^https?:\/\//.test(to);
  const finalTarget = target ?? (isExternal ? "_blank" : undefined);
  const finalRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

  return (
    <a href={to} className={className} target={finalTarget} rel={finalRel} {...rest}>
      {children}
    </a>
  );
}