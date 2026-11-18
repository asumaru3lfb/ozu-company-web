/* 大洲カンパニー 6ページの共通の動き（矢印スライド・カレンダーのポップアップ・ホバー・文言） */
(function(){
function ready(f){document.readyState!=='loading'?f():document.addEventListener('DOMContentLoaded',f)}
ready(function(){
  /* 右下の「かかわり方を見る」ボタンと、6ページを選ぶポップアップ */
  var ways=document.querySelector('.oc-ways');
  if(ways){
    var fab=document.createElement('button');fab.type='button';fab.className='oc-fab';
    fab.setAttribute('aria-haspopup','dialog');fab.innerHTML='<span class="oc-fab-i" aria-hidden="true"></span>かかわり方を見る';
    var dlg=document.createElement('div');dlg.className='oc-wpop';dlg.hidden=true;dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.setAttribute('aria-label','大洲とのかかわり方を見る');
    var html='<div class="oc-wpin"><button type="button" class="oc-x" aria-label="とじる">×</button><p class="oc-wh">大洲とのかかわり方を見る</p><div class="oc-wgrid">';
    ways.querySelectorAll('.oc-way').forEach(function(w){
      var q=w.querySelector('small'),b=w.querySelector('b'),cur=w.classList.contains('on');
      html+=(cur?'<div class="oc-wi on" aria-current="page">':'<a class="oc-wi" href="'+w.getAttribute('href')+'">')+'<small>'+(q?q.textContent:'')+'</small><b>'+(b?b.textContent:'')+'</b>'+(cur?'<i>いま見ているページ</i></div>':'<i>＞</i></a>');
    });
    var top=ways.querySelector('.oc-totop');
    html+='</div>'+(top?'<a class="oc-wtop" href="'+top.getAttribute('href')+'">'+top.textContent+'</a>':'')+'</div>';
    dlg.innerHTML=html;document.body.appendChild(fab);document.body.appendChild(dlg);
    var shut=function(){dlg.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus()};
    fab.onclick=function(){dlg.hidden=false;fab.setAttribute('aria-expanded','true');var f=dlg.querySelector('a.oc-wi');if(f)f.focus()};
    dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('.oc-x'))shut()});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&!dlg.hidden)shut()});
  }
  /* リンクの矢印「→」は「＞」に（後から作られる行事カードなども含む） */
  function arrows(root){
    var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),t;
    while((t=tw.nextNode())){if(t.nodeValue.indexOf('→')>=0&&!t.parentNode.closest('script,style'))t.nodeValue=t.nodeValue.replace(/\s*→/g,' ＞')}
  }
  arrows(document.body);
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)arrows(n);else if(n.nodeType===3&&n.nodeValue.indexOf('→')>=0)n.nodeValue=n.nodeValue.replace(/\s*→/g,' ＞')})})}).observe(document.body,{childList:true,subtree:true});
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
