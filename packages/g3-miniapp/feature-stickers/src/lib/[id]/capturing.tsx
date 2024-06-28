import { db } from '@gall3ry/g3-miniapp-server';
import { api } from '@gall3ry/g3-miniapp-trpc-client/server';
import { type Metadata } from 'next';
import { unstable_noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import { Sticker } from './Sticker';

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  unstable_noStore();
  const sticker = await db.sticker.findUnique({
    where: {
      id: +params.id,
    },
  });

  if (!sticker) {
    notFound();
  }

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
  };
}

const Page = async ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  const sticker = await api.sticker
    .getSticker({
      id: +id,
    })
    .catch(() => {
      notFound();
    });

  if (!sticker) {
    notFound();
  }

  return (
    <div>
      <Sticker sticker={sticker} shouldRecord />
    </div>
  );
};
export { Page };
