"use client";
import { Box, Heading, Spinner, Table } from "@radix-ui/themes";
import { formatNumber } from "@repo/utils";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "../../../trpc/react";
import { useIsAuthenticated } from "../../_providers/useAuth";

export const RewardLogList = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const LIMIT = 10;
  const [page] = useQueryState("reward_page", parseAsInteger.withDefault(1));
  const { data, isPending, isSuccess } = api.reward.getMyRewardLogList.useQuery(
    { limit: LIMIT, page },
    {
      enabled: isAuthenticated,
    },
  );

  return (
    <Box my="3">
      <Heading size="5">Reward Logs</Heading>
      <Spinner loading={isPending}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Reward Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Points</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isSuccess &&
              data.items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.taskId}</Table.Cell>
                  <Table.Cell>
                    {format(item.createdAt, "yyyy-MM-dd HH:mm:ss")}
                  </Table.Cell>

                  <Table.Cell>{formatNumber(item.point)}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      </Spinner>
    </Box>
  );
};
