/**
 * 関わり方ガイドへの自動掲載（Google Apps Script）
 *
 * 台帳「大洲城下町 イベント発信台帳」の「イベント」シートで、
 * 「関わり方ガイドへの掲載」にチェックが入った行だけを、JSONで返します。
 * WEBサイト（/guide/）がこのJSONを読み、関わり方ガイドに自動で表示します。
 *
 * 設置のしかた（一度だけ）
 *  1. 台帳を開き、拡張機能 → Apps Script を開く
 *  2. 新しいファイルを作り、このコードを貼りつけて保存
 *  3. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」
 *     実行するユーザー：自分　／　アクセスできるユーザー：全員
 *  4. 表示された「ウェブアプリのURL」を、
 *     ozu-company-web/assets/ozu-company.js の GUIDE_FEED_URL に入れる
 *
 * 外に出るのは、チェックの入った行の「ガイド：」の列と、
 * 空欄のときに代わりに使う列（イベント名・日時・場所・料金・主催・元URL）だけです。
 */
var SHEET_NAME = 'イベント';

function doGet() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  var rows = sh.getDataRange().getValues();
  var head = rows.shift();
  var col = function (name) { return head.indexOf(name); };
  var C = {
    flag: col('関わり方ガイドへの掲載'), place: col('ガイド：載せる場所'), status: col('ガイド：受付の状態'),
    title: col('ガイド：見出し'), desc: col('ガイド：説明文'), when: col('ガイド：いつ'), where: col('ガイド：どこで'),
    fee: col('ガイド：費用'), by: col('ガイド：募集元'), url: col('ガイド：申し込みURL'), until: col('ガイド：締切日'),
    photo: col('ガイド：写真URL'), tags: col('ガイド：札'),
    id: col('ID'), name: col('イベント名'), start: col('開始日時'), end: col('終了日時'), loc: col('場所'),
    price: col('料金'), org: col('主催・問い合わせ'), src: col('元URL'), hide: col('掲載しない')
  };
  var tz = 'Asia/Tokyo';
  var fmt = function (v) {
    if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
    return String(v == null ? '' : v).trim();
  };
  var jp = function (v) {
    if (!(v instanceof Date)) return fmt(v);
    return Utilities.formatDate(v, tz, 'M月d日');
  };
  var pick = function (r, a, b) { var x = fmt(r[a]); return x || (b != null && b >= 0 ? fmt(r[b]) : ''); };
  var items = [];
  rows.forEach(function (r) {
    if (r[C.flag] !== true) return;
    if (C.hide >= 0 && r[C.hide] === true) return;
    var when = fmt(r[C.when]);
    if (!when && r[C.start]) {
      when = jp(r[C.start]);
      if (r[C.end] && fmt(r[C.end]) !== fmt(r[C.start])) when += '〜' + jp(r[C.end]);
    }
    var srcUrl = fmt(r[C.src]).split(/\s+/).filter(function (s) { return /^https?:\/\//.test(s); })[0] || '';
    items.push({
      id: fmt(r[C.id]),
      place: fmt(r[C.place]) || 'いま参加できること',
      status: fmt(r[C.status]) || '受付中',
      title: pick(r, C.title, C.name),
      desc: fmt(r[C.desc]),
      when: when,
      where: pick(r, C.where, C.loc),
      fee: pick(r, C.fee, C.price),
      by: pick(r, C.by, C.org),
      url: fmt(r[C.url]) || srcUrl,
      until: fmt(r[C.until]) || fmt(r[C.end]),
      photo: fmt(r[C.photo]),
      tags: fmt(r[C.tags]).split(/[、,]/).map(function (s) { return s.trim(); }).filter(String)
    });
  });
  var out = { updated: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'), items: items };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
