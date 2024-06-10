"use client";
import { useEffect } from "react";
import { useFooter } from "../../_components/Footer";

export const BottomActions = () => {
  const { setFooter } = useFooter();
  useEffect(
    () => {
      setFooter(<Footer />);

      return () => {
        setFooter(null);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return null;
};

const Footer = () => {
  return (
    <div className="sticky inset-x-0 bottom-0 z-50 flex h-20 items-center gap-3 bg-white px-5 shadow-2xl"></div>
  );
};
