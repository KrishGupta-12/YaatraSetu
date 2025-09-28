import type { SVGProps } from "react";

export function YatraSetuLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 4H4v4" />
      <path d="M4 8l4.5 4.5" />
      <path d="M16 20h4v-4" />
      <path d="M20 16l-4.5-4.5" />
      <path d="M8.5 8.5L12 12l3.5-3.5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
