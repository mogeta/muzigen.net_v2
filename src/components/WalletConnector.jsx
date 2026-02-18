import { WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import {
    RainbowKitProvider,
    ConnectButton,
    getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { oasys } from "../config/chains";

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
