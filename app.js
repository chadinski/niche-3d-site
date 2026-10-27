'use strict';

// Original model concepts. Prices, stock, reviews and downloads are not invented.
const products = [
  {id:'gear',name:'High-Torque Planetary Gearset',category:'Functional parts',description:'A precision-inspired planetary gear concept for your next mechanical project.',detail:'Explore an interlocking planetary gearset concept. Discuss your intended application and required dimensions before printing; fit, material, and mechanical suitability need individual confirmation.',format:'STL + STEP concept',image:'assets/gear.webp'},
  {id:'dragon',name:'Crystal Bone Dragon v2.0',category:'Articulated',description:'A little imagination, a lot of character. Explore an articulated dragon design.',detail:'An articulated crystal dragon concept with a segmented body and sculptural details. Share your preferred size and color in your request. Final articulation, finish, and print feasibility need confirmation.',format:'Articulated design concept',image:'assets/dragon.webp'},
  {id:'vase',name:'Geometric Low-Poly Vase',category:'Home & living',description:'Sculptural lines and a geometric silhouette for a space that feels like you.',detail:'A low-poly decorative vase concept for your home or workspace. Add your preferred dimensions and color to the request. Water resistance and suitability for a particular use must be discussed.',format:'Home & living concept',image:'assets/vase.webp'},
  {id:'organizer',name:'Workbench Hex Organizer',category:'Workshop',description:'A modular honeycomb-inspired design for a more considered workspace.',detail:'A hexagonal organizer concept for your workbench. Tell us what you want to store and the available space so dimensions, configuration, and material can be discussed before printing.',format:'Workshop design concept',image:'assets/organizer.webp'}
];
const $ = selector => document.querySelector(selector);
const knownIds = new Set(products.map(product => product.id));
const validCategories = new Set(['all', ...products.map(product => product.category)]);
const keys = {request:'niche3d.request.v1',saved:'niche3d.saved.v1'};
function readStorage(key, fallback) {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}}
function writeStorage(key, value) {try {localStorage.setItem(key,JSON.stringify(value));return true;} catch {return false;}}
const storedRequest = readStorage(keys.request, {});
let basket = {};
if(storedRequest && typeof storedRequest.items === 'object' && storedRequest.items !== null) {
  for(const [id,quantity] of Object.entries(storedRequest.items)) {
    if(knownIds.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99) basket[id] = quantity;
  }
}
let notes = typeof storedRequest?.notes === 'string' ? storedRequest.notes.slice(0,3000) : '';
const storedSaved = readStorage(keys.saved, []);
let saved = new Set(Array.isArray(storedSaved) ? storedSaved.filter(id=>knownIds.has(id)) : []);
let category = 'all';
let query = new URLSearchParams(location.search).get('q')?.slice(0,160) || '';
let savedOnly = false;
let toastTimer;
let lastDialogTrigger;

function toast(message) {
  const dialog=document.querySelector('dialog[open]');
  let status=$('#toast');
  if(dialog) {
    status=dialog.querySelector('.dialog-status');
    if(!status){status=document.createElement('p');status.className='dialog-status';status.setAttribute('role','status');dialog.append(status);}
  }
  status.textContent=message;status.classList.add('visible');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{status.classList.remove('visible');if(status.classList.contains('dialog-status'))status.remove();},3200);
}
function saveRequest() {if(!writeStorage(keys.request,{items:basket,notes})) toast('Browser storage is unavailable. Download your request to keep it.');updateCounts();}
function updateCounts() {
  const total = Object.values(basket).reduce((sum,qty)=>sum+qty,0);
  $('#request-count').textContent=total;
  $('#request-button').setAttribute('aria-label',`Open print request, ${total} ${total===1?'item':'items'}`);
  $('#saved-count').textContent=`(${saved.size})`;
}
function scrollToCatalog() {window.scrollTo({top:$('#catalog').getBoundingClientRect().top+window.scrollY-15,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function syncURL() {const url=new URL(location.href);if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');history.replaceState(null,'',url);}
function setCategory(value) {category=validCategories.has(value)?value:'all';savedOnly=false;query='';$('#search-input').value='';$('#search-category').value=category;syncURL();renderProducts();}
function clearFilters() {setCategory('all');$('#sort').value='featured';renderProducts();}
function renderProducts() {
  let visible=products.filter(product => (category==='all'||category===product.category) && (!savedOnly||saved.has(product.id)) && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase()));
  if($('#sort').value==='az')visible.sort((a,b)=>a.name.localeCompare(b.name));
  if($('#sort').value==='za')visible.sort((a,b)=>b.name.localeCompare(a.name));
  $('#catalog-title').textContent=savedOnly?'Your saved prints':query?`Results for “${query}”`:category==='all'?'Discover your next great print':category;
  $('#result-count').textContent=`${visible.length} ${visible.length===1?'design':'designs'}`;
  // All interpolated fields below come from the fixed catalog above. Search and
  // user notes are rendered with textContent/value, never interpreted as HTML.
  $('#products').innerHTML=visible.map(product=>`<article class="product-card"><button class="save-button" data-save="${product.id}" aria-label="${saved.has(product.id)?'Unsave':'Save'} ${product.name}" aria-pressed="${saved.has(product.id)}"><svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg></button><button class="product-picture" data-detail="${product.id}" aria-label="View ${product.name}"><img src="${product.image}" alt="Concept illustration of ${product.name}" width="1024" height="1024" loading="lazy"></button><div class="product-info"><p class="category-label">${product.category}</p><h3><button class="product-title" data-detail="${product.id}">${product.name}</button></h3><p class="product-description">${product.description}</p><div class="product-footer"><p class="quote-label">Quote on request</p><p class="product-format">${product.format}</p><button class="yellow-button" data-add="${product.id}">Add to print request</button></div></div></article>`).join('');
  $('#empty-state').hidden=visible.length>0;
  $('#active-search').hidden=!query&&!savedOnly&&category==='all';
  $('#search-summary').textContent=savedOnly?'Showing designs saved in this browser.':query?`Search: ${query}${category!=='all'?` · ${category}`:''}`:`Collection: ${category}`;
  document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
  updateCounts();
}
function showSaved() {savedOnly=true;category='all';query='';$('#search-input').value='';$('#search-category').value='all';syncURL();renderProducts();scrollToCatalog();}
function closeDialogs() {document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());}
function openDialog(dialog) {lastDialogTrigger=document.activeElement;closeDialogs();dialog.showModal();}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{
    if(document.querySelector('dialog[open]'))return;
    let trigger=lastDialogTrigger;
    if(!trigger?.isConnected && trigger?.dataset.detail)trigger=document.querySelector(`[data-detail="${trigger.dataset.detail}"]`);
    if(!trigger?.isConnected || trigger.closest('dialog'))trigger=$('#request-button');
    trigger.focus({preventScroll:true});
  });
});
function showProduct(id) {
  const product=products.find(item=>item.id===id);if(!product)return;
  $('#product-detail').innerHTML=`<div class="detail-layout"><div class="detail-image"><img src="${product.image}" width="1024" height="1024" alt="Concept illustration of ${product.name}"><small>Concept illustration · final print may vary</small></div><div class="detail-info"><p class="eyebrow">${product.category}</p><h2 id="detail-title">${product.name}</h2><p>${product.detail}</p><hr><p class="quote-label">Quote on request</p><dl><div><dt>Collection</dt><dd>${product.category}</dd></div><div><dt>Design</dt><dd>${product.format}</dd></div><div><dt>Print details</dt><dd>Size, color, and material to be confirmed</dd></div></dl><label class="detail-quantity" for="detail-quantity">Quantity <input id="detail-quantity" type="number" min="1" max="99" step="1" value="1" required></label><button class="yellow-button" id="detail-add" data-id="${product.id}">Add to print request</button><button class="text-link" data-save="${product.id}">${saved.has(product.id)?'Remove from saved prints':'Save this design for later'}</button></div></div>`;
  openDialog($('#product-dialog'));
}
function addToBasket(id, quantity=1) {
  if(!knownIds.has(id)||!Number.isInteger(quantity)||quantity<1||quantity>99)return;
  if((basket[id]||0)+quantity>99){toast('You can request up to 99 of each design. Add larger quantities in your notes.');return;}
  basket[id]=(basket[id]||0)+quantity;saveRequest();toast('Added to your print request');
}
function toggleSaved(id) {
  if(!knownIds.has(id))return;
  if(saved.has(id))saved.delete(id);else saved.add(id);
  if(!writeStorage(keys.saved,[...saved]))toast('Browser storage is unavailable. Saved prints will last for this visit.');
  else toast(saved.has(id)?'Design saved for later':'Design removed from saved prints');
  const restoreFocus=document.activeElement?.dataset.save===id;
  renderProducts();
  if($('#product-dialog').open) {const button=$('#product-detail [data-save]');if(button)button.textContent=saved.has(id)?'Remove from saved prints':'Save this design for later';}
  if(restoreFocus && !$('#product-dialog').open)document.querySelector(`[data-save="${id}"]`)?.focus({preventScroll:true});
}
function renderBasket() {
  const selected=products.filter(product=>basket[product.id]);
  $('#request-items').innerHTML=selected.length?selected.map(product=>`<article class="request-item"><img src="${product.image}" alt="${product.name} concept" width="128" height="128"><div><h3>${product.name}</h3><small>Quote on request</small><div class="request-controls"><div class="quantity-control"><button data-qty="${product.id}" data-change="-1" aria-label="Decrease quantity of ${product.name}" ${basket[product.id]===1?'disabled':''}>−</button><span aria-label="Quantity ${basket[product.id]}">${basket[product.id]}</span><button data-qty="${product.id}" data-change="1" aria-label="Increase quantity of ${product.name}" ${basket[product.id]===99?'disabled':''}>+</button></div><button class="text-link" data-remove="${product.id}">Remove<span class="sr-only"> ${product.name}</span></button></div></div></article>`).join(''):`<div class="request-empty"><h3>Your next idea starts here.</h3><p>Add a design from the collection, or describe your own idea below.</p><button class="text-link" id="request-browse">Explore the collection →</button></div>`;
  $('#request-total').textContent=`${Object.values(basket).reduce((a,b)=>a+b,0)} items`;
  const empty=!selected.length&&!notes.trim();$('#download-request').disabled=empty;$('#copy-request').disabled=empty;
}
function showRequest(custom=false) {$('#request-notes').value=notes;renderBasket();openDialog($('#request-dialog'));if(custom)$('#request-notes').focus();}
function requestText() {return ['NICHE3D — PRINT REQUEST','',...products.filter(p=>basket[p.id]).map(p=>`${basket[p.id]} × ${p.name} (${p.category})`),...(notes.trim()?['','PROJECT NOTES',notes.trim()]:[]),'','Images are concept illustrations. Materials, dimensions, availability, and pricing need confirmation before any order.','This document has not been submitted automatically. Please share it with Niche3D through your usual contact channel.'].join('\n');}
$('#search-input').value=query;
$('#search-form').addEventListener('submit',event=>{event.preventDefault();query=$('#search-input').value.trim().slice(0,160);category=$('#search-category').value;savedOnly=false;syncURL();renderProducts();scrollToCatalog();});
$('#sort').addEventListener('change',renderProducts);
$('#clear-search').addEventListener('click',clearFilters);$('#reset-search').addEventListener('click',clearFilters);
$('#saved-button').addEventListener('click',showSaved);$('#browse-saved').addEventListener('click',showSaved);$('#footer-saved').addEventListener('click',showSaved);
$('#request-button').addEventListener('click',()=>showRequest());$('#footer-request').addEventListener('click',()=>showRequest());
$('#all-menu-button').addEventListener('click',()=>openDialog($('#menu-dialog')));
$('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
$('#request-notes').addEventListener('input',event=>{notes=event.target.value.slice(0,3000);saveRequest();const empty=!Object.keys(basket).length&&!notes.trim();$('#download-request').disabled=empty;$('#copy-request').disabled=empty;});
$('#download-request').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([requestText()],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='niche3d-print-request.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Request downloaded. Share it with Niche3D to discuss your print.');});
$('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(requestText());toast('Print request copied');}catch{toast('Copy is unavailable in this browser. Download the request instead.');}});
document.addEventListener('click',event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.hasAttribute('data-close')){target.closest('dialog').close();return;}
  if(target.dataset.category){event.preventDefault();closeDialogs();setCategory(target.dataset.category);scrollToCatalog();return;}
  if(target.dataset.filter){setCategory(target.dataset.filter);return;}
  if(target.dataset.detail){showProduct(target.dataset.detail);return;}
  if(target.dataset.save){toggleSaved(target.dataset.save);return;}
  if(target.dataset.add){addToBasket(target.dataset.add);return;}
  if(target.id==='detail-add'){const input=$('#detail-quantity');if(!input.reportValidity())return;addToBasket(target.dataset.id,Number(input.value));return;}
  if(target.dataset.qty){const id=target.dataset.qty;const change=Number(target.dataset.change);if(!knownIds.has(id)||!basket[id])return;basket[id]=Math.max(1,Math.min(99,basket[id]+change));saveRequest();renderBasket();document.querySelector(`[data-qty="${id}"][data-change="${change}"]:not(:disabled)`)?.focus({preventScroll:true});return;}
  if(target.dataset.remove){delete basket[target.dataset.remove];saveRequest();renderBasket();$('#request-items button')?.focus({preventScroll:true});toast('Design removed from request');return;}
  if(target.id==='request-browse'){closeDialogs();clearFilters();scrollToCatalog();return;}
  if(target.classList.contains('custom-trigger')){showRequest(true);return;}
  if(target.classList.contains('how-trigger')){openDialog($('#help-dialog'));return;}
});
const slides=[
  {eyebrow:'A LITTLE IMAGINATION. ENDLESS POSSIBILITIES.',title:'Your next great print<br>starts here.',description:'Useful, playful, a little unexpected.<br>Find a design that makes it yours.',link:'Explore the collection',category:'all',image:'vase',caption:'THE HOME & LIVING EDIT',color:'#f8d783'},
  {eyebrow:'A BETTER PLACE FOR YOUR NEXT BIG IDEA.',title:'A little order.<br>A lot of possibility.',description:'Give your workspace a fresh start.<br>Explore designs made for making.',link:'Explore workshop designs',category:'Workshop',image:'organizer',caption:'THE WORKSHOP EDIT',color:'#dce7dd'},
  {eyebrow:'FOR THE WONDERFULLY CURIOUS.',title:'Let your imagination<br>take shape.',description:'Bring a little character to your collection.<br>Meet a design with a playful side.',link:'Explore articulated designs',category:'Articulated',image:'dragon',caption:'THE ARTICULATED EDIT',color:'#f1d5c6'}
];
let slideIndex=0;
function showSlide(index) {slideIndex=(index+slides.length)%slides.length;const slide=slides[slideIndex];$('#hero-eyebrow').textContent=slide.eyebrow;$('#hero-title').innerHTML=slide.title;$('#hero-description').innerHTML=slide.description;$('#hero-link').innerHTML=`${slide.link} <span aria-hidden="true">→</span>`;$('#hero-link').dataset.category=slide.category;$('#hero-image').src=`assets/${slide.image}.webp`;$('#hero-caption').textContent=slide.caption;$('.hero').style.background=slide.color;document.querySelectorAll('[data-slide]').forEach(button=>{if(Number(button.dataset.slide)===slideIndex)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});}
$('#hero-prev').addEventListener('click',()=>showSlide(slideIndex-1));$('#hero-next').addEventListener('click',()=>showSlide(slideIndex+1));document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>showSlide(Number(button.dataset.slide))));
window.addEventListener('storage',event=>{if(Object.values(keys).includes(event.key))toast('Your saved list changed in another tab. Reload to see the latest version.');});
$('#year').textContent=new Date().getFullYear();
renderProducts();
