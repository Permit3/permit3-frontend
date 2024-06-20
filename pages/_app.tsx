import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { StarknetProvider } from "@/components/starknet/StarknetProvider";
import { store } from "../store/root";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import { Provider } from "react-redux";
import NotificationProvider from "@/utils/notification/NotificationProvider";
import { GlobalModal } from "@/components/ui/modals/ModalContext";
import BackgroundWrapper from "../components/ui/wrappers/BackgroundWrapper";

export default function App({ Component, pageProps }: AppProps) {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      enabled: true
    });
  }
  return (
    <React.StrictMode>
      <Sentry.ErrorBoundary fallback={<>An error has occurred.</>}>
        <Provider store={store}>
          <StarknetProvider>
            <NotificationProvider>
              <GlobalModal>
                <BackgroundWrapper>
                  <Component {...pageProps} />
                </BackgroundWrapper>
              </GlobalModal>
            </NotificationProvider>
          </StarknetProvider>
        </Provider>
      </Sentry.ErrorBoundary>
    </React.StrictMode>
  );
}
