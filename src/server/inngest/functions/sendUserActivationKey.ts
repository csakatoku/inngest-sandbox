import { prisma } from "~/server/db";
import { inngest } from "~/server/inngest/client";
import * as emailUtil from "~/utils/email";

export const sendUserActivationKey = inngest.createFunction(
  { name: "Send user activation key" },
  { event: "user/create" },
  async ({ event }) => {
    const { userId, email } = event.data;

    const userActivationKey = await prisma.$transaction(async (tx) => {
      const activationKey = generateActivationKey(32);

      const userActivationKey = await tx.userActivationKey.create({
        data: {
          userId,
          email,
          activationKey,
          expiresAt: new Date(Date.now() + 86400 * 1000), // expires in 24 hours
        },
      });

      await emailUtil.sendUserActivationKey({ userId, email, activationKey });

      return userActivationKey;
    });

    return { userActivationKey };
  }
);

function generateActivationKey(length: number) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;

  let result = "";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
