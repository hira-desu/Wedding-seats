# 結婚式オンライン席次表（静的サイト版）

HTML / CSS / Vanilla JavaScript / JSONだけで動作する、スマートフォン向けオンライン席次表のサンプルです。サーバーサイド処理・データベース・ビルド工程は不要です。

## 含まれる機能

- トップページ、SVG会場見取り図、テーブル別ゲスト一覧、プロフィールモーダル
- テーブルをタップしてゲスト一覧へ移動
- ゲストカードをタップしてプロフィールを表示（Escキー・背景タップ・閉じるボタンで終了）
- ブラウザの戻る／進むに対応したハッシュルーティング
- JSONで結婚式情報・ゲスト・テーブル・会場レイアウトを管理
- PNG / JPG / GIF / SVGの画像表示に対応（画像エラー時は共通画像へフォールバック）
- スマートフォン・タブレット・PC向けレスポンシブ表示
- サンプルゲスト6名、3テーブル、オリジナルの似顔絵風プレースホルダー画像

## フォルダ構成

```text
wedding-seating/
├── index.html
├── css/                 # デザイン・レスポンシブ・アニメーション
├── js/                  # アプリ本体、JSON読み込み、座席表、プロフィール、ルーター
├── data/
│   ├── config.json       # 結婚式基本情報
│   ├── guests.json       # ゲスト情報
│   ├── tables.json       # テーブル情報
│   └── venue.json        # 会場レイアウト・SVG配置
└── assets/images/
    ├── guests/           # ゲスト画像
    ├── common/           # 共通画像用
    └── fallback/         # 画像読み込み失敗時の画像
```

## ローカルでの確認方法

JSONを`fetch()`で読み込むため、`index.html`を`file://`で直接開く方法には対応していません。次のいずれかでWebサーバー経由で開いてください。

### Pythonがインストールされている場合

1. `wedding-seating`フォルダを開く
2. ターミナルで次を実行

```bash
python -m http.server 8000
```

3. ブラウザで `http://localhost:8000` を開く

### VS Codeの場合

Live Server等のローカルWebサーバー拡張機能を使い、`index.html`を配信してください。

## GitHub Pagesで公開する方法

1. GitHubで新しいPublicリポジトリを作成（例：`wedding-seating`）
2. ZIPを展開し、中の`wedding-seating`フォルダの**中身**（`index.html`、`css`、`js`、`data`、`assets`など）をリポジトリ直下へアップロード
3. GitHubリポジトリの **Settings → Pages** を開く
4. Build and deploymentのSourceを **Deploy from a branch** にする
5. Branchを `main`、フォルダを `/(root)` にしてSave
6. 数分後、表示されたGitHub Pages URLへアクセスして確認

このサイトは相対パスとES Modulesを使用しているため、`https://ユーザー名.github.io/リポジトリ名/`のようなサブディレクトリでも動作する構成です。

## ゲスト情報の編集

`data/guests.json`を編集します。1人分の例：

```json
{
  "id": "guest007",
  "tableId": "table01",
  "name": "山本 花子",
  "nickname": "はなちゃん",
  "relation": "新郎友人",
  "portrait": "assets/images/guests/guest007.jpg",
  "introduction": "ゲストに見せたい自己紹介",
  "hobby": "旅行、カフェ巡り",
  "message": "今日は来てくれてありがとう！"
}
```

- `id`は他のゲストと重複しない値にしてください。
- `tableId`は`data/tables.json`に存在するテーブルIDを指定します。
- `portrait`はリポジトリ内の画像パスを指定します。GIFもそのまま再生できます。
- 項目が空欄または未設定の場合、プロフィール画面ではその項目を表示しません。
- JSONでは文字列をダブルクォートで囲み、最後の項目の後ろにカンマを付けないでください。

## テーブル情報の編集

`data/tables.json`でテーブルを追加・変更します。例：

```json
{ "id": "table04", "label": "D卓", "name": "職場の皆さま", "description": "職場のご友人・同僚の皆さま" }
```

テーブルを追加したら、`data/venue.json`の`tables`配列にも同じ`id`を持つ座標情報を追加してください。

## 会場レイアウトの編集

`data/venue.json`の`viewBox`と`elements`、`tables`を編集します。

- `viewBox`: SVG全体の表示範囲。初期値は`0 0 1000 700`。
- `elements`: `rect`、`text`などのSVG装飾要素。
- `tables`: テーブルの中心座標`x`・`y`、`width`、`height`、`shape`、`label`。
- `shape`は`roundRect`または`circle`。
- テーブルの`id`は`tables.json`のIDと一致させてください。

## 結婚式情報の編集

`data/config.json`のカップル名、タイトル、日付、会場名、ウェルカムメッセージなどを書き換えてください。改行したい文章はJSON内で`\n`を使います。

## 画像の差し替え

1. ゲスト画像を`assets/images/guests/`へ配置
2. `guests.json`の`portrait`をその相対パスに変更
3. JPG、PNG、GIF、SVGを利用できます。GIFはアニメーション表示されます
4. 画像が見つからない場合は`assets/images/fallback/portrait.svg`を表示します

## 公開前の重要な確認

- GitHub PagesのサイトとJSON・画像は基本的に誰でも閲覧できます。非公開の席次表にはなりません。
- 住所、電話番号、メールアドレス、生年月日など、公開したくない個人情報は登録しないでください。
- ゲスト本人に掲載内容・似顔絵画像の公開範囲を確認してください。
- サンプルの氏名・日付・会場名・似顔絵は仮データです。実際の情報へ差し替えてください。
- 現在の版にはブラウザ上の管理画面はありません。更新はJSONと画像ファイルを編集してGitHubへ再アップロードする方式です。

## トラブルシューティング

- **画面が読み込めない**：`file://`ではなくGitHub PagesまたはローカルWebサーバーで開いてください。
- **JSONエラー**：カンマ、ダブルクォート、配列・オブジェクトの括弧を確認してください。
- **ゲストが表示されない**：`tableId`が`tables.json`の`id`と一致しているか確認してください。
- **テーブルが表示されない**：`venue.json`のテーブル`id`が`tables.json`と一致しているか確認してください。
- **画像が表示されない**：画像ファイル名と`portrait`のパス、大文字・小文字を確認してください。

---

Designed for a day woven together by the people you love.
