/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Card, Heading, Section, Table } from "@radix-ui/themes";
import { FaTelegram } from "react-icons/fa6";
import { api } from "../../../../trpc/react";

interface PageParams {
  params: Params;
}

interface Params {
  id: string;
}

const Page = (pageParams: PageParams) => {
  const id = pageParams.params.id;

  const { data } = api.occ.getSharedPosts.useQuery({
    occId: +id,
  });

  const formatSumaryReaction = (sumarizedReactions: any) => {
    // convert to arr
    const arr = Object.entries(sumarizedReactions);

    return arr.map(([key, value]) => `${key}: ${value}`).join(", ");
  };

  return (
    <Card>
      <Section>
        <Heading>All shared posts</Heading>

        <Table.Root mt="3" variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Message ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Group name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">
                Reactions
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.shareList.map((share) => (
              <Table.Row key={share.id}>
                <Table.Cell>{share.messageId}</Table.Cell>
                <Table.Cell>{share.superGroupUsername}</Table.Cell>
                <Table.Cell align="right">
                  {formatSumaryReaction(share.sumarizedReactions)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Section>

      <Button
        onClick={() => {
          // TODO: implement share button here
        }}
      >
        <FaTelegram />
        Share
      </Button>
    </Card>
  );
};

export default Page;
