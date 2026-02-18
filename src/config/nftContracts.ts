// NFTコントラクトの設定
// チェーンIDごとに監視するNFTコントラクトアドレスを定義

export const NFT_CONTRACTS: Record<number, string[]> = {
    // Oasys Mainnet (Chain ID: 248)
    248: [
        // Oasys上のNFTコントラクトアドレスをここに追加
    ],

    // HOME Verse (Chain ID: 19011)
    19011: [
        "0x3e1fc434eE0197a3309ad0df1Af96C2D6E7706F6", // テスト用NFT
    ],

    // 他のチェーンのコントラクトアドレスを追加可能
    // 例:
    // 1: ["0x..."], // Ethereum Mainnet
    // 137: ["0x..."], // Polygon
};

// コントラクトアドレスをチェーンIDで取得
export function getContractsForChain(chainId: number): string[] {
    return NFT_CONTRACTS[chainId] || [];
}
