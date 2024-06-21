import { type SwitchInlineQueryChatType, postEvent } from '@tma.js/sdk';
import { useCallback, useId } from 'react';
import toast from 'react-hot-toast';

export const useWebAppSwitchInlineQuery = () => {
  const id = useId();
  const postSwitchInlineQuery = useCallback(
    ({
      chatTypes,
      query,
    }: {
      query: string;
      chatTypes: SwitchInlineQueryChatType[];
    }) => {
      try {
        postEvent<'web_app_switch_inline_query'>(
          'web_app_switch_inline_query',
          {
            query,
            chat_types: chatTypes,
          }
        );
      } catch (error) {
        console.error(error);
        toast.error(`Your device does not support this feature`, { id });
      }
    },
    [id]
  );

  return { postSwitchInlineQuery };
};
