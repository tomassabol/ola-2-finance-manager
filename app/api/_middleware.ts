import { env } from "~/env";

type ApiHandler = (request: Request) => Response | Promise<Response>;

export function withAuth(handler: ApiHandler): ApiHandler {
  return (request: Request) => {
    const authResponse = authMiddleware(request);
    if (authResponse) {
      return authResponse;
    }
    return handler(request);
  };
}

function authMiddleware(request: Request) {
  if (request.headers.get("x-api-key") !== env.EXPO_PUBLIC_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
