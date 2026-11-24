/* 大洲カンパニー 6ページの共通の動き（矢印スライド・カレンダーのポップアップ・ホバー・文言） */
(function(){
function ready(f){document.readyState!=='loading'?f():document.addEventListener('DOMContentLoaded',f)}
ready(function(){
  if(!document.querySelector('link[href*="family=Barlow"]')){var lf=document.createElement('link');lf.rel='stylesheet';lf.href='https://fonts.googleapis.com/css2?family=Barlow:wght@700;800&display=swap';document.head.appendChild(lf)}
  /* 大見出しごとに、その下の中身をひとつのセクションにまとめる（背景を交互に変えて区切りを見せる） */
  var PARENT='.sec:not(:has(h2 i)):not(:has(h2 .no)):not(:has(+ .tl)):not(:has(.es)),.rowh:not(:has(.no)),.ghead,.chh,#todayw';
  document.querySelectorAll('.wrap').forEach(function(wrap){
    var kids=[].slice.call(wrap.children),cur=null,n=0,sel=PARENT;
    if(!kids.some(function(el){try{return el.matches(PARENT)}catch(e){return false}}))sel='.sec:has(h2 i),.sec:has(h2 .no),.sh,.rowh';
    kids.forEach(function(el){
      var isP=false;try{isP=el.matches(sel)}catch(e){}
      if(isP){cur=document.createElement('section');cur.className='oc-band'+((n++%2)?' alt':'');wrap.insertBefore(cur,el)}
      if(cur)cur.appendChild(el);
    });
  });
  /* 「まで」の字はなし */
  function nomade(root){(root.querySelectorAll?root:document).querySelectorAll('.db span').forEach(function(s){if(s.textContent.trim()==='まで')s.style.display='none'})}
  nomade(document);
  /* ヘッダーの「OZU 555 PROJECT」は、TOPのOZU 555のブロックへ */
  document.querySelectorAll('.oc-hd a[href*="ozu555.html"]').forEach(function(a){a.setAttribute('href',a.getAttribute('href').replace('ozu555.html','#p555'))});
  /* ヘッダーをTOPと同じ形に：英字ロゴ、イラスト付きの3メニュー、右端に黄色のLINE登録と小さな「お問い合わせ」 */
  var brand=document.querySelector('.oc-brand'),nav=document.querySelector('.oc-nav'),ocr=document.querySelector('.oc-r');
  var TOPURL=brand?brand.getAttribute('href'):'../';
  if(brand){brand.lastChild.nodeValue='OZU COMPANY';brand.setAttribute('aria-label','大洲カンパニー（OZU COMPANY）')}
  if(nav){
    nav.innerHTML='<a href="'+TOPURL+'#about"><img src="../assets/hd-about.png" alt="">大洲カンパニーとは</a><a href="'+TOPURL+'#can"><img src="../assets/hd-can.png" alt="">できること</a><a href="'+TOPURL+'#p555"><img src="../assets/hd-project.png" alt="">プロジェクト</a>';
  }
  if(ocr&&!ocr.querySelector('.oc-ct')){var ct=document.createElement('a');ct.className='oc-ct';ct.href=TOPURL+'#contact';ct.textContent='お問い合わせ';ocr.insertBefore(ct,ocr.firstChild)}
  document.querySelectorAll('.oc-mnav a').forEach(function(a){if(a.textContent.trim()==='OZU 555 PROJECT')a.textContent='プロジェクト'});
  /* 重なっているページ内リンクを減らす（削除したものは「6ページ_削除したリンク.md」に記録） */
  var page=(location.pathname.match(/\/(discover|machibito|guide|work|data|seido)\//)||[])[1];
  function drop(el){if(!el)return;var li=el.closest('li');var t=li||el;var ul=t.parentElement;t.remove();if(ul&&ul.matches('ul,ol')&&!ul.querySelector('li'))ul.remove()}
  function q(s){return document.querySelector(s)}
  function qa(s){return [].slice.call(document.querySelectorAll(s))}
  if(page==='guide'){
    var come=q('#come');if(come){var n=come.nextElementSibling;while(n&&!n.matches('.sh,.ghead,section')){var nx=n.nextElementSibling;n.remove();n=nx}come.remove()}
    qa('.duo').forEach(function(e){e.remove()});
    qa('a[href="../work/#shisatsu"]').forEach(drop);
    qa('a[href="../data/#past"],a[href="../data/#done"]').forEach(drop);
  }
  if(page==='work'){
    qa('a.btn2[href="../data/#past"]').forEach(drop);
    qa('.sec').forEach(function(s){if(/来る前に、あわせて見る/.test(s.textContent)){qa('a.read').forEach(function(a){a.remove()});s.remove()}});
  }
  if(page==='data'){qa('.nexts').forEach(function(e){e.remove()})}
  if(page==='seido'){
    qa('a[href="../discover/#stay"]').forEach(drop);
    qa('a[href="../guide/#now"]').slice(1).forEach(drop);
    qa('a[href="../discover/"]').slice(1).forEach(drop);
    qa('a.uc.solo').forEach(function(e){e.remove()});
    qa('a[href="../data/#done"],a[href="../machibito/#g-shop"]').forEach(drop);
  }
  /* 見出しを失った面（中身が出典だけ等）は面をやめる */
  qa('.oc-band').forEach(function(b){if(!b.querySelector('.sec,.rowh,.sh,.chh,.ghead')){while(b.firstChild)b.parentNode.insertBefore(b.firstChild,b);b.remove()}});
  /* リンク・ボタンの中の矢印の記号（→ ＞ ↗ ↓ など）はすべて消す。後から作られる行事カードなども含む */
  var ARW=/\s*[→＞>↗↓›»▶➡⇒]\s*/g;
  function arrows(root){
    var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),t;
    while((t=tw.nextNode())){
      var el=t.parentNode;if(!el||el.closest('script,style'))continue;
      if(el.closest('a,button,summary,.go,.sr,.nx,.o,.cnt')){var v=t.nodeValue.replace(ARW,function(m){return /^\s/.test(m)&&/\s$/.test(m)?' ':''});if(v!==t.nodeValue)t.nodeValue=v}
    }
  }
  arrows(document.body);
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)arrows(n);else if(n.nodeType===3&&n.parentNode)arrows(n.parentNode)})})}).observe(document.body,{childList:true,subtree:true});
  /* ボタンは必ず1行に収める（入りきらないときは文字を小さく） */
  function fit(){qa('.main,.apply,.btn2,a.more,a.read,a.sl,a.sub-lk,.lk a,a.ext,a.tel,a.down,a.tolink,.cbtn a,details > summary,.oc-ways .oc-totop').forEach(function(b){
    b.style.fontSize='';var fs=parseFloat(getComputedStyle(b).fontSize),n=0;
    while(b.scrollWidth>b.clientWidth+1&&fs>10.5&&n<14){fs-=.5;b.style.setProperty('font-size',fs+'px','important');n++}
  })}
  fit();addEventListener('resize',fit);if(document.fonts)document.fonts.ready.then(fit);
  /* 文言：まちびとファイルの「つくる」→「つくりて」 */
  if(/\/machibito\//.test(location.pathname)){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;
    while((n=w.nextNode())){if(n.nodeValue.trim()==='つくる')n.nodeValue=n.nodeValue.replace('つくる','つくりて')}
  }
  /* リンクの箱にホバー用の印 */
  document.querySelectorAll('a[href],button.mc').forEach(function(a){
    if(a.closest('.oc-hd,.oc-foot,.oc-ways,.page-index,.gnav'))return;
    var d=getComputedStyle(a).display;
    if(d!=='inline'&&a.offsetWidth>140&&a.offsetHeight>56)a.classList.add('oc-box');
  });
  /* 横に動くカードに左右の矢印（PCだけ表示） */
  document.querySelectorAll('.rail,.mcar,.car').forEach(function(r){
    var box=document.createElement('div');box.className='oc-car';r.parentNode.insertBefore(box,r);box.appendChild(r);
    function mk(c,t,l){var b=document.createElement('button');b.type='button';b.className='oc-arw '+c;b.textContent=t;b.setAttribute('aria-label',l);box.appendChild(b);return b}
    var p=mk('prev','＜','前のカードへ'),x=mk('next','＞','次のカードへ');
    function step(){return Math.max(240,r.clientWidth*0.8)}
    p.onclick=function(){r.scrollBy({left:-step(),behavior:'smooth'})};
    x.onclick=function(){r.scrollBy({left:step(),behavior:'smooth'})};
    function upd(){p.disabled=r.scrollLeft<8;x.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-8}
    r.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);setTimeout(upd,400);upd();
  });
  /* ディスカバー：カレンダーと行事を横並びの箱に入れ、日付はポップアップで見せる */
  var cal=document.querySelector('.cal'),soon=document.getElementById('tdySoon');
  if(cal&&soon){
    var row=document.createElement('div');row.className='oc-calrow';cal.parentNode.insertBefore(row,cal);row.appendChild(cal);row.appendChild(soon);
    var pop=document.createElement('div');pop.className='oc-pop';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-modal','true');
    pop.innerHTML='<div class="oc-pin"><button type="button" class="oc-x" aria-label="とじる">×</button><h4></h4><div class="oc-body"></div></div>';
    document.body.appendChild(pop);
    var close=function(){pop.hidden=true};
    pop.addEventListener('click',function(e){if(e.target===pop||e.target.closest('.oc-x'))close()});
    addEventListener('keydown',function(e){if(e.key==='Escape')close()});
    document.addEventListener('click',function(e){
      var b=e.target.closest('.cal .d.has');if(!b)return;
      e.preventDefault();e.stopPropagation();
      var key=(b.dataset.go||'').replace('ev-',''),first=document.getElementById('ev-'+key),evs=[];
      if(first){evs.push(first);var nx=first.nextElementSibling,t=first.querySelector('.db');
        while(nx&&nx.classList.contains('ev')&&!nx.id){var u=nx.querySelector('.db');if(t&&u&&t.textContent===u.textContent){evs.push(nx);nx=nx.nextElementSibling}else break}}
      var p=key.split('-');pop.querySelector('h4').textContent=(+p[1])+'月'+(+p[2])+'日に始まる行事';
      var body=pop.querySelector('.oc-body');body.innerHTML='';
      evs.forEach(function(v){var c=v.cloneNode(true);c.removeAttribute('id');body.appendChild(c)});
      pop.hidden=false;pop.querySelector('.oc-x').focus();
    },true);
  }
});
})();
