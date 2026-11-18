/* 大洲カンパニー 6ページの共通の動き（矢印スライド・カレンダーのポップアップ・ホバー・文言） */
(function(){
function ready(f){document.readyState!=='loading'?f():document.addEventListener('DOMContentLoaded',f)}
ready(function(){
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
    var p=mk('prev','←','前のカードへ'),x=mk('next','→','次のカードへ');
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
