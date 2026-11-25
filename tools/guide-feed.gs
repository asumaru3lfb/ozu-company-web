/**
 * 関わり方ガイドへの自動掲載（台帳の Code.gs に足す部分）
 *
 * 台帳「大洲城下町 イベント発信台帳」にはすでに Code.gs があり、
 *   doGet（公開用データ）と doPost（LINEの受信口）が同じウェブアプリで動いています。
 * Apps Script は1つのプロジェクトに doGet を1つしか持てないので、
 * 新しいファイルやデプロイは作らず、既存の doGet に「?view=guide」の分かれ道を足します。
 *
 * 足し方
 *  1. Code.gs の一番下に、この下の guideFeed_ 関数をそのまま貼る
 *  2. 既存の doGet(e) の最初の行に、次の1行を足す
 *       if (e && e.parameter && e.parameter.view === 'guide') return guideFeed_();
 *  3. 保存 → デプロイ → デプロイを管理 → 鉛筆 → バージョン：新バージョン → デプロイ
 *     （URLは変わりません。LINEの受信口もそのまま動きます）
 *  4. ウェブアプリのURL（…/exec）の末尾に ?view=guide を付けたものが、ガイド用のURLです
 *
 * 決めごと（台帳の仕組みに合わせています）
 *  - 載るのは「関わり方ガイドへの掲載」にチェックがある行だけ（人がチェックしたものだけ。自動では載せない）
 *  - 「掲載しない」にチェックがある行、裏取りが「対象外」「保留」の行は載せない
 *  - 主催・問い合わせの列は外に出さない（既存の doGet と同じ）。募集元は「ガイド：募集元」に書いたものだけ
 *  - 行の削除・書き込みはしない（読むだけ）
 */
function guideFeed_() {
  var sh = SpreadsheetApp.getActive().getSheetByName('イベント');
  var rows = sh.getDataRange().getValues();
  var head = rows.shift();
  var col = function (name) { return head.indexOf(name); };
  var C = {
    flag: col('関わり方ガイドへの掲載'), place: col('ガイド：載せる場所'), status: col('ガイド：受付の状態'),
    title: col('ガイド：見出し'), desc: col('ガイド：説明文'), when: col('ガイド：いつ'), where: col('ガイド：どこで'),
    fee: col('ガイド：費用'), by: col('ガイド：募集元'), url: col('ガイド：申し込みURL'), until: col('ガイド：締切日'),
    photo: col('ガイド：写真URL'), tags: col('ガイド：札'),
    id: col('ID'), name: col('イベント名'), start: col('開始日時'), end: col('終了日時'), loc: col('場所'),
    price: col('料金'), src: col('元URL'), check: col('裏取り'), hide: col('掲載しない')
  };
  var tz = 'Asia/Tokyo';
  var fmt = function (v) {
    if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
    return String(v == null ? '' : v).trim();
  };
  var jp = function (v) { return v instanceof Date ? Utilities.formatDate(v, tz, 'M月d日') : fmt(v); };
  var pick = function (r, a, b) { var x = fmt(r[a]); return x || (b >= 0 ? fmt(r[b]) : ''); };
  var items = [];
  rows.forEach(function (r) {
    if (C.flag < 0 || r[C.flag] !== true) return;
    if (C.hide >= 0 && r[C.hide] === true) return;
    if (C.check >= 0 && /対象外|保留/.test(fmt(r[C.check]))) return;
    var when = fmt(r[C.when]);
    if (!when && r[C.start]) {
      when = jp(r[C.start]);
      if (r[C.end] && fmt(r[C.end]) !== fmt(r[C.start])) when += '〜' + jp(r[C.end]);
    }
    // 元URLは「受信箱#番号」などが混ざるので、http で始まるものだけ使う
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
      by: fmt(r[C.by]),
      url: fmt(r[C.url]) || srcUrl,
      until: fmt(r[C.until]) || fmt(r[C.end]),
      photo: fmt(r[C.photo]),
      tags: fmt(r[C.tags]).split(/[、,]/).map(function (s) { return s.trim(); }).filter(String)
    });
  });
  var out = { updated: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'), items: items };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
