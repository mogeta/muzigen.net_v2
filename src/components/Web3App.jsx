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
import { oasys, homeverse } from "../config/chains";
import NFTGallery from "./NFTGallery";

// 🚀 wagmi + RainbowKit 設定
const config = getDefaultConfig({
    appName: "My Astro Dapp",
    projectId: "e924e408ba98f7849a0b78d43502aa4c",
    chains: [homeverse, oasys, mainnet],
    transports: {
        [homeverse.id]: http("https://rpc.mainnet.oasys.homeverse.games/"),
        [oasys.id]: http("https://rpc.mainnet.oasys.games/"),
        [mainnet.id]: http(),
    },
});

// 🚀 TanStack Query（React Query）のクライアントを作成
const queryClient = new QueryClient();

export default function Web3App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider>
                    <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h1>Web3 NFT Gallery</h1>
                            <ConnectButton />
                        </div>
                        <NFTGallery />
                    </div>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}
