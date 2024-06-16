import { type SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.4348 3.85L11.5504 0.42C10.5894 -0.14 9.40066 -0.14 8.42983 0.42L2.55531 3.85C1.59439 4.41 1 5.45 1 6.58V13.42C1 14.54 1.59439 15.58 2.55531 16.15L8.43974 19.58C9.40066 20.14 10.5894 20.14 11.5603 19.58L17.4447 16.15C18.4056 15.59 19 14.55 19 13.42V6.58C18.9901 5.45 18.3957 4.42 17.4348 3.85ZM9.99505 5.34C11.273 5.34 12.3032 6.38 12.3032 7.67C12.3032 8.96 11.273 10 9.99505 10C8.71712 10 7.68685 8.96 7.68685 7.67C7.68685 6.39 8.71712 5.34 9.99505 5.34ZM12.65 14.66H7.34012C6.5377 14.66 6.0721 13.76 6.51789 13.09C7.19152 12.08 8.49917 11.4 9.99505 11.4C11.4909 11.4 12.7986 12.08 13.4722 13.09C13.918 13.75 13.4425 14.66 12.65 14.66Z"
      fill="#35426D"
    />
  </svg>
);
export { SvgComponent as IconUser };
