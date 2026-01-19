import React from "react";
import { QueryProvider } from "@app/providers/query-provider";
import { RouterProvider } from "@app/providers/router-provider";
import { AppRouter } from "@app/router";
import "@app/styles/global.scss";

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <RouterProvider>
        <AppRouter />
      </RouterProvider>
    </QueryProvider>
  );
};
