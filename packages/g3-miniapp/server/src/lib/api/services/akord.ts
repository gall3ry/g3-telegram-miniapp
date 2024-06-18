import { Akord, Auth } from '@akord/akord-js';
import { createFileLike } from '@akord/akord-js/lib/core/file';
import { env } from '@gall3ry/g3-miniapp-env';
export enum VaultName {
  AVATAR = 'a2e4c103-b5b7-444b-a8dc-2a63eddddad4',
}

const getAkordInstance = async () => {
  const { wallet } = await Auth.signIn(env.AKORD_EMAIL, env.AKORD_PASSWORD);
  const akord = Akord.init(wallet);

  return akord;
};

export const akord = getAkordInstance();

/**
 * Upload a file to Akord
 */
export const uploadToAkord = async ({
  vaultName,
  url,
  fileName = 'image',
}: {
  vaultName: VaultName;
  fileName?: string; // without extension
  url: string;
}) => {
  const instance = await akord;

  //   buffer
  const arrBuffer = await fetch(url).then((res) => res.arrayBuffer());

  const { uri } = await instance.stack.create(
    vaultName,
    await createFileLike(arrBuffer, {
      name: `${fileName}.jpg`,
      mimeType: 'image/jpeg',
    })
  );

  return `${instance.api.config.apiurl}/files/${uri}`;
};
