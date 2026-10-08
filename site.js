(function(){
var R=matchMedia('(prefers-reduced-motion:reduce)').matches,H=matchMedia('(hover:hover)').matches,D=document,$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};

/* icons draw themselves */
if(!R){$('.ic').forEach(function(s){$('path,circle,rect',s).forEach(function(e){e.setAttribute('pathLength','1')})});D.documentElement.classList.add('dr')}

/* reveal on scroll */
function show(e){e.classList.add('in');setTimeout(function(){e.style.setProperty('--d','0ms');e.classList.add('rd')},1500)}
var rv=$('.rv');
if(R||!('IntersectionObserver' in window)){rv.forEach(function(e){e.classList.add('in','rd')})}
else{var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);o.unobserve(e.target)}})},{threshold:.15});rv.forEach(function(e){o.observe(e)})}

/* count up */
$('[data-n]').forEach(function(e){var n=+e.dataset.n;if(R){e.textContent=n;return}
new IntersectionObserver(function(es,ob){if(es[0].isIntersecting){ob.disconnect();var s=null;(function f(t){s=s||t;var p=Math.min((t-s)/1400,1);e.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(performance.now())}}).observe(e)});

if(R)return;

/* scroll progress, header state, hero parallax */
var bar=D.createElement('div');bar.className='prog';D.body.prepend(bar);
var top=D.querySelector('.top'),hero=D.querySelector('.hero'),tick=false;
function onScroll(){tick=false;var y=scrollY,m=D.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?y/m:0)+')';
if(top)top.classList.toggle('sc',y>24);if(hero&&y<innerHeight*1.5)hero.style.setProperty('--py',(y*.18)+'px')}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* drifting diamonds in every hero */
$('.hero').forEach(function(h){var c=D.createElement('canvas');c.className='pt';c.setAttribute('aria-hidden','true');h.prepend(c);
var x=c.getContext('2d'),W=0,Hh=0,P=[],run=false;
function size(){var r=h.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=c.width=r.width*d;Hh=c.height=r.height*d;var n=Math.max(8,Math.round(r.width/55));P=[];
for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*Hh,s:(4+Math.random()*9)*d,v:(.12+Math.random()*.35)*d,a:.07+Math.random()*.2,w:Math.random()*6})}
function f(t){if(!run)return;x.clearRect(0,0,W,Hh);x.fillStyle='#C9A05A';
P.forEach(function(p){p.y-=p.v;if(p.y<-p.s*2){p.y=Hh+p.s*2;p.x=Math.random()*W}var dx=Math.sin(t/2600+p.w)*p.s*.8;x.globalAlpha=p.a;x.beginPath();x.moveTo(p.x+dx,p.y-p.s);x.lineTo(p.x+dx+p.s*.6,p.y);x.lineTo(p.x+dx,p.y+p.s);x.lineTo(p.x+dx-p.s*.6,p.y);x.closePath();x.fill()});requestAnimationFrame(f)}
size();addEventListener('resize',size);
new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!run){run=true;requestAnimationFrame(f)}run=v}).observe(h)});

if(!H)return;

/* hero cursor glow */
if(hero)hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-r.left)+'px');hero.style.setProperty('--my',(e.clientY-r.top)+'px')});

/* tile and card spotlight + tilt */
$('.tile,.card').forEach(function(t){t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
t.style.setProperty('--mx',px+'px');t.style.setProperty('--my',py+'px');
if(t.classList.contains('tile')){t.style.setProperty('--ry',((px/r.width-.5)*8)+'deg');t.style.setProperty('--rx',((.5-py/r.height)*8)+'deg')}});
t.addEventListener('pointerleave',function(){t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')})});

/* magnetic buttons */
$('.b').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.18)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
b.addEventListener('pointerleave',function(){b.style.translate=''})});
})();
