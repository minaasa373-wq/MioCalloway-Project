/* bg-effect.js — 月色：ページ読み込みから一定時間後に昼→夜へ切り替え
   ループしない / 状態は保存しない（再読み込み・別ページ遷移時は必ず昼から） */
(function () {
  'use strict';

  // 本番設定：60秒。値を変えるだけで切り替えタイミングを調整できる。
  var TRANSITION_DELAY_SECONDS = 60;

  window.setTimeout(function () {
    document.body.classList.add('is-night');
  }, TRANSITION_DELAY_SECONDS * 1000);
})();
