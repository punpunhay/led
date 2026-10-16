const $=s=>document.querySelector(s);
const F=[
{n:"Фисташка",d:"Сицилийская фисташка и щепотка морской соли.",bg:"#B7E4A0",fg:"#1D3B16",c:"#8FBF5F",p:130},
{n:"Клубника",d:"Спелая клубника из теплиц под Тюменью, без красителей.",bg:"#FFC2D1",fg:"#5A1230",c:"#FF6B8A",p:120},
{n:"Черника",d:"Лесная черника и немного лимонной цедры.",bg:"#C9C3FF",fg:"#241A63",c:"#6F5BD6",p:130},
{n:"Манго",d:"Сладкое манго альфонсо и капля лайма.",bg:"#FFD97A",fg:"#5B3300",c:"#FF9F1C",p:140},
{n:"Шоколад",d:"Тёмный бельгийский шоколад, 70% какао.",bg:"#E9C9B0",fg:"#3B1F10",c:"#7A4328",p:125}];
let cur=0,k=2,cart=[];
const root=document.documentElement,name=$('#name'),cone=$('#cone');
const paint=f=>{root.style.setProperty('--bg',f.bg);root.style.setProperty('--fg',f.fg);root.style.setProperty('--c',f.c)};
function text(f){name.innerHTML=[...f.n].map((ch,i)=>`<span style="animation-delay:${i*45}ms">${ch}</span>`).join('');
$('#desc').textContent=f.d;$('#price').textContent=f.p*k+' ₽';
[...$('#dots').children].forEach((b,i)=>b.setAttribute('aria-current',i===cur))}
function scoops(drop){[1,2,3].forEach(i=>{const g=$('#s'+i);g.style.display=i<=k?'':'none';if(drop&&i===k){g.classList.remove('drop');void g.getBBox();g.classList.add('drop')}});
[...$('#size').children].forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===k));$('#price').textContent=F[cur].p*k+' ₽'}
function go(i,e){if(i===cur)return;cur=(i+F.length)%F.length;const f=F[cur];
const r=e?.currentTarget?.getBoundingClientRect(),x=r?r.left+r.width/2:innerWidth/2,y=r?r.top+r.height/2:innerHeight-60,w=$('#wash');
w.style.cssText=`display:block;background:${f.bg}`;
const a=w.animate([{clipPath:`circle(0 at ${x}px ${y}px)`},{clipPath:`circle(150vmax at ${x}px ${y}px)`}],{duration:900,easing:'cubic-bezier(.7,0,.2,1)'});
setTimeout(()=>{text(f);cone.classList.remove('bump');void cone.getBoundingClientRect();cone.classList.add('bump')},350);
a.onfinish=()=>{paint(f);w.style.display='none'};
document.querySelectorAll('.sc path').forEach(p=>p.style.fill=f.c)}
// Элементы управления
F.forEach((f,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',f.n);b.onclick=e=>go(i,e);$('#dots').appendChild(b)});
$('#prev').onclick=e=>go(cur-1,e);$('#next').onclick=e=>go(cur+1,e);
[...$('#size').children].forEach(b=>b.onclick=()=>{k=+b.dataset.k;scoops(true)});
addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
// Посыпка и бегущая строка
const cols=['#FF6B9D','#FFD93D','#4D96FF','#fff','#6BCB77'];
for(let i=0;i<22;i++){const s=document.createElement('i');s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;background:${cols[i%5]};transform:rotate(${Math.random()*180}deg);animation-delay:${-Math.random()*6}s;animation-duration:${4+Math.random()*5}s`;document.querySelector('.spr').appendChild(s)}
const line=F.map(f=>f.n).join(' ■ ')+' ■ ';$('#mq').textContent=line.repeat(4);
// Конфетти
const cv=$('#fx'),c=cv.getContext('2d');let P=[];const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};rs();addEventListener('resize',rs);
function conf(x,y){for(let i=0;i<46;i++){const a=Math.random()*6.28,v=Math.random()*9+3;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-4,r:Math.random()*6,s:Math.random()*8+4,col:cols[i%5],l:1})}}
(function t(){c.clearRect(0,0,cv.width,cv.height);P=P.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.28;p.vx*=.99;p.r+=.2;p.l-=.012;c.save();c.globalAlpha=Math.max(p.l,0);c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.col;c.fillRect(-p.s/2,-2,p.s,4);c.restore();return p.l>0});requestAnimationFrame(t)})();
// Корзина
const dr=$('#drawer'),fmt=n=>n.toLocaleString('ru-RU')+' ₽';
function render(){$('#cnt').textContent=cart.length;$('#items').innerHTML=cart.map(i=>`<li><span>${i.n}, ${i.k} ${i.k===1?'шарик':'шарика'}</span><b>${fmt(i.p)}</b></li>`).join('')||'<li>Корзина пуста. Выберите вкус и добавьте его.</li>';$('#tot').textContent=fmt(cart.reduce((s,i)=>s+i.p,0))}
$('#add').onclick=e=>{const f=F[cur],r=e.currentTarget.getBoundingClientRect(),t=$('#cartBtn').getBoundingClientRect(),d=document.createElement('div');d.className='fly';d.style.cssText=`left:${r.left}px;top:${r.top}px;background:${f.c}`;document.body.appendChild(d);
d.animate([{transform:'scale(1)'},{transform:`translate(${t.left-r.left}px,${t.top-r.top}px) scale(.3)`}],{duration:700,easing:'cubic-bezier(.6,-.3,.8,.5)'}).onfinish=()=>{d.remove();cart.push({n:f.n,k,p:f.p*k});render();const b=$('#cartBtn');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');conf(t.left+t.width/2,t.top+t.height/2)}};
const tog=o=>{dr.classList.toggle('open',o);dr.setAttribute('aria-hidden',!o)};
$('#cartBtn').onclick=()=>tog(true);$('#close').onclick=()=>tog(false);
$('#order').onclick=()=>{if(!cart.length)return;$('#done').hidden=false;conf(innerWidth-200,innerHeight/2);cart=[];render()};
paint(F[0]);text(F[0]);scoops(false);render();
document.querySelectorAll('.sc path').forEach(p=>p.style.fill=F[0].c);
