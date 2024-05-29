"use client";
import { Button, Heading, Section, Table } from "@radix-ui/themes";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import toast from "react-hot-toast";
import { FaTelegram } from "react-icons/fa6";
import { api } from "../../../trpc/react";
import { useMiniApp } from "../../_providers/MiniappProvider";

export const MyOCC = () => {
  const [page, setPage] = useQueryState(
    "my-occ-page",
    parseAsInteger.withDefault(1),
  );
  const LIMIT = 10;
  const { data } = api.occ.getMyOccs.useQuery({
    limit: LIMIT,
    page,
  });
  const { miniApp } = useMiniApp();

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
                <Button asChild>
                  <Link href={`/occ/${occ.id}`}>View</Link>
                </Button>

                <Button
                  ml="2"
                  variant="outline"
                  onClick={() => {
                    try {
                      miniApp?.switchInlineQuery(
                        `${occ.occTemplateId}-${occ.id}`,
                        ["channels", "users", "groups"],
                      );
                    } catch (error) {
                      if (
                        error instanceof Error &&
                        error.message ===
                          "Method is unsupported because Mini App should be launched in inline mode."
                      ) {
                        toast.error(error.message);
                      }
                    }
                  }}
                >
                  <FaTelegram />
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
