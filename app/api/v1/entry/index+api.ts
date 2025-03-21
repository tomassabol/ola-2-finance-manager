import { withAuth } from "../../_middleware";

export const GET = withAuth((request: Request) => {
  return Response.json({ hello: "world" });
});
