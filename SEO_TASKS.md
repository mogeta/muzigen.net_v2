# SEO機能実装タスクリスト

このファイルは、ブログサイトのSEO改善のために必要な機能実装タスクをまとめたものです。

## 実装方針
- 各タスクごとにブランチを作成
- 実装完了後にPRを作成してレビュー
- 優先度順に実装

---

## タスク一覧

### ✅ 完了済み

#### タスク1: RSS/Atomフィードの実装 ✅
- 実装日: 2026-01-01
- `/src/pages/rss.xml.ts` - Firestore記事用
- `/src/pages/posts/rss.xml.ts` - Content Collections用
- Layout.astroにRSSフィードのlinkタグ追加済み

#### タスク2: JSON-LD構造化データの実装 ✅
- 実装日: 2026-01-01
- `BlogPostingSchema.astro` - 記事ページ用
- `BreadcrumbSchema.astro` - パンくずリスト用
- `OrganizationSchema.astro` - サイト情報用
- `PersonSchema.astro` - 著者情報用

#### タスク3: 記事日付のOGPメタタグ追加 ✅
- 実装日: 2026-01-01
- `article:published_time` メタタグ追加
- `article:modified_time` メタタグ追加
- Layout.astroに実装済み

#### タスク4: Canonical URLの追加 ✅
- 実装日: 2026-01-01
- `<link rel="canonical">` タグ追加
- クエリパラメータを除外した正規URL生成
- Layout.astroに実装済み

### 🚀 優先度: 高

#### タスク1: RSS/Atomフィードの実装
- **目的**: 新規コンテンツの迅速なインデックス化、フィードリーダー対応
- **作業内容**:
  - `@astrojs/rss` パッケージのインストール
  - `/src/pages/rss.xml.ts` の作成（Firestore記事用）
  - `/src/pages/posts/rss.xml.ts` の作成（Content Collections用）
  - Layout.astroにRSSフィードのlinkタグを追加
  - 公開済み記事のみをフィードに含める
- **参考**: [Astro RSS公式ドキュメント](https://docs.astro.build/en/guides/rss/)
- **PR**: 未作成

#### タスク2: JSON-LD構造化データの実装
- **目的**: リッチリザルト対応、検索結果の強化表示
- **作業内容**:
  - 記事ページ用のJSON-LDコンポーネント作成
  - `BlogPosting` スキーマの実装
  - `Organization` スキーマの実装（サイト情報）
  - `BreadcrumbList` スキーマの実装
  - `/src/pages/blog/[id].astro` に適用
  - `/src/pages/posts/[...slug].astro` に適用
  - トップページにも基本的な構造化データを追加
- **参考**: [Schema.org BlogPosting](https://schema.org/BlogPosting)
- **PR**: 未作成

### 🔶 優先度: 中

#### タスク3: 記事日付のOGPメタタグ追加
- **目的**: SNSシェア時の情報充実、検索エンジンへの日付情報提供
- **作業内容**:
  - Layout.astroにプロパティ追加（publishedTime, modifiedTime, author）
  - `article:published_time` メタタグの追加
  - `article:modified_time` メタタグの追加
  - `article:author` メタタグの追加
  - 記事ページから適切な値を渡す
- **PR**: 未作成

#### タスク4: Canonical URLの追加
- **目的**: 重複コンテンツ対策、正規URLの明示
- **作業内容**:
  - Layout.astroに `canonicalURL` プロパティ追加
  - `<link rel="canonical">` タグの追加
  - 全ページで `Astro.url` を使用して自動設定
  - 環境変数 `SITE_URL` の設定（本番URL）
- **PR**: 未作成

### 🔵 優先度: 低（将来的な改善）

#### タスク5: OG画像サイズ指定
- **作業内容**:
  - `og:image:width` メタタグの追加
  - `og:image:height` メタタグの追加
  - デフォルト値: 1200x630（推奨サイズ）
- **PR**: 未作成

#### タスク6: タグ/カテゴリーページの実装
- **作業内容**:
  - タグ一覧ページの作成
  - タグ別記事一覧ページの作成
  - 記事ページからタグへのリンク追加
- **PR**: 未作成

#### タスク7: パンくずナビゲーション
- **作業内容**:
  - パンくずコンポーネントの作成
  - 記事ページに追加
  - 構造化データ（BreadcrumbList）との連携
- **PR**: 未作成

#### タスク8: 関連記事表示
- **作業内容**:
  - タグベースの関連記事取得ロジック
  - 関連記事コンポーネントの作成
  - 記事ページ下部に表示
- **PR**: 未作成

---

## 進捗状況

| タスク | 優先度 | ステータス | 実装日 | 備考 |
|--------|--------|-----------|--------|------|
| タスク1: RSS/Atomフィード | 高 | ✅ 完了 | 2026-01-01 | Firestore & Content Collections対応 |
| タスク2: JSON-LD構造化データ | 高 | ✅ 完了 | 2026-01-01 | BlogPosting, Breadcrumb, Organization, Person |
| タスク3: 記事日付OGPメタタグ | 中 | ✅ 完了 | 2026-01-01 | published_time, modified_time |
| タスク4: Canonical URL | 中 | ✅ 完了 | 2026-01-01 | クエリパラメータ除外対応 |
| タスク5: OG画像サイズ指定 | 低 | ✅ 完了 | 2026-01-01 | 1200x630推奨サイズ |
| タスク6: タグ/カテゴリーページ | 低 | ✅ 完了 | 2026-01-01 | タグ一覧、タグ別記事一覧、クリッカブルタグ |
| タスク7: パンくずナビゲーション | 低 | ✅ 完了 | 2026-01-01 | UI component + JSON-LD |
| タスク8: 関連記事表示 | 低 | ✅ 完了 | 2026-01-01 | タグベース、記事下部に表示 |

---

## 実装開始日
2026-01-01

## 備考
- FirebaseベースとContent Collectionsベースの2つのブログシステムがあるため、両方に対応する必要がある
- 実装時は既存のコードスタイルとTypeScript strict設定に従う
