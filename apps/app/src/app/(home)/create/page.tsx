"use client";
import { Button, Spinner } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
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
  const { mutateAsync, isPending: isCreatingOCC } =
    api.occ.createOCC.useMutation();
  const router = useRouter();

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

        <div className="my-4">
          <Button
            loading={isCreatingOCC}
            onClick={async () => {
              await toast.promise(
                mutateAsync({
                  occTemplateId: 99999, // TODO: remove this whole component
                }),
                {
                  loading: "Creating OCC...",
                  success: (data) => {
                    router.push(`/occ/${data.id}`);

                    return "OCC created";
                  },
                  error: "Failed to create OCC",
                },
              );
            }}
            size="3"
          >
            Create OCC (Test)
          </Button>
        </div>

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
