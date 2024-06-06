"use client";
import { Button, Spinner } from "@radix-ui/themes";
import { Suspense } from "react";
import { api } from "../../../trpc/react";
import { LoggedUserOnly } from "../_components/LoggedUserOnly";
import { MyOCC } from "../_components/MyOCC";
import { EpicItem } from "./EpicItem";

const Page = () => {
  const LIMIT = 10;
  const PAGE = 1;
  const { data, isPending, isSuccess } = api.occ.getEpicTemplates.useQuery({
    limit: LIMIT,
    page: PAGE,
  });

  return (
    <div>
      <div className="flex justify-center gap-2">
        <Button>Epic templates</Button>
        <Button color="gray" variant="outline">
          Created Epics
        </Button>
      </div>

      <div className="mt-4">
        <Spinner loading={isPending} className="mt-4">
          {isSuccess &&
            data.items.map((item) => (
              <EpicItem
                key={item.id}
                name={item.name}
                description={item.description}
                occMinted={item._count.Occ}
                hasYouMinted={false}
                href={`/templates/${item.id}`}
              />
            ))}
        </Spinner>

        <Suspense>
          <MyOCC />
        </Suspense>
      </div>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <LoggedUserOnly>
      <Page />
    </LoggedUserOnly>
  );
}
