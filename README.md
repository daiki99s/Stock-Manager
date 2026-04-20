# 📦 StockManager

ブラウザ上でサクサク動く、モダンでクリーンなフロントエンド完結型の在庫管理ダッシュボードです。ローカルストレージを活用しているため、環境構築やデータベースの準備なしで、すぐに実用的な在庫管理を始められます。

![StockManager Screenshot](./public/screenshot.png) ## 主な機能 (Features)

- **リアルタイムダッシュボード**: 総アイテム数、在庫わずか、在庫切れのステータスを一目で把握。
- **CRUD機能**: アイテムの新規登録、編集、数量の増減、削除がシームレスに行えます。
- **高度な検索・絞り込み**:
    - SKU（管理番号）や商品名でのテキスト検索
    - ステータス（在庫あり / わずか / 欠品）によるフィルター機能の掛け合わせ
- **堅牢なバリデーション**:
    - SKUの重複登録防止機能
    - 入力時の自動トリミング（不要な空白の削除）
- **データ永続化**: ブラウザのLocal Storageに自動保存されるため、リロードしてもデータは消えません。

## 🛠 技術スタック (Tech Stack)

- **Framework:** Vue 3 (Composition API) + Vite
- **Language:** TypeScript
- **State Management:** Pinia
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide-vue-next

## 起動方法 (Getting Started)

Node.jsがインストールされている環境で、以下のコマンドを実行してください。

```bash
# 1. リポジトリのクローン
git clone [https://github.com/あなたのユーザー名/stock-manager-vue.git](https://github.com/ユーザー名/stock-manager-vue.git)
cd stock-manager-vue

# 2. パッケージのインストール
npm install

# 3. 開発サーバーの起動
npm run dev
```
