# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — 開発サーバー起動
- `npm run build` — プロダクションビルド
- `npm run start` — ビルド済みアプリの起動
- `npm run lint` — ESLint実行

## Architecture

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4のTODOアプリ。データはlocalStorageに永続化（バックエンドなし）。

### データフロー

```
TodoApp (状態管理・CRUD) → useLocalStorage (永続化)
  ├── TodoInput   — テキスト入力・追加
  ├── TodoList    — フィルター済みリスト表示
  │   └── TodoItem — 個別タスク（チェック・インライン編集・削除）
  └── TodoFilter  — フィルター切り替え・残数表示・一括削除
```

全状態は`TodoApp`で管理し、子コンポーネントはprops経由で受け取る（Lifting State Up）。

### 重要な設計判断

- **SSRハイドレーション対策**: `useLocalStorage`は`isLoaded`フラグを返し、localStorage読み込み完了まではスケルトンUIを表示する
- **ID生成**: `crypto.randomUUID()`はブラウザ互換性問題があるため、`Date.now() + Math.random().toString(36)`を使用
- **ダークモード**: `prefers-color-scheme`によるシステム設定連動（Tailwindの`dark:`プレフィックス）
- **パスエイリアス**: `@/*` → `./src/*`（tsconfig.json）

## Deployment

Vercelにデプロイ済み。`next.config.ts`に`output: "export"`やbasePathを設定しないこと（VercelはネイティブでNext.jsをサポート）。
