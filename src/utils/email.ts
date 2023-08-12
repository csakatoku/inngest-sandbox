import sendgrid from "@sendgrid/mail";
import { env } from "~/env.mjs";
import EmailVerificationEmail from "~/emails/emailVerification";
import { render } from "@react-email/render";

sendgrid.setApiKey(env.SENDGRID_API_KEY);

export async function sendUserActivationKey({
  userId,
  email,
  activationKey,
}: {
  userId: string;
  email: string;
  activationKey: string;
}) {
  await sendgrid.send({
    from: env.SENDGRID_FROM_EMAIL,
    to: email,
    subject: "Verify your email",
    html: render(EmailVerificationEmail({ userId, activationKey })),
  });
}
