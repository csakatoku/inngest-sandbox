import { serve } from "inngest/next";
import { inngest, functions } from "~/server/inngest";

export default serve(inngest, functions);
