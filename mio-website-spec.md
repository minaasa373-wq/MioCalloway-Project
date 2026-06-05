# Mio Calloway 公式サイト 制作仕様書

> Claude Code 向け実装指示書
> 静的サイト（HTML / CSS / 最小限の Vanilla JS）／ GitHub Pages ホスト

---

## 0. このプロジェクトについて

架空のシンガーソングライター **Mio Calloway**（24歳・日系アメリカ人女性・ボサノバ寄り）の公式サイトを制作する。Instagram（@mio.calloway）からの導線の着地点。

**最重要**: これは創作プロジェクト。誠実な開示が必須。About ページとフッターに「架空のアーティストです」を必ず明記する。

### 世界観の核

- **Hours（表）= 昼・暖**: EP本編。朝→夜の一日を描く。
- **Side B（裏）= 夜・冷**: 隠しトラック＋写真集。Hoursの裏面。
- サイト全体のトーン: **詩的・余白・抑制**。"discovered, not constructed"（作り込まれた感より、ふと見つけた佇まい）。過度な装飾を避ける。

---

## 1. 技術要件

| 項目 | 指定 |
|---|---|
| 構成 | マルチページ（静的HTML 5枚: index=Music / goods / gallery / about） |
| フレームワーク | なし。素のHTML + CSS + 最小限のVanilla JS |
| ビルドツール | なし（GitHub Pagesにそのまま置ける形） |
| CSS | 共通の `style.css` 1枚に集約。CSS変数でカラー/タイポを管理 |
| JS | 音楽プレーヤー用の `player.js` のみ。外部ライブラリ不使用 |
| フォント | Google Fonts（後述） |
| レスポンシブ | モバイルファースト。640px / 900px でブレイク |
| 文字コード | UTF-8 / `lang="ja"` |

### ディレクトリ構造（このとおりに作る）

```
/
├── index.html          # Music（トップ兼用）
├── goods.html          # Goods（全品 SOLD OUT）
├── gallery.html        # Gallery（写真13枚）
├── about.html          # About（プロフィール＋開示）
├── css/
│   └── style.css       # 全ページ共通スタイル
├── js/
│   └── player.js       # 音楽プレーヤー制御
└── assets/
    ├── audio/          # ★旭が後でアップロード（mp3）
    │   ├── 01_sunday.mp3
    │   ├── 02_pocoapoco.mp3
    │   ├── 03_five_pm.mp3
    │   ├── 04_madobe_no_tsuki.mp3
    │   └── 05_side_b.mp3
    └── images/         # ★旭が後でアップロード
        ├── cover_hours.jpg          # Hoursジャケット（4曲共通で使用）
        ├── cover_side_b.jpg         # 写真集Side B表紙（Side B曲＆Goodsで使用）
        ├── og_image.jpg             # OGP用（任意・cover_hours.jpgで代用可）
        ├── goods_tote.jpg           # トートバッグ商品画像
        ├── goods_tshirt.jpg         # Tシャツ商品画像
        ├── goods_sticker.jpg        # ステッカー商品画像
        ├── hours/                   # Hours時代 写真8枚
        │   ├── h1_profile.jpg       # プロフィール写真（街の二重露光）
        │   ├── h2_seaside.jpg       # 海辺の二重露光
        │   ├── h3_flower.jpg        # 花の二重露光（口閉じ版）
        │   ├── h4_rain_window.jpg   # 雨の窓越し（=Side B表紙の素）
        │   ├── h5_cafe_book.jpg     # カフェの窓際・本
        │   ├── h6_lyric_note.jpg    # 歌詞ノート
        │   ├── h7_dusk_back.jpg     # 夕方の後ろ姿
        │   └── h8_studio.jpg        # スタジオ収録（後ろ姿）
        └── side_b/                  # Side B時代 写真5枚
            ├── s1_rain_umbrella.jpg # 雨の夜の街・傘
            ├── s2_bar.jpg           # バーカウンター
            ├── s3_lounge.jpg        # ジャズラウンジで歌う
            ├── s4_ramen.jpg         # 屋台でラーメン（暖色アクセント）
            └── s5_subway.jpg        # 地下鉄・窓に映るもうひとりのMio
```

> **画像の拡張子**: 上記は `.jpg` 想定。実ファイルが `.png`/`.webp` の場合はファイル名を合わせるか、コード側のパスを統一すること。**ファイルが未アップロードでもレイアウトが崩れないよう、`<img>` には必ず `alt` と CSS の `background` フォールバック（後述のプレースホルダー）を入れる。**

---

## 2. カラーシステム（CSS変数）

主軸は **Hours（インディゴ）**。Side B 系の色はアクセント／Side B関連箇所で使う。

```css
:root {
  /* --- Hours（表・昼・暖）= 主軸 --- */
  --indigo:        #1E1E3F;  /* 主役の暗色。背景・濃い文字 */
  --indigo-soft:   #2A2A52;  /* インディゴの一段明るい面 */
  --cream:         #F4ECDD;  /* 生成りクリーム。明るい面・紙トーン */
  --cream-dim:     #E7DDC9;  /* クリームの陰 */

  /* --- アクセント（暖色・誘導） --- */
  --amber:         #E8A33D;  /* CTA・リンク・現在地 */
  --amber-deep:    #D4A857;  /* amberの落ち着いた版 */

  /* --- Side B（裏・夜・冷）= 対構造の表現用 --- */
  --night:         #14161F;  /* Side Bセクションの深い夜 */
  --night-blue:    #2B3A55;  /* 夜青 */

  /* --- 汎用 --- */
  --ink:           #1E1E3F;  /* 本文（明背景時） */
  --ink-on-dark:   #F4ECDD;  /* 本文（暗背景時） */
  --muted:         #8A8499;  /* 補助テキスト */
  --line:          rgba(244,236,221,.14); /* 暗背景上の罫線 */
  --line-dark:     rgba(30,30,63,.12);    /* 明背景上の罫線 */
}
```

### 配色の運用ルール

- **サイトの基調は暗（インディゴ `--indigo`）**。文字は `--cream`。落ち着いた、夜のラウンジのような佇まい。
- **CTA・リンク・ホバー・現在地ナビ**は `--amber`。サイト内で唯一の「暖かい指差し」。多用しない。
- **Side B 関連の領域**（Musicページのside Bカード、Goodsの写真集、Galleryのside_bセクション）だけ、背景を `--night` 寄りに沈ませ、対構造を視覚化する。

---

## 3. タイポグラフィ（世界観の三層を尊重）

引き継ぎの「三層」をWebでも守る。Google Fontsで読み込む。

| 役割 | 用途 | フォント |
|---|---|---|
| **ステージで宣言する声** | サイトロゴ "MIO CALLOWAY"、曲タイトル(欧文)、ページ見出し(欧文) | **Cinzel**（serif, weight 400/600） |
| **部屋の中の囁き** | Side B関連の見出し、引用、リード文（欧文） | **Cormorant Garamond**（serif, 400/500 italic） |
| **彼女自身の私的なノート** | ごく一部の手書きニュアンス（任意・アクセント程度） | **Klee One** または **Yomogi**（手書き和文） |
| **和文の作品の顔** | 和文見出し・曲名（和） | **Shippori Mincho**（明朝） |
| **本文（和欧）** | 段落・キャプション・ナビ | **Zen Kaku Gothic New**（400/500） |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Shippori+Mincho:wght@400;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Klee+One:wght@400;600&display=swap" rel="stylesheet">
```

- 字間（letter-spacing）はゆったり。見出しの欧文は `0.08em〜0.18em`。
- `font-feature-settings: "palt";` で和文の詰めを有効に。
- 行間は本文 1.9 前後。余白を恐れない。

---

## 4. 共通パーツ（全ページ）

### 4-1. ヘッダー / ナビゲーション

- サイト名 **MIO CALLOWAY**（Cinzel・`--cream`）を左に。
- 右にナビ（**英語表記**）: `Music` / `Goods` / `Gallery` / `About`
- 現在地のリンクは `--amber` で下線 or 色変え。
- 背景はインディゴ。スクロールしても上部固定（sticky）。半透明＋`backdrop-filter: blur()`。
- モバイルではナビを横スクロール or シンプルな折返し（ハンバーガーは作らなくてよい。4項目なので並べる）。

### 4-2. フッター（全ページ共通）

```
MIO CALLOWAY ｜ Bossa nova
Instagram: @mio.calloway
─────────────
これは創作プロジェクトです。Mio Calloway は架空のアーティストであり、
実在の人物・団体とは関係ありません。
© 2026
```

- トーンは静かに。`--muted` 系の色で小さく。
- **「架空のアーティスト」開示はフッター必須**（全ページ）。

### 4-3. ページ共通のロード演出（控えめに）

- ページ読み込み時、見出し→リード→本文の順に `opacity` フェードイン（staggered, animation-delay）。
- 派手にしない。0.6s程度のやわらかいフェード。スクロール連動の大げさな演出は不要。

---

## 5. 各ページ仕様

### 5-1. `index.html` — Music（トップ兼用）

サイトの顔。最初のビューで世界観を伝える。

**(a) ヒーロー**
- 画面いっぱいのインディゴ背景。中央〜やや上に大きく `MIO CALLOWAY`（Cinzel）。
- 直下に英語タグライン的な一文（Cormorant italic）と、和文プロフィール文（確定版）を引用ブロックで：
  ```
  窓際のカフェ、午後の光、ちょっと遠い国の空気。
  そういうものに似た音楽をつくっています。
  ```
- スクロールを促す控えめなインジケータ（任意）。

**(b) ミニアルバム『Hours』セクション（明＝暖）**
- リード文（和・明朝）: 「朝、昼、夕方、夜。一日の光を、4つの音にして。」
- 4曲のトラックリスト。各行に: トラック番号 / タイトル（和） / 時間帯 / 再生ボタン。
- **ジャケットは `cover_hours.jpg` を4曲共通で表示**（セクション上部に大きく1枚、または各トラックのサムネとして共通画像）。

| # | タイトル | 時間帯 | 音源ファイル | キー/BPM（小さく添える程度） |
|---|---|---|---|---|
| 1 | Sunday | 朝 | `assets/audio/01_sunday.mp3` | F major / 84 |
| 2 | ぽこあぽこ | 昼下がり | `assets/audio/02_pocoapoco.mp3` | 76 |
| 3 | Five PM | 夕方 | `assets/audio/03_five_pm.mp3` | G major / 72 |
| 4 | 窓辺の月 | 夜 | `assets/audio/04_madobe_no_tsuki.mp3` | A minor / 62 |

- **『ぽこあぽこ』には小さな注釈**: 「架空のアプリ『ぽこあぽこ』のために書いた曲」程度の一文を添える（世界観の deepening）。

**(c) Side B セクション（暗＝冷・対構造）**
- ここだけ背景を `--night` 系に沈ませ、Hoursとの昼/夜の対比を作る。
- リード（Cormorant italic + 和）: 「昼のわたしが、知らない夜のこと。」
- 1曲のみ。**ジャケットは `cover_side_b.jpg`（写真集表紙）**。
  | タイトル | 音源ファイル | 情報 |
  |---|---|---|
  | Side B | `assets/audio/05_side_b.mp3` | D minor / 約70 bpm / 約2:40 |
- 「the hours fold away」というフレーズが Hours への隠しリンクである、という設定を匂わせる一文を小さく（ネタバラシしすぎない）。

**(d) 音楽プレーヤー（重要・`player.js`）**

仕様:
- **サイト内再生・フル視聴**。`<audio>` 要素を使う。
- 画面下部に固定の**ミニプレーヤーバー**（sticky bottom）。曲名・再生/停止・シーク（progress）・時間表示・音量（任意）。
- 各トラックの再生ボタンを押すと、そのバーで再生開始。再生中のトラックはリスト上でハイライト。
- 1曲ずつの再生でよい（プレイリスト自動送りは「あれば尚良し」程度。まずは単曲再生を確実に）。
- 音源ファイルが存在しない場合でもUIは壊れない（押しても無音／ボタンはdisabled風表示でも可）。
- プレーヤーバーの配色: インディゴ地に amber のシーク。再生中の曲がSide Bのときはバーを夜色に寄せる、までやれたら世界観として満点（任意）。

> 実装メモ: `data-src` 属性に音源パスを持たせ、JSで `audio.src` を差し替える方式が簡潔。`audio` は1つだけ生成して使い回す。

---

### 5-2. `goods.html` — Goods（全品 SOLD OUT）

- グッズ一覧。**全商品に必ず「SOLD OUT」表示**（重ね帯 or バッジ）。購入機能は作らない。
- 各カード: 画像 / 商品名 / 価格 / SOLD OUT。
- 写真集『Side B』を主役級に大きく扱う（画像 `cover_side_b.jpg`）。**「中身は非公開／SOLD OUT」**として、表紙のみ見せる。

掲載グッズ（5点・全品 SOLD OUT）:

| 商品名 | 価格 | 画像 | 備考 |
|---|---|---|---|
| 写真集『Side B』 | ¥3,200 | `assets/images/cover_side_b.jpg` | SOLD OUT。中身非公開 |
| ミニアルバム『Hours』CD | ¥1,800 | `assets/images/cover_hours.jpg` | SOLD OUT |
| トートバッグ（Hoursジャケット） | ¥2,500 | `assets/images/goods_tote.jpg` | SOLD OUT |
| Tシャツ（Hoursジャケット） | ¥3,500 | `assets/images/goods_tshirt.jpg` | SOLD OUT・サイズ S/M/L |
| ステッカー「Mio Calloway」 | ¥500 | `assets/images/goods_sticker.jpg` | SOLD OUT・Cinzel体ロゴデザイン |

追加する画像ファイル（旭がアップロード）:
- `assets/images/goods_tote.jpg`
- `assets/images/goods_tshirt.jpg`
- `assets/images/goods_sticker.jpg`

> Claude Codeは編集しやすいよう、各商品をHTMLのカード単位でコメント区切りにしておく。

- トーン: 物販ページでも詩的さを失わない。SOLD OUT は煽らず、静かに「もう手に入らないもの」の余韻を出す。

---

### 5-3. `gallery.html` — Gallery（写真13枚）

- 写真を2つのセクションに分ける。**Hours時代（昼・暖）8枚** と **Side B時代（夜・冷）5枚**。
- セクション間で背景トーンを切り替え、昼→夜の移ろいを体験させる（Hours=クリーム/インディゴ明、Side B=`--night`）。
- レイアウト: グリッド（masonry風 or 均等グリッド）。クリックでライトボックス拡大（任意・あれば良い。なければ単純グリッドでOK）。
- 各写真に短いキャプション（Mioの声で。詩的・体言止め）を添えてよい。下に画像とキャプション対応表。

**Hours時代（8枚 / 昼・暖）**

| ファイル | キャプション案（編集可） |
|---|---|
| `hours/h1_profile.jpg` | 街の光に、二重に溶けて |
| `hours/h2_seaside.jpg` | 海辺、午後 |
| `hours/h3_flower.jpg` | 花と、口を閉じたまま |
| `hours/h4_rain_window.jpg` | 雨の窓ごし |
| `hours/h5_cafe_book.jpg` | 窓際の席、読みかけの本 |
| `hours/h6_lyric_note.jpg` | 歌詞のノート |
| `hours/h7_dusk_back.jpg` | 夕方、うしろすがた |
| `hours/h8_studio.jpg` | 録音の午後 |

**Side B時代（5枚 / 夜・冷 + ラーメンのみ暖）**

| ファイル | キャプション案（編集可） |
|---|---|
| `side_b/s1_rain_umbrella.jpg` | 雨の夜、傘ひとつ |
| `side_b/s2_bar.jpg` | カウンター、気だるい時間 |
| `side_b/s3_lounge.jpg` | 小さなラウンジで |
| `side_b/s4_ramen.jpg` | 湯気の向こうの灯り |
| `side_b/s5_subway.jpg` | 終電、窓に映るもうひとり |

---

### 5-4. `about.html` — About（プロフィール＋開示）

- Mioのプロフィール本文。確定済みのbio文を起点に、詩的に展開（体言止め・余白）。
- 経歴は架空。ミニアルバム『Hours』とSide Bの紹介を物語として軽く。
- **「ぽこあぽこ」の設定**を自然に織り込む（最初の曲が架空アプリのテーマ曲だった、という来歴）。
- Instagram への導線（@mio.calloway へのリンク）。
- **開示（必須・明確に）**:
  ```
  Mio Calloway は架空のアーティストです。
  楽曲・画像・プロフィールはすべて創作であり、
  実在の人物・団体・サービスとは関係ありません。
  ```
  → これは目立たせすぎず、しかし誤解が生じない位置（本文末 or 専用ブロック）にはっきり置く。フッターとは別に、Aboutページ本文にも必ず入れる。

---

## 6. アクセシビリティ / 品質

- すべての `<img>` に意味のある `alt`。
- 音楽プレーヤーのボタンに `aria-label`。
- カラーコントラスト: amber文字を小さく使う場合は背景とのコントラストに注意（リンクは下線も併用）。
- 画像の `loading="lazy"`（ヒーロー以外）。
- メタ: 各ページに `<title>` / `description` / OGP（`og_image.jpg`）。
- 文字化け防止に必ず `<meta charset="UTF-8">`。

---

## 7. 旭がやること（実装後）

1. `assets/audio/` に mp3 を5本アップロード（上記ファイル名で）。
2. `assets/images/` に画像をアップロード（上記パス/ファイル名で）。画像13枚＋ジャケット2枚＋グッズ3枚＋OGP1枚。
3. キャプションなど、好みで編集する箇所を確定。
4. GitHub Pages を有効化（Settings → Pages → main / root）。
5. 公開URLを Instagram プロフィールリンクに設定 → SNS導線が完成。

---

## 8. 制作順（推奨）

1. `css/style.css`（変数・共通・ナビ・フッター）
2. `index.html`（Music + プレーヤー）+ `js/player.js`
3. `about.html`
4. `gallery.html`
5. `goods.html`

各ページは共通ヘッダー/フッターを同じマークアップでコピーする（静的なので重複OK。ただしクラス名・構造は完全に統一すること）。

---

## 9. やってはいけないこと

- 紫グラデ×白などの量産型AI配色にしない（インディゴ基調を守る）。
- 過度なアニメーション・派手なエフェクトを盛らない（"discovered, not constructed"）。
- 「架空のアーティスト」開示を省略・小さくしすぎない。
- 写真集『Side B』の中身を作らない（表紙のみ・SOLD OUT）。
- 実在の人物・ブランド・サービスを実在のものとして扱う表記をしない。
