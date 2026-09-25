'use strict';
const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
let savedTheme = null;
try { savedTheme = localStorage.getItem('frtc-theme'); } catch (_) {}
function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  themeToggle.setAttribute('aria-label', theme === 'light' ? 'فعال کردن حالت تاریک' : 'فعال کردن حالت روشن');
}
setTheme(['dark','light'].includes(savedTheme) ? savedTheme : systemTheme.matches ? 'light' : 'dark');
themeToggle.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(savedTheme);
  try { localStorage.setItem('frtc-theme', savedTheme); } catch (_) {}
});
systemTheme.addEventListener('change', e => { if (!savedTheme) setTheme(e.matches ? 'light' : 'dark'); });
const links = [...document.querySelectorAll('.chapter-nav a')];
const chapters = [...document.querySelectorAll('.chapter')];
const progress = document.querySelector('.reading-progress span');
let scheduled = false;
function updateReading() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${total > 0 ? Math.min(100,Math.max(0,scrollY / total * 100)) : 0}%`;
  let active = null;
  for (const chapter of chapters) { if (chapter.getBoundingClientRect().top <= 170) active = chapter.id; }
  links.forEach(link => {
    if (link.hash === `#${active}`) link.setAttribute('aria-current','true');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { requestAnimationFrame(updateReading); scheduled = true; } }, {passive:true});
window.addEventListener('resize',updateReading);
updateReading();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
  }), {rootMargin:'0px 0px 70px 0px',threshold:0});
  document.querySelectorAll('.reveal').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) {el.classList.add('pending');observer.observe(el);} });
}
const examples = {
  prize:['مشکوک؛ چون واژه «جایزه» دارد.','دعوت به کلیک و وعده جایزه می‌تواند نشانه خطر باشد.'],
  literature:['مشکوک؛ چون واژه «جایزه» دارد. اینجا قاعده خطا می‌کند.','در این مثال، زمینه یک خبر فرهنگی است؛ واژه «جایزه» به‌تنهایی نشانه خطر نیست.'],
  urgent:['مشکوک نیست؛ واژه «جایزه» ندارد. اینجا قاعده خطر را نمی‌بیند.','درخواست رمز همراه با تهدید فوری، نشانه خطر است؛ حتی بدون واژه «جایزه».']
};
document.querySelector('#message-example').addEventListener('change',e => {
  const [rule,learning] = examples[e.target.value];
  document.querySelector('#rule-result').textContent = rule;
  document.querySelector('#learning-result').textContent = learning;
});
const contexts = {
 milk:['او <mark>شیر</mark> را در <strong>لیوان</strong> ریخت.','«لیوان» و «ریخت» به برداشتِ نوشیدنی کمک می‌کنند.'],
 lion:['<mark>شیر</mark> در <strong>جنگل</strong> غرش کرد.','«جنگل» و «غرش» به برداشتِ حیوان کمک می‌کنند.']
};
document.querySelectorAll('[data-context]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-context]').forEach(b=>b.setAttribute('aria-pressed',String(b === button)));
 const [sentence,explanation] = contexts[button.dataset.context];
 document.querySelector('#attention-sentence').innerHTML=sentence;
 document.querySelector('#attention-explain').textContent=explanation;
}));
