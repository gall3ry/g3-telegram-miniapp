"use client";
import { Button, Heading, Section, Table } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "../../../trpc/react";

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

  const summarizeReaction = (reactions: Record<string, number> | undefined) => {
    if (!reactions) {
      return "No reactions";
    }

    return Object.entries(reactions)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <Section>
      <Heading>My OCCs</Heading>
      <Table.Root variant="surface" mt="3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>OCC ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Share Count</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right">
              Reactions
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.occs.map((occ) => (
            <Table.Row key={occ.id}>
              <Table.Cell>{occ.id}</Table.Cell>
              <Table.Cell>{occ._count.Share}</Table.Cell>
              <Table.Cell align="right">
                {summarizeReaction(occ.sumarizedReactions)}
              </Table.Cell>
              <Table.Cell align="right">
                <Link href={`/occ/${occ.id}`}>
                  <Button>View</Button>
                </Link>

                <Button
                  ml="2"
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
