import { Button } from "@react-email/button";
import { Html } from "@react-email/html";

export default function Email({
  userId,
  activationKey,
}: {
  userId: string;
  activationKey: string;
}) {
  const text = activationKey || "Click here to activate your account";

  return (
    <Html>
      <Button
        pX={20}
        pY={12}
        href={`${process.env.BASE_URL}/users/${userId}/activate/${activationKey}`}
        style={{ background: "#000", color: "#fff" }}
      >
        {text}
      </Button>
    </Html>
  );
}
