import { useEffect, useState } from "react";
import { fetchNFTCollections } from "../utils/homeverse-api";

/**
 * HomeVerseのNFTコレクションを表示するコンポーネント
 * @param {Object} props
 * @param {string} props.address - ウォレットアドレス
 * @param {string} [props.type] - NFTタイプ (オプション: "ERC-721" または "ERC-1155")
 */
export default function HomeVerseNFTList({ address, type }) {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (address) {
            loadNFTCollections();
        }
    }, [address, type]);

    const loadNFTCollections = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchNFTCollections(address, type);
            setCollections(data.items || []);
        } catch (err) {
            console.error("Error fetching NFT collections:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>NFTコレクションを読み込み中...</p>
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

    if (collections.length === 0) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>NFTコレクションが見つかりませんでした</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>NFTコレクション ({collections.length}個)</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
                Address: {address}
            </p>

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                }}
            >
                {collections.map((collection, index) => (
                    <div
                        key={`${collection.token.address}-${index}`}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            backgroundColor: "#fff",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <h3 style={{ margin: "0 0 10px 0" }}>
                                    {collection.token.name || "Unknown Collection"}
                                </h3>
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                                    Symbol: {collection.token.symbol || "N/A"}
                                </p>
                                <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                                    Type: {collection.token.type || "N/A"}
                                </p>
                                <p
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "12px",
                                        color: "#999",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    Contract: {collection.token.address}
                                </p>
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#f0f0f0",
                                    padding: "10px 20px",
                                    borderRadius: "20px",
                                    fontWeight: "bold",
                                }}
                            >
                                {collection.amount} NFTs
                            </div>
                        </div>

                        {collection.token_instances && collection.token_instances.length > 0 && (
                            <div style={{ marginTop: "20px" }}>
                                <h4 style={{ marginBottom: "10px" }}>所有しているNFT:</h4>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                        gap: "10px",
                                    }}
                                >
                                    {collection.token_instances.map((instance, idx) => (
                                        <div
                                            key={`${instance.id}-${idx}`}
                                            style={{
                                                border: "1px solid #eee",
                                                borderRadius: "4px",
                                                padding: "10px",
                                            }}
                                        >
                                            {instance.image_url ? (
                                                <img
                                                    src={instance.image_url}
                                                    alt={`NFT #${instance.id}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        backgroundColor: "#f0f0f0",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    No Image
                                                </div>
                                            )}
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    fontSize: "12px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                #{instance.id}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
