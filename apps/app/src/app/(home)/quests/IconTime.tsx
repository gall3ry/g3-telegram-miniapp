import { type SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.4917 13.0583L11.125 10H8.86669L5.50002 13.0583C4.55836 13.9083 4.25002 15.2167 4.70836 16.4C5.16669 17.575 6.28336 18.3333 7.54169 18.3333H12.45C13.7167 18.3333 14.825 17.575 15.2834 16.4C15.7417 15.2167 15.4334 13.9083 14.4917 13.0583ZM11.5167 15.1167H8.48336C8.16669 15.1167 7.91669 14.8583 7.91669 14.55C7.91669 14.2417 8.17502 13.9833 8.48336 13.9833H11.5167C11.8334 13.9833 12.0834 14.2417 12.0834 14.55C12.0834 14.8583 11.825 15.1167 11.5167 15.1167Z"
      fill="white"
    />
    <path
      d="M15.2916 3.59984C14.8333 2.42484 13.7166 1.6665 12.4583 1.6665H7.54164C6.2833 1.6665 5.16664 2.42484 4.7083 3.59984C4.2583 4.78317 4.56664 6.0915 5.5083 6.9415L8.87497 9.99984H11.1333L14.5 6.9415C15.4333 6.0915 15.7416 4.78317 15.2916 3.59984ZM11.5166 6.02484H8.4833C8.16664 6.02484 7.91664 5.7665 7.91664 5.45817C7.91664 5.14984 8.17497 4.8915 8.4833 4.8915H11.5166C11.8333 4.8915 12.0833 5.14984 12.0833 5.45817C12.0833 5.7665 11.825 6.02484 11.5166 6.02484Z"
      fill="white"
    />
  </svg>
);
export { SvgComponent as IconTime };
