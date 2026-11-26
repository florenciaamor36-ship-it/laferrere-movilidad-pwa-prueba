const cards=[...document.querySelectorAll('.line-card')];
const number=document.getElementById('selectedNumber');
const search=document.getElementById('lineSearch');
const empty=document.getElementById('emptySearch');
function choose(card){cards.forEach(item=>item.classList.toggle('selected',item===card));number.textContent=card.dataset.line;}
cards.forEach(card=>card.addEventListener('click',()=>choose(card)));
search.addEventListener('input',()=>{const q=search.value.trim();let count=0;cards.forEach(card=>{const show=card.dataset.line.includes(q);card.classList.toggle('hidden',!show);if(show)count++});empty.classList.toggle('hidden',count!==0)});
let installPrompt;const installBtn=document.getElementById('installBtn');window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installBtn.classList.remove('hidden')});installBtn?.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installBtn.classList.add('hidden')});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
