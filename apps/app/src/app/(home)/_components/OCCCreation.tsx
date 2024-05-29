"use client";
import { Button, Flex, Heading } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "../../../trpc/react";

export const OCCCreation = () => {
  const { mutateAsync, isPending } = api.occ.createOCC.useMutation();
  const router = useRouter();

  return (
    <Flex direction="column" gap="4">
      <Heading>Occ Creation</Heading>

      <Button
        loading={isPending}
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
      >
        Create OCC
      </Button>
    </Flex>
  );
};
