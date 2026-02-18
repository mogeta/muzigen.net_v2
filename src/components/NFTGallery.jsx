import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { getContractsForChain } from "../config/nftContracts";

// ERC721 ABI (必要な関数のみ)
const ERC721_ABI = [
    {
        inputs: [{ name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "index", type: "uint256" },
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
];

export default function NFTGallery() {
    const { address, isConnected, chain } = useAccount();
    const publicClient = usePublicClient();
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
            // Oasys/HomeVerseの場合はコントラクトから直接取得
            if (chain?.id === 248 || chain?.id === 19011) {
                await fetchNFTsFromContracts();
                return;
            }

            // Alchemy APIを使用してNFTを取得（Ethereum, Polygon等）
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

    // Oasys/HomeVerse用: コントラクトから直接NFTを取得
    const fetchNFTsFromContracts = async () => {
        if (!publicClient || !address) return;

        try {
            const contracts = getContractsForChain(chain.id);

            if (contracts.length === 0) {
                setNfts([]);
                setLoading(false);
                return;
            }

            const allNfts = [];

            for (const contractAddress of contracts) {
                try {
                    // 1. balanceOf で所有NFT数を取得
                    const balance = await publicClient.readContract({
                        address: contractAddress,
                        abi: ERC721_ABI,
                        functionName: "balanceOf",
                        args: [address],
                    });

                    const balanceNum = Number(balance);

                    if (balanceNum === 0) continue;

                    // 2. コントラクト名を取得
                    let contractName = "Unknown Collection";
                    try {
                        contractName = await publicClient.readContract({
                            address: contractAddress,
                            abi: ERC721_ABI,
                            functionName: "name",
                        });
                    } catch (e) {
                        console.warn("Failed to get contract name:", e);
                    }

                    // 3. 各トークンのIDとメタデータを取得
                    for (let i = 0; i < balanceNum; i++) {
                        try {
                            const tokenId = await publicClient.readContract({
                                address: contractAddress,
                                abi: ERC721_ABI,
                                functionName: "tokenOfOwnerByIndex",
                                args: [address, BigInt(i)],
                            });

                            // tokenURIを取得
                            let tokenURI = "";
                            try {
                                tokenURI = await publicClient.readContract({
                                    address: contractAddress,
                                    abi: ERC721_ABI,
                                    functionName: "tokenURI",
                                    args: [tokenId],
                                });
                            } catch (e) {
                                console.warn(`Failed to get tokenURI for token ${tokenId}:`, e);
                            }

                            // メタデータを取得
                            let metadata = null;
                            if (tokenURI) {
                                try {
                                    // IPFSの場合はHTTPゲートウェイに変換
                                    let metadataUrl = tokenURI;
                                    if (tokenURI.startsWith("ipfs://")) {
                                        metadataUrl = tokenURI.replace(
                                            "ipfs://",
                                            "https://ipfs.io/ipfs/"
                                        );
                                    }

                                    const metadataResponse = await fetch(metadataUrl);
                                    if (metadataResponse.ok) {
                                        metadata = await metadataResponse.json();
                                    }
                                } catch (e) {
                                    console.warn(`Failed to fetch metadata for token ${tokenId}:`, e);
                                }
                            }

                            // NFTデータを構築
                            allNfts.push({
                                contract: { address: contractAddress },
                                tokenId: tokenId.toString(),
                                name: metadata?.name || `${contractName} #${tokenId}`,
                                image: {
                                    cachedUrl: metadata?.image?.startsWith("ipfs://")
                                        ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                                        : metadata?.image,
                                },
                                metadata,
                            });
                        } catch (e) {
                            console.warn(`Failed to fetch token at index ${i}:`, e);
                        }
                    }
                } catch (e) {
                    console.error(`Failed to fetch NFTs from contract ${contractAddress}:`, e);
                }
            }

            setNfts(allNfts);
        } catch (err) {
            console.error("Error fetching NFTs from contracts:", err);
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
