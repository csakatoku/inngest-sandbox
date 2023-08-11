import { EventSchemas, Inngest } from "inngest";

type UserCreate = {
  data: {
    userId: string;
    email: string;
  };
};

type Events = {
  "user/create": UserCreate;
};

export const inngest = new Inngest({
  name: "Inngest Sandbox",
  schemas: new EventSchemas().fromRecord<Events>(),
});
