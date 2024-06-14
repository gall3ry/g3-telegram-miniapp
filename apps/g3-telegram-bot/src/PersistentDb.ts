import { Chat } from "telegraf/types";

type UserId = number;

type Data = {
  stickerId?: number;
  chatType?: "sender" | Chat["type"];
};

export class PersistentDb {
  private static instance: PersistentDb;

  private constructor() {}

  public static getInstance(): PersistentDb {
    if (!PersistentDb.instance) {
      PersistentDb.instance = new PersistentDb();
    }

    return PersistentDb.instance;
  }

  private userData = new Map<UserId, Data>();

  public getUserData(userId: UserId): Data {
    return this.userData.get(userId) || {};
  }

  public appendUserData(userId: UserId, data: Data) {
    const userData = this.getUserData(userId);
    this.userData.set(userId, { ...userData, ...data });
  }

  public resetUserData(userId: UserId) {
    this.userData.delete(userId);
  }
}

export const persistentDb = PersistentDb.getInstance();
