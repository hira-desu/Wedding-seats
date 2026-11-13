# 結婚式オンライン席次表（サンプル版）

HTML / CSS / Vanilla JavaScript / JSONだけで動作する、GitHub Pages向けのオンライン席次表です。サーバー・データベースは使用しません。

## まず試す

`index.html` を直接ダブルクリックすると、ブラウザのセキュリティ制限でJSONを読み込めない場合があります。次のいずれかで起動してください。

### 方法A：VS CodeのLive Server
1. フォルダをVS Codeで開く
2. Live Server拡張機能を使って `index.html` を開く

### 方法B：Pythonがある場合
プロジェクトのフォルダで次を実行します。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

## 本番データへの差し替え

- `data/wedding.json`：新郎新婦名、挙式日、会場名
- `data/venue.json`：会場図の表示情報
- `data/tables.json`：テーブル名、配置
- `data/guests.json`：ゲスト名、所属テーブル、プロフィール

### テーブル配置
`tables.json` の `x` と `y` は0〜100の割合です。
- x：左から右
- y：上から下
- 例：`x: 25, y: 34`

現在のサンプルはA・B・Cの3卓とメインテーブルです。会場の実際の形に合わせて、次の段階でSVGの壁・入口・高砂・テーブル配置を調整します。

### ゲスト画像
このサンプルは画像素材なしで確認できるよう、イニシャル風の丸いアバターを表示します。実際の似顔絵画像を使う場合は、`assets/images/guests/` にPNG/JPG/GIFを置き、ゲストデータに `portrait` を追加してください。例：`"portrait": "assets/images/guests/guest001.gif"`。画像が読み込めない場合はイニシャル表示に切り替わります。GIFはそのままアニメーション表示されます。

## GitHub Pagesで公開
1. GitHubで新しいリポジトリを作成
2. このフォルダ内のファイル・フォルダをリポジトリ直下へアップロード
3. Settings → Pages → Deploy from a branch
4. Branchを `main`、folderを `/(root)` にしてSave
5. 表示されたURLをスマートフォンで確認し、QRコード化する

このプロジェクトは相対パスを使用しているため、`https://ユーザー名.github.io/リポジトリ名/` のようなサブディレクトリ公開にも対応します。

## 公開前の注意
GitHub Pagesに置いたJSON・画像は、URLを知っている人が取得できます。住所・電話番号・メールアドレスなどは掲載せず、プロフィールや写真は本人の了承を得てください。
