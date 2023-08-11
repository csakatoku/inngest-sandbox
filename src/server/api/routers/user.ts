import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { inngest } from "~/server/inngest";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const { email } = input;

      const user = await prisma.$transaction(async (tx) => {
        try {
          const user = await tx.user.create({
            data: {
              email,
            },
          });

          await inngest.send({
            name: "user/create",
            data: {
              userId: user.id,
              email: user.email,
            },
          });

          return user;
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already exists",
            });
          } else {
            throw error;
          }
        }
      });

      return { user };
    }),
});
