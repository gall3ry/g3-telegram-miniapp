import { type Metadata } from "next";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import { db } from "../../../../server/db";
import { BottomActions } from "./BottomActions";
import { TemplateInfo } from "./TemplateInfo";

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  unstable_noStore();
  const sticker = await db.sticker.findUniqueOrThrow({
    where: {
      id: +params.id,
    },
  });

  const title = `Sticker #${sticker.id}`;
  const images = [];

  if (sticker.imageUrl) {
    images.push({
      url: sticker.imageUrl,
    });
  }

  return {
    title,
    openGraph: {
      title,
      images,
    },
  } satisfies Metadata;
}

const TemplateId = () => {
  return (
    <div>
      <Suspense fallback={<></>}>
        <TemplateInfo />
        <BottomActions />
      </Suspense>
    </div>
  );
};

export default TemplateId;
