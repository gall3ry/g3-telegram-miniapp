"use client";
import { Button, Flex, Heading, Section, Table, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import toast from "react-hot-toast";
import { api } from "../../../trpc/react";
import { useIsAuthenticated } from "../../_providers/useAuth";

export function LoggedUserUI() {
  const { isAuthenticated } = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Text>Unauthenticated</Text>;
  }

  return (
    <div>
      {/* <RewardLogList /> */}
      {/* <FormAnimate /> */}
      <OCCCreation />
      <MyOCC />
    </div>
  );
}

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
              occTemplateId: 99_999, // TODO: remove this whole component
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

export const MyOCC = () => {
  const [page, setPage] = useQueryState(
    "my-occ-page",
    parseAsInteger.withDefault(1),
  );
  const router = useRouter();
  const LIMIT = 10;
  const { data } = api.occ.getMyOccs.useQuery({
    limit: LIMIT,
    page,
  });

  return (
    <Section>
      <Heading>My OCCs</Heading>
      <Table.Root variant="surface" mt="3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>OCC ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Share Count</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reactions</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.occs.map((occ) => (
            <Table.Row key={occ.id}>
              <Table.Cell>{occ.id}</Table.Cell>
              <Table.Cell>{occ._count.Share}</Table.Cell>
              <Table.Cell>{occ.shareCount}</Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => {
                    router.push(`/occ/${occ.id}`);
                  }}
                >
                  Share
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Section>
  );
};
