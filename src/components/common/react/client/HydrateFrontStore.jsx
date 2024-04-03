import React from "react";
import { createClient } from "urql";
import Hydrate from "./Hydrate";
import { SocketIOProvider } from "@components/common/context/socketIO";

const client = createClient({
  url: "/api/graphql",
});

export default function HydrateFrontStore() {
  return (
    <SocketIOProvider>
      <Hydrate client={client} />
    </SocketIOProvider>
  );
}
