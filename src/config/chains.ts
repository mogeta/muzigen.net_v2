import { defineChain } from "viem";

// 🧱 Oasys チェーン定義
export const oasys = defineChain({
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

// 🎮 HomeVerse (Oasys L2) チェーン定義
export const homeverse = defineChain({
    id: 19011,
    name: "HOME Verse",
    network: "homeverse",
    nativeCurrency: {
        name: "OAS",
        symbol: "OAS",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://rpc.mainnet.oasys.homeverse.games/"] },
        public: { http: ["https://rpc.mainnet.oasys.homeverse.games/"] },
    },
    blockExplorers: {
        default: { name: "HOME Verse Explorer", url: "https://explorer.oasys.homeverse.games/" },
    },
});

// 他のカスタムチェーン定義をここに追加できます
