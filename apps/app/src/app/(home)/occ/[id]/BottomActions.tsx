"use client";
import { Button } from "@radix-ui/themes";
import { postEvent } from "@tma.js/sdk";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaTelegram } from "react-icons/fa6";
import { api } from "../../../../trpc/react";
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
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: occ } = api.occ.getOcc.useQuery(undefined, {
    enabled: !!id,
  });

  return (
    <div className="sticky inset-x-0 bottom-0 z-50 flex h-20 items-center gap-3 bg-white px-5 shadow-2xl">
      <Button
        radius="large"
        variant="outline"
        size="4"
        onClick={() => {
          router.back();
        }}
      >
        Close
      </Button>

      <Button
        radius="large"
        size="4"
        className="flex-1"
        onClick={() => {
          if (!occ) return;
          postEvent("web_app_switch_inline_query", {
            query: `${id}`,
            chat_types: ["channels", "groups", "users"],
          });
        }}
      >
        <FaTelegram size="22px" />
        <div className="text-xl font-bold leading-7 text-slate-900">
          Share this Epic
        </div>
      </Button>
    </div>
  );
};
