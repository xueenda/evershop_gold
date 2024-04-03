import React from "react";
import { renderToString } from "react-dom/server";
import ServerHtml from "@components/common/react/server/Server";
import { AppProvider } from "@components/common/context/app";
import { SocketIOProvider } from "@components/common/context/socketIO";

export function renderHtml(js, css, contextData, langeCode) {
  const source = renderToString(
    <AppProvider value={JSON.parse(contextData)}>
      <SocketIOProvider>
        <ServerHtml
          js={js}
          css={css}
          appContext={`var eContext = ${contextData}`}
        />
      </SocketIOProvider>
    </AppProvider>
  );

  return `<!DOCTYPE html><html id="root" lang="${langeCode}">${source}</html>`;
}
