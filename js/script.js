

'use strict';
// CONFIGURACIÓN: completar con datos confirmados del estudio.
// WhatsApp: código de país y número, sólo dígitos. Si hay ambos, se usa WhatsApp.
// Las imágenes actuales están incrustadas en los atributos src del HTML.
// Podés sustituir cada src por la URL de la fotografía original de alta calidad.
const CONTACTO = { whatsapp: '5491121542210', email: '' };
// Access Key de Web3Forms (web3forms.com): las consultas del formulario llegan
// automáticamente al mail configurado ahí. Para cambiar el mail de destino,
// generar una nueva key en Web3Forms y reemplazarla acá.
const WEB3FORMS_ACCESS_KEY = 'a08fd24a-46f7-4738-874c-51c2223ad75b';
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const header = $('#header'), menu = $('.menu'), navigation = $('#navigation');
function closeMenu(){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
matchMedia('(min-width: 801px)').addEventListener('change',closeMenu);
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});
header.classList.toggle('scrolled',scrollY>40);
$('#year').textContent=new Date().getFullYear();


// Cada sección entra como una unidad; izquierda, derecha y así sucesivamente.
const revealSections=[...document.querySelectorAll('main > section')];
revealSections.forEach((section,index)=>{
 section.classList.add('section-enter');
 section.dataset.entrySide=index%2===0?'left':'right';
});
const countEls=[...document.querySelectorAll('.profile-count')];
let sectionObserver, counterObserver;
const countFrames=new Map();
function finishCounts(){
 countFrames.forEach(id=>cancelAnimationFrame(id));countFrames.clear();
 countEls.forEach(el=>el.textContent=el.dataset.target);
}
function animateCount(el){
 const end=Number(el.dataset.target),start=performance.now();
 function frame(now){
  const progress=Math.min((now-start)/1100,1);
  el.textContent=String(Math.round(end*(1-Math.pow(1-progress,3))));
  if(progress<1)countFrames.set(el,requestAnimationFrame(frame));else countFrames.delete(el);
 }
 el.textContent='0';countFrames.set(el,requestAnimationFrame(frame));
}

function revealAllSections(){
 document.documentElement.classList.remove('section-motion');
 sectionObserver?.disconnect();counterObserver?.disconnect();
 revealSections.forEach(section=>section.classList.add('is-visible'));
 finishCounts();
}
if('IntersectionObserver' in window && !reduced.matches){
 sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.classList.add('is-visible');
   sectionObserver.unobserve(entry.target);
  }
 }),{threshold:0,rootMargin:'0px 0px -35px 0px'});
 document.documentElement.classList.add('section-motion');
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  revealSections.forEach(section=>sectionObserver.observe(section));
 }));
 counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){animateCount(entry.target);counterObserver.unobserve(entry.target);}
 }),{threshold:.6});
 countEls.forEach(el=>counterObserver.observe(el));
}
reduced.addEventListener('change',()=>{if(reduced.matches)revealAllSections();});
const slides=[...document.querySelectorAll('.hero-slide')], dots=[...document.querySelectorAll('.slide-dot')];
let currentSlide=0, paused=reduced.matches, slideTimer;
function showSlide(n){currentSlide=n;slides.forEach((img,i)=>img.classList.toggle('active',i===n));dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===n)));}
function syncSlides(){clearInterval(slideTimer);if(!paused&&!document.hidden)slideTimer=setInterval(()=>showSlide((currentSlide+1)%slides.length),3500);}
dots.forEach(dot=>dot.addEventListener('click',()=>{showSlide(Number(dot.dataset.slide));syncSlides();}));

document.addEventListener('visibilitychange',syncSlides);
reduced.addEventListener('change',()=>{paused=reduced.matches;syncSlides();});
syncSlides();


const projectDialog=$('#projectDialog');
const PROJECTS=[{"title": "Edificio Ocampo", "facts": "Ituzaingó · 2.000 m² · Construcción 2018–2021", "question": "La independencia de una casa, en altura.", "scope": "Proyecto y dirección de un edificio con 13 departamentos, dos locales gastronómicos, terrazas y cocheras.", "highlights": ["Viviendas de distintas tipologías, adaptables a diversas formas de convivencia.", "Expansiones generosas, vegetación y terrazas que acercan el exterior a cada unidad.", "Vacíos entre viviendas y circulaciones semicubiertas para favorecer privacidad, iluminación y ventilación."], "credits": "Proyecto y dirección: Diorella Fortunati. Fotografía de obra terminada: Federico Kulekdjian.", "url": "https://www.estudiomorton.com/edificioocampo"}, {"title": "Casa Sur", "facts": "Horizontes al Sur, Canning · 135 m² · Construcción 2022", "question": "Hacer más con los recursos disponibles.", "scope": "Proyecto y dirección de una vivienda familiar, con especial atención al presupuesto, la orientación y la flexibilidad de sus espacios.", "highlights": ["Dos bloques articulados por un núcleo de servicios que organiza el acceso.", "Áreas flexibles que admiten divisiones posteriores y cambios en la vida familiar.", "Cubiertas premoldeadas y espacios semicubiertos como parte de la estrategia constructiva."], "credits": "Proyecto y dirección: Diorella Fortunati. Fotografía: Matias Godec.", "url": "https://www.estudiomorton.com/casasur"}, {"title": "Casa Laguna", "facts": "Horizontes al Sur, Canning · 170 m² · Construcción 2022", "question": "Una casa que construye su propio paisaje.", "scope": "Proyecto y dirección de una vivienda frente a la laguna, organizada alrededor de la privacidad y de un espacio común flexible conectado con el exterior.", "highlights": ["Patio de acceso y espacios perimetrales que resguardan la intimidad.", "Patio de agua que separa el dormitorio principal del resto de la vivienda.", "Continuidad visual entre los espacios sociales, el jardín, la pileta y la laguna."], "credits": "Proyecto: Diorella Fortunati y Nuria Jover. Dirección: Diorella Fortunati.", "url": "https://www.estudiomorton.com/casalaguna"}, {"title": "Edificio Calvino", "facts": "Ituzaingó · 4.000 m² proyectados · Proyecto 2017", "question": "Distintas actividades, un mismo proyecto.", "scope": "Proyecto de un edificio de usos mixtos con locales, oficinas, departamentos y terrazas. La ficha del estudio informa superficie a construir.", "highlights": ["Unidades flexibles con al menos tres alternativas de uso.", "Posibilidad de definir tabiques desde la compra en pozo, manteniendo el núcleo húmedo en una posición fija.", "Opciones de uno o dos dormitorios, o dormitorio y oficina, con expansiones y distintas condiciones de privacidad."], "credits": "Proyecto: Diorella Fortunati. Imágenes: Estudio Morton.", "url": "https://www.estudiomorton.com/edificiocalvino"}];
let currentInterest='';
document.querySelectorAll('.project').forEach(card=>{
 card.querySelector('.project-select').addEventListener('click',()=>{
  const img=card.querySelector('img'), project=PROJECTS[Number(card.dataset.project)];
  $('#projectImage').src=img.src;$('#projectImage').alt=img.alt;
  $('#projectTitle').textContent=project.title;
  $('#projectFacts').textContent=project.facts;
  $('#projectQuestion').textContent=project.question;
  $('#projectScope').textContent=project.scope;
  $('#projectHighlights').replaceChildren(...project.highlights.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  $('#projectCredits').textContent=project.credits;
  $('#projectSource').href=project.url;
  currentInterest=card.dataset.interest;
  projectDialog.showModal();projectDialog.scrollTop=0;
 });
});
const worksTrack=$('#worksTrack'), worksPrev=$('#worksPrev'), worksNext=$('#worksNext');
function syncWorksControls(){
 worksPrev.disabled=worksTrack.scrollLeft<2;
 worksNext.disabled=worksTrack.scrollLeft>=worksTrack.scrollWidth-worksTrack.clientWidth-2;
}
function moveWorks(direction){
 const card=worksTrack.querySelector('.project'),gap=parseFloat(getComputedStyle(worksTrack).columnGap)||0;
 worksTrack.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:reduced.matches?'instant':'smooth'});
}
worksPrev.addEventListener('click',()=>moveWorks(-1));
worksNext.addEventListener('click',()=>moveWorks(1));
worksTrack.addEventListener('scroll',syncWorksControls,{passive:true});
worksTrack.addEventListener('keydown',e=>{
 if(e.target!==worksTrack)return;
 if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveWorks(e.key==='ArrowRight'?1:-1);}
});
addEventListener('resize',syncWorksControls);syncWorksControls();
projectDialog.addEventListener('close',()=>{document.body.classList.remove('project-modal-open');});
new MutationObserver(()=>document.body.classList.toggle('project-modal-open',projectDialog.open)).observe(projectDialog,{attributes:true,attributeFilter:['open']});
document.querySelectorAll('[data-interest][href]').forEach(link=>link.addEventListener('click',()=>{$('#tipo').value=link.dataset.interest;}));
$('#projectInquiry').addEventListener('click',()=>{$('#tipo').value=currentInterest;projectDialog.close();});
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
});
const whatsapp=CONTACTO.whatsapp.replace(/\D/g,''), email=CONTACTO.email.trim();

// Completar CONTACTO.whatsapp arriba para activar los tres enlaces.
// Ejemplo de formato argentino: 549 + código de área + número, sin +, espacios ni 15.
const WHATSAPP_MESSAGES = {
 vivienda: 'Hola, Diorella. Estoy interesado/a en un proyecto de vivienda familiar. Me gustaría recibir más información.',
 inversion: 'Hola, Diorella. Estoy interesado/a en un proyecto de inversión inmobiliaria. Me gustaría recibir más información.',
 general: 'Hola, Diorella. Me gustaría consultar sobre un proyecto de arquitectura.'
};
document.querySelectorAll('[data-wa]').forEach(link=>{
 const message=WHATSAPP_MESSAGES[link.dataset.wa];
 if(whatsapp){
  link.href='https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message);
  link.target='_blank';link.rel='noopener noreferrer';
 }else{
  link.addEventListener('click',event=>{
   event.preventDefault();
   $('#inquiryText').value=message;
   $('#inquiryExplanation').textContent='El mensaje está listo. Falta configurar el número de WhatsApp del estudio para abrir la conversación. Por ahora podés copiarlo.';
   $('#sendInquiry').hidden=true;
   $('#copyStatus').textContent='';
   $('#inquiryDialog').showModal();
  });
 }
});

const connected=!!(whatsapp||email);
$('#submitLabel').textContent='Enviar consulta';$('#contactNote').textContent='Tu consulta se envía directamente por mail.'+(connected?whatsapp?' También podés continuar por WhatsApp.':' También podés continuar por correo.':'');
$('#contactForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const f=new FormData(form);
 const text=['Hola, Diorella. Me gustaría conversar sobre mi proyecto.','',
 'Nombre: '+f.get('nombre'),'Email: '+f.get('email'),'Teléfono: '+(f.get('telefono')||'No indicado'),
 'Proyecto: '+f.get('tipo'),'Ubicación: '+(f.get('ubicacion')||'A definir'),'',f.get('mensaje')].join('\n');
 $('#inquiryText').value=text;$('#copyStatus').textContent='';
 const send=$('#sendInquiry');send.hidden=!connected;
 if(connected){
  send.href=whatsapp?'https://wa.me/'+whatsapp+'?text='+encodeURIComponent(text):'mailto:'+email+'?subject='+encodeURIComponent('Consulta de arquitectura · '+f.get('tipo'))+'&body='+encodeURIComponent(text);
  send.textContent=whatsapp?'Continuar en WhatsApp':'Abrir mi correo';
 }
 const submitBtn=form.querySelector('button[type=submit]');
 if(submitBtn)submitBtn.disabled=true;
 $('#inquiryExplanation').textContent='Enviando tu consulta…';
 $('#inquiryDialog').showModal();
 try{
  const res=await fetch('https://api.web3forms.com/submit',{
   method:'POST',
   headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({
    access_key:WEB3FORMS_ACCESS_KEY,
    subject:'Consulta de arquitectura · '+f.get('tipo'),
    from_name:f.get('nombre'),
    email:f.get('email'),
    Nombre:f.get('nombre'),
    Teléfono:f.get('telefono')||'No indicado',
    'Tipo de proyecto':f.get('tipo'),
    Ubicación:f.get('ubicacion')||'A definir',
    Mensaje:f.get('mensaje')
   })
  });
  const data=await res.json();
  if(!data.success)throw new Error(data.message||'Error al enviar');
  $('#inquiryExplanation').textContent='Tu consulta ya fue enviada. Te van a responder a la brevedad.'+(connected?' También podés continuar '+(whatsapp?'por WhatsApp.':'por correo.'):'');
  form.reset();
 }catch(err){
  $('#inquiryExplanation').textContent='No pudimos enviar tu consulta automáticamente. Podés copiarla'+(connected?' o continuar '+(whatsapp?'por WhatsApp.':'por correo.'):'.');
 }finally{
  if(submitBtn)submitBtn.disabled=false;
 }
});
$('#copyInquiry').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText($('#inquiryText').value);$('#copyStatus').textContent='Consulta copiada.';}
 catch{$('#inquiryText').focus();$('#inquiryText').select();$('#copyStatus').textContent='El texto está seleccionado. Copialo con Ctrl+C o la opción Copiar de tu dispositivo.';}
});

