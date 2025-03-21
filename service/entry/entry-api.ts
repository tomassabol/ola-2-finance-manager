import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "~/env";
import { getApiUrl } from "~/util/url";

export const entryApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: getApiUrl(),
    prepareHeaders: (headers) => {
      headers.set("x-api-key", env.EXPO_PUBLIC_API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEntry: builder.query<{ hello: "world" }, void>({
      query: () => "v1/entry",
    }),
  }),
});
