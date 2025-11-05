/**
 * HomeVerse Explorer API ユーティリティ
 * https://explorer.oasys.homeverse.games のAPIを使用してNFTデータを取得
 */

const HOMEVERSE_EXPLORER_API_BASE = "https://explorer.oasys.homeverse.games/api/v2";

export interface NFTCollection {
    token: {
        address: string;
        name: string;
        symbol: string;
        type: string;
    };
    amount: string;
    token_instances?: Array<{
        id: string;
        image_url?: string;
        metadata?: any;
        token?: {
            address: string;
            name: string;
            symbol: string;
        };
    }>;
}

export interface NFTCollectionsResponse {
    items: NFTCollection[];
    next_page_params: any;
}

/**
 * 指定されたアドレスが所有するNFTコレクションのリストを取得
 * @param address ウォレットアドレス
 * @param type NFTタイプ (オプション: "ERC-721" または "ERC-1155")
 * @returns NFTコレクションのリスト
 */
export async function fetchNFTCollections(
    address: string,
    type?: string
): Promise<NFTCollectionsResponse> {
    const url = new URL(`${HOMEVERSE_EXPLORER_API_BASE}/addresses/${address}/nft/collections`);

    if (type) {
        url.searchParams.set("type", type);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch NFT collections: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 指定されたアドレスが所有する特定のNFTインスタンスを取得
 * @param address ウォレットアドレス
 * @param type NFTタイプ (オプション)
 * @returns NFTインスタンスのリスト
 */
export async function fetchNFTInstances(
    address: string,
    type?: string
): Promise<any> {
    const url = new URL(`${HOMEVERSE_EXPLORER_API_BASE}/addresses/${address}/nft`);

    if (type) {
        url.searchParams.set("type", type);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Failed to fetch NFT instances: ${response.statusText}`);
    }

    return response.json();
}

/**
 * 特定のトークンコントラクトの情報を取得
 * @param tokenAddress トークンコントラクトアドレス
 * @returns トークン情報
 */
export async function fetchTokenInfo(tokenAddress: string): Promise<any> {
    const url = `${HOMEVERSE_EXPLORER_API_BASE}/tokens/${tokenAddress}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.statusText}`);
    }

    return response.json();
}
