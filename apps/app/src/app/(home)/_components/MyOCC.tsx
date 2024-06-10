"use client";
import { Button, Heading, Section, Table } from "@radix-ui/themes";
import { postEvent } from "@tma.js/sdk";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { FaTelegram } from "react-icons/fa6";
import { api } from "../../../trpc/react";

export const MyOCC = () => {
  const [page] = useQueryState("my-occ-page", parseAsInteger.withDefault(1));
  const LIMIT = 1000;
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
            <Table.ColumnHeaderCell>Partner share</Table.ColumnHeaderCell>
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
              <Table.ColumnHeaderCell>{occ.shareCount}</Table.ColumnHeaderCell>
              <Table.Cell>{occ.totalShare}</Table.Cell>
              <Table.Cell align="right">
                {occ.reactions?.map((reaction) => (
                  <div
                    key={reaction.unifiedCode}
                    className="flex items-center gap-1.5"
                  >
                    <Emoji
                      emojiStyle={EmojiStyle.APPLE}
                      unified={reaction.unifiedCode}
                      size={24}
                    />

                    <div>{reaction.count}</div>
                  </div>
                ))}
              </Table.Cell>

              <Table.Cell align="right">
                <Button asChild>
                  <Link href={`/occ/${occ.id}`}>View</Link>
                </Button>

                <Button
                  ml="2"
                  variant="outline"
                  onClick={() => {
                    postEvent("web_app_switch_inline_query", {
                      query: `${occ.id}`,
                      chat_types: ["channels", "groups", "users"],
                    });
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
