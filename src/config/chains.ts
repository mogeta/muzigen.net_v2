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

// 他のカスタムチェーン定義をここに追加できます
// 例：
// export const myCustomChain = defineChain({
//     id: 1234,
//     name: "My Custom Chain",
//     ...
// });
