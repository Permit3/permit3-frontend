import React from "react";

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  blastProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  publicProvider
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()]
    // Hide recommended connectors if the user has any connector installed.
    // includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    // order: "random"
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={
        process.env.NEXT_PUBLIC_BLAST_APIKEY
          ? blastProvider({
              apiKey: process.env.NEXT_PUBLIC_BLAST_APIKEY
            })
          : publicProvider()
      }
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
