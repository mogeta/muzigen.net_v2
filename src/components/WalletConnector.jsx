import React from "react";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import {
    RainbowKitProvider,
    ConnectButton,
    getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import {defineChain} from "viem";

// 🧱 Oasys チェーン定義（必要に応じてRPCを変更可能）
const oasys = defineChain({
    id: 248,
    name: "Oasys",
    network: "oasys",
    nativeCurrency: {
        name: "OAS",
        symbol: "OAS",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://rpc.mainnet.oasys.games/"] },
        public: { http: ["https://rpc.mainnet.oasys.games/"] },
    },
    blockExplorers: {
        default: { name: "OasysScan", url: "https://scan.oasys.games/" },
    },
});

// 🚀 wagmi + RainbowKit 設定
const config = getDefaultConfig({
    appName: "My Astro Dapp",
    projectId: "e924e408ba98f7849a0b78d43502aa4c",
    chains: [oasys, mainnet],
    transports: {
        [oasys.id]: http("https://rpc.mainnet.oasys.games/"),
        [mainnet.id]: http(),
    },
});

// 🚀 TanStack Query（React Query）のクライアントを作成
const queryClient = new QueryClient();

export default function WalletConnector() {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider>
                    <ConnectButton />
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}
