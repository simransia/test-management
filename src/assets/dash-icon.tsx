import { SVGProps } from "react";

export function DashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.875 15L7.5 9.37501L11.0883 12.9633C12.1258 10.9185 13.8371 9.29428 15.9333 8.36501L18.2167 7.34834M16.3167 12.2983L18.2167 7.34834L13.2667 5.44751"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
