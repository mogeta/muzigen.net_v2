---
title: "はじめてのAstroマークダウン"
description: "Astroでマークダウンを使ったページ生成のサンプル記事です。"
pubDate: 2024-01-15
author: "サンプル太郎"
tags: ["astro", "markdown", "tutorial"]
---

# はじめてのAstroマークダウン

これはAstroのContent Collectionsを使ったサンプルの記事です。

## マークダウンの基本機能

### 見出し

見出しは`#`を使って作成できます。

### リスト

- 項目1
- 項目2
- 項目3

### コードブロック

```javascript
const message = "Hello, Astro!";
console.log(message);
```

### Mermaid図

```mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

### 引用

> これは引用文のサンプルです。マークダウンでは`>`を使って引用を表現できます。

## まとめ

Astroのマークダウン機能を使うことで、静的なコンテンツを簡単に管理できます。