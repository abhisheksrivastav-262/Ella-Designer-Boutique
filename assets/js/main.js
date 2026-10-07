/* Ella™ Boutique — interactions */
(function(){
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));

  // Preloader
  window.addEventListener('load',()=>{
    setTimeout(()=>{ $('#preloader')?.classList.add('done'); document.body.classList.add('loaded'); }, 900);
  });
  // fallback
  setTimeout(()=>{ $('#preloader')?.classList.add('done'); }, 4000);

  // Header solid on scroll
  const header = $('.site-header');
  const onScroll = ()=>{
    if(!header) return;
    if(window.scrollY > 40) header.classList.add('solid'), header.classList.remove('transparent');
    else if(header.dataset.transparent==="true"){ header.classList.remove('solid'); header.classList.add('transparent'); }
    else header.classList.add('solid');
    // Full-photo mode: images use object-fit:contain, so no parallax
    // transform is applied — any shift/scale would push photo edges
    // out of frame. Scroll effects are handled by reveal animations.
  };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile nav
  const mnav = $('#mobileNav');
  $$('[data-open-menu]').forEach(b=>b.addEventListener('click',()=>{ mnav?.classList.add('open'); document.body.style.overflow='hidden'; }));
  $$('[data-close-menu]').forEach(b=>b.addEventListener('click',()=>{ mnav?.classList.remove('open'); document.body.style.overflow=''; }));
  mnav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ mnav.classList.remove('open'); document.body.style.overflow=''; }));

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  $$('.reveal,.reveal-img,.stagger').forEach(el=>io.observe(el));
  // Safety net: never leave content hidden — IO reveals on scroll,
  // and after 3.5s everything is force-revealed even if IO misfires.
  setTimeout(()=>{
    $$('.reveal,.reveal-img,.stagger').forEach(el=>el.classList.add('visible'));
  }, 3500);

  // Active nav
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-desktop a, .mobile-nav a.mlink').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===path || (path===''&&href==='index.html')) a.classList.add('active');
  });

  // Cursor + magnetic
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && dot && ring){
    let x=0,y=0,rx=0,ry=0;
    window.addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;dot.style.left=x+'px';dot.style.top=y+'px';});
    (function loop(){ rx+=(x-rx)*.16; ry+=(y-ry)*.16; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
    $$('a,.btn,button').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('is-hover'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('is-hover'));
    });
  }
  // Magnetic buttons (subtle)
  if(window.matchMedia('(hover:hover)').matches){
    $$('.btn-solid,.btn-light').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect();
        const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
        btn.style.transform=`translate(${dx*.08}px,${dy*.12}px)`;
      });
      btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
    });
  }

  // Gallery filter + lightbox
  const filterBtns = $$('.filter-btn');
  const gItems = $$('.g-item');
  filterBtns.forEach(b=>b.addEventListener('click',()=>{
    filterBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active');
    const f=b.dataset.filter;
    gItems.forEach(it=>{
      const show = f==='all' || it.dataset.cat===f;
      it.style.display = show?'':'none';
    });
  }));
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  let lbList=[], lbIdx=0;
  function openLb(src,alt){ if(!lb) return; lbList = gItems.filter(i=>i.style.display!=='none').map(i=>({src:i.querySelector('img').src,alt:i.querySelector('img').alt})); lbIdx = Math.max(0, lbList.findIndex(x=>x.src===src)); lbImg.src=src; lbImg.alt=alt||''; lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function navLb(d){ if(!lbList.length) return; lbIdx=(lbIdx+d+lbList.length)%lbList.length; lbImg.src=lbList[lbIdx].src; lbImg.alt=lbList[lbIdx].alt; }
  gItems.forEach(it=>it.addEventListener('click',()=>openLb(it.querySelector('img').src, it.querySelector('img').alt)));
  $('#lbClose')?.addEventListener('click',()=>{lb.classList.remove('open');document.body.style.overflow='';});
  $('#lbPrev')?.addEventListener('click',e=>{e.stopPropagation();navLb(-1);});
  $('#lbNext')?.addEventListener('click',e=>{e.stopPropagation();navLb(1);});
  lb?.addEventListener('click',e=>{ if(e.target===lb){lb.classList.remove('open');document.body.style.overflow='';} });
  window.addEventListener('keydown',e=>{
    if(!lb?.classList.contains('open')) { if(e.key==='Escape') mnav?.classList.remove('open'); return; }
    if(e.key==='Escape'){lb.classList.remove('open');document.body.style.overflow='';}
    if(e.key==='ArrowLeft') navLb(-1);
    if(e.key==='ArrowRight') navLb(1);
  });

  // Contact form -> WhatsApp enquiry to the boutique
  const form = $('#enquiryForm');
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name=fd.get('name'), phone=fd.get('phone'), email=fd.get('email'), occasion=fd.get('occasion'), date=fd.get('date'), msg=fd.get('message');
    const text =
`New Design Enquiry — Ella Boutique
--------------------------
Name: ${name}
Phone: ${phone}
Email: ${email || '-'}
Occasion: ${occasion}
Preferred date: ${date || '-'}

Message:
${msg}
--------------------------
Sent from www.ellaboutique.in`;
    window.open('https://wa.me/919826078711?text=' + encodeURIComponent(text), '_blank', 'noopener');
    toast('Thank you ' + (name||'') + '. Your enquiry is opening in WhatsApp — just press send there.');
    form.reset();
  });
  function toast(msg){
    let t=$('.toast');
    if(!t){ t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
    t.textContent=msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 5200);
  }

  // Image safety net: no blank gaps ever.
  // If any photo fails (cache/stale path), retry once with the
  // boutique storefront, else hide gracefully over wine placeholders.
  const FALLBACK = 'assets/img/real/ella-storefront.jpg';
  $$('img').forEach(img=>{
    if(!img.getAttribute('src')) return;
    const fail = ()=>{
      if(img.src.indexOf('ella-storefront')===-1 && !img.dataset.fbk){
        img.dataset.fbk='1'; img.src=FALLBACK;
      } else { img.style.opacity='0'; }
    };
    img.addEventListener('error', fail);
    if(img.complete && img.naturalWidth===0) fail();
  });

  // Footer year
  const y=$('#yr'); if(y) y.textContent=new Date().getFullYear();
})();
