import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function NFTGallery() {
    const { address, isConnected, chain } = useAccount();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isConnected && address) {
            fetchNFTs();
        } else {
            setNfts([]);
        }
    }, [address, isConnected, chain]);

    const fetchNFTs = async () => {
        setLoading(true);
        setError(null);

        try {
            // Alchemy APIを使用してNFTを取得
            // APIキーは環境変数から取得（後で設定が必要）
            const apiKey = import.meta.env.PUBLIC_ALCHEMY_API_KEY;

            if (!apiKey) {
                // APIキーがない場合はデモデータを表示
                setNfts([
                    {
                        contract: { address: "0x..." },
                        tokenId: "1",
                        name: "Sample NFT #1",
                        image: { cachedUrl: "https://via.placeholder.com/300" },
                    },
                    {
                        contract: { address: "0x..." },
                        tokenId: "2",
                        name: "Sample NFT #2",
                        image: { cachedUrl: "https://via.placeholder.com/300" },
                    },
                ]);
                setLoading(false);
                return;
            }

            // チェーンに応じてAlchemy APIのエンドポイントを選択
            let baseUrl;
            switch (chain?.id) {
                case 1: // Ethereum Mainnet
                    baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;
                    break;
                case 137: // Polygon
                    baseUrl = `https://polygon-mainnet.g.alchemy.com/nft/v3/${apiKey}`;
                    break;
                case 248: // Oasys
                    // Oasysの場合は独自のNFT取得ロジックが必要
                    setError("Oasys NFT取得は現在準備中です");
                    setLoading(false);
                    return;
                default:
                    setError("このチェーンはサポートされていません");
                    setLoading(false);
                    return;
            }

            const response = await fetch(
                `${baseUrl}/getNFTsForOwner?owner=${address}&withMetadata=true`
            );

            if (!response.ok) {
                throw new Error("NFTの取得に失敗しました");
            }

            const data = await response.json();
            setNfts(data.ownedNfts || []);
        } catch (err) {
            console.error("Error fetching NFTs:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>ウォレットを接続してNFTを表示します</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>NFTを読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
                <p>エラー: {error}</p>
            </div>
        );
    }

    if (nfts.length === 0) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>NFTが見つかりませんでした</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>あなたのNFTコレクション ({nfts.length}個)</h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {nfts.map((nft, index) => (
                    <div
                        key={`${nft.contract?.address}-${nft.tokenId}-${index}`}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "10px",
                            backgroundColor: "#fff",
                        }}
                    >
                        {nft.image?.cachedUrl || nft.image?.thumbnailUrl || nft.media?.[0]?.gateway ? (
                            <img
                                src={
                                    nft.image?.cachedUrl ||
                                    nft.image?.thumbnailUrl ||
                                    nft.media?.[0]?.gateway
                                }
                                alt={nft.name || `NFT #${nft.tokenId}`}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/200?text=No+Image";
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    backgroundColor: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                }}
                            >
                                <span>画像なし</span>
                            </div>
                        )}
                        <h3 style={{ fontSize: "14px", marginTop: "10px" }}>
                            {nft.name || nft.title || `NFT #${nft.tokenId}`}
                        </h3>
                        <p style={{ fontSize: "12px", color: "#666" }}>
                            Token ID: {nft.tokenId}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
