import { type SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.0001 1.6665C5.40841 1.6665 1.66675 5.40817 1.66675 9.99984C1.66675 14.5915 5.40841 18.3332 10.0001 18.3332C14.5917 18.3332 18.3334 14.5915 18.3334 9.99984C18.3334 5.40817 14.5917 1.6665 10.0001 1.6665ZM13.6251 12.9748C13.5084 13.1748 13.3001 13.2832 13.0834 13.2832C12.9751 13.2832 12.8667 13.2582 12.7667 13.1915L10.1834 11.6498C9.54175 11.2665 9.06675 10.4248 9.06675 9.68317V6.2665C9.06675 5.92484 9.35008 5.6415 9.69175 5.6415C10.0334 5.6415 10.3167 5.92484 10.3167 6.2665V9.68317C10.3167 9.98317 10.5667 10.4248 10.8251 10.5748L13.4084 12.1165C13.7084 12.2915 13.8084 12.6748 13.6251 12.9748Z"
      fill="#35426D"
    />
  </svg>
);
export { SvgComponent as IconTime };
