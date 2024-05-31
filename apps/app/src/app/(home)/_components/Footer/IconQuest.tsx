import { type SVGProps } from "react";
const SvgComponent = ({
  isActive,
  ...props
}: SVGProps<SVGSVGElement> & {
  isActive?: boolean;
}) =>
  isActive ? (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.89331 3.3335V19.2935C4.89331 20.6002 5.50664 21.8402 6.55998 22.6268L13.5066 27.8268C14.9866 28.9335 17.0266 28.9335 18.5066 27.8268L25.4533 22.6268C26.5066 21.8402 27.12 20.6002 27.12 19.2935V3.3335H4.89331Z"
        fill="#DAF200"
      />
      <path
        d="M29.3333 4.3335H2.66663C2.11996 4.3335 1.66663 3.88016 1.66663 3.3335C1.66663 2.78683 2.11996 2.3335 2.66663 2.3335H29.3333C29.88 2.3335 30.3333 2.78683 30.3333 3.3335C30.3333 3.88016 29.88 4.3335 29.3333 4.3335Z"
        fill="#28335A"
      />
      <path
        d="M21.3333 11.6665H10.6666C10.12 11.6665 9.66663 11.2132 9.66663 10.6665C9.66663 10.1198 10.12 9.6665 10.6666 9.6665H21.3333C21.88 9.6665 22.3333 10.1198 22.3333 10.6665C22.3333 11.2132 21.88 11.6665 21.3333 11.6665Z"
        fill="#28335A"
      />
      <path
        d="M21.3333 18.3335H10.6666C10.12 18.3335 9.66663 17.8802 9.66663 17.3335C9.66663 16.7868 10.12 16.3335 10.6666 16.3335H21.3333C21.88 16.3335 22.3333 16.7868 22.3333 17.3335C22.3333 17.8802 21.88 18.3335 21.3333 18.3335Z"
        fill="#28335A"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M29.3333 4.33301H2.66663C2.11996 4.33301 1.66663 3.87967 1.66663 3.33301C1.66663 2.78634 2.11996 2.33301 2.66663 2.33301H29.3333C29.88 2.33301 30.3333 2.78634 30.3333 3.33301C30.3333 3.87967 29.88 4.33301 29.3333 4.33301Z"
        fill="#959DB2"
      />
      <path
        d="M4.89331 3.33301V19.293C4.89331 20.5997 5.50664 21.8397 6.55998 22.6263L13.5066 27.8263C14.9866 28.933 17.0266 28.933 18.5066 27.8263L25.4533 22.6263C26.5066 21.8397 27.12 20.5997 27.12 19.293V3.33301H4.89331ZM21.3333 18.333H10.6666C10.12 18.333 9.66664 17.8797 9.66664 17.333C9.66664 16.7863 10.12 16.333 10.6666 16.333H21.3333C21.88 16.333 22.3333 16.7863 22.3333 17.333C22.3333 17.8797 21.88 18.333 21.3333 18.333ZM21.3333 11.6663H10.6666C10.12 11.6663 9.66664 11.213 9.66664 10.6663C9.66664 10.1197 10.12 9.66634 10.6666 9.66634H21.3333C21.88 9.66634 22.3333 10.1197 22.3333 10.6663C22.3333 11.213 21.88 11.6663 21.3333 11.6663Z"
        fill="#959DB2"
      />
    </svg>
  );
export { SvgComponent as IconQuests };