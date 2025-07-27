// Beraberlik tarihi (YIL, AY-1, GÜN)
const startDate = new Date(2024, 0, 18, 0, 0, 0);
const counterEl = document.getElementById('counter');

function updateCounter() {
  const now = new Date();
  let diff = now - startDate;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.2425));
  diff -= years * (1000 * 60 * 60 * 24 * 365.2425);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);
  const seconds = Math.floor(diff / 1000);

  counterEl.textContent = `${years} yıl, ${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye`;
}
setInterval(updateCounter, 1000);
updateCounter();

// Galeri için
const galleryEl = document.getElementById('gallery');
let images = [];
let current = 0;

function preloadImages() {
  // img klasöründe 1.png, 2.png, ... 7.png olacak şekilde resimleri yükle
  images = [];
  for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = `img/${i}.png`;
    img.alt = `Anı ${i}`;
    images.push(img);
  }
}

function showGallery() {
  galleryEl.innerHTML = '';
  images.forEach((img, idx) => {
    img.className = '';
    if (idx === current) img.classList.add('active');
    else if (idx === (current + 1) % images.length) img.classList.add('next');
    else if (idx === (current - 1 + images.length) % images.length) img.classList.add('prev');
    galleryEl.appendChild(img);
  });
}

function nextImage() {
  current = (current + 1) % images.length;
  showGallery();
}
function prevImage() {
  current = (current - 1 + images.length) % images.length;
  showGallery();
}

preloadImages();
showGallery();
setInterval(nextImage, 3500);

galleryEl.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    openPopup(current);
  } else {
    nextImage();
  }
});

// Popup fonksiyonları
document.body.addEventListener('click', function(e) {
  // Popup overlay dışında tıklama ile kapatma
  if (e.target.classList && e.target.classList.contains('popup-overlay')) {
    closePopup();
  }
});

// --- Hareketli yıldızlı uzay arka planı ---
const starsCanvas = document.getElementById('stars-bg');
const ctx = starsCanvas.getContext('2d');
let stars = [];
let STAR_COUNT = 480;
let w = window.innerWidth;
let h = window.innerHeight;
let mouseX = 0.5, mouseY = 0.5;
starsCanvas.addEventListener('mousemove', function(e) {
  mouseX = e.offsetX / w;
  mouseY = e.offsetY / h;
});

function resizeStars() {
  w = window.innerWidth;
  h = window.innerHeight;
  starsCanvas.width = w;
  starsCanvas.height = h;
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.5 + 0.5
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, w, h);
  for (let star of stars) {
    ctx.save();
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    // Paralaks için mouseX ve mouseY ile kaydır
    let parallaxX = star.x + (mouseX - 0.5) * 60 * (star.r + 0.5);
    let parallaxY = star.y + (mouseY - 0.5) * 60 * (star.r + 0.5);
    ctx.arc(parallaxX, parallaxY, star.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#a259f7';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    // Hareket
    star.x += star.speed;
    if (star.x > w) {
      star.x = 0;
      star.y = Math.random() * h;
    }
  }
  requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();
window.addEventListener('resize', resizeStars);

// --- Popup animasyonlu geçişler ---
function openPopup(idx) {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-img-box">
      <button class="popup-close" title="Kapat">&times;</button>
      <button class="popup-arrow left" title="Önceki">&#8592;</button>
      <img class="popup-img fade-in" src="${images[idx].src}" alt="Büyük Anı">
      <button class="popup-arrow right" title="Sonraki">&#8594;</button>
      <button class="gallery-btn" id="open-gallery-btn" title="Tüm Fotoğraflar"><img src="img/gallery.svg" class="gallery-icon-img" alt="Galeri"></button>
    </div>
  `;
  document.body.appendChild(popup);

  // Çarpı ile kapatma
  popup.querySelector('.popup-close').onclick = closePopup;
  // Oklarla geçiş
  popup.querySelector('.popup-arrow.left').onclick = function(e) {
    e.stopPropagation();
    popupImgSwitch(-1);
  };
  popup.querySelector('.popup-arrow.right').onclick = function(e) {
    e.stopPropagation();
    popupImgSwitch(1);
  };
  // Galeri butonu
  popup.querySelector('#open-gallery-btn').onclick = function(e) {
    e.stopPropagation();
    closePopup();
    openGalleryPopup(current);
  };
}

function openGalleryPopup(selectedIdx) {
  let galleryPopup = document.createElement('div');
  galleryPopup.className = 'gallery-popup-overlay';
  galleryPopup.innerHTML = `
    <div class="gallery-popup-box">
      <button class="popup-close" title="Kapat">&times;</button>
      <div class="gallery-popup-grid">
        ${images.map((img, i) => `<img src="${img.src}" class="gallery-popup-thumb${i===selectedIdx?' selected':''}" data-idx="${i}" alt="Galeri Fotoğrafı">`).join('')}
      </div>
      <div class="gallery-popup-big">
        <img src="${images[selectedIdx].src}" class="gallery-popup-big-img" alt="Büyük Galeri Fotoğrafı">
      </div>
    </div>
  `;
  document.body.appendChild(galleryPopup);
  // Kapatma
  galleryPopup.querySelector('.popup-close').onclick = function() {
    galleryPopup.remove();
  };
  // Küçük resme tıklayınca büyük resmi değiştir
  const thumbs = galleryPopup.querySelectorAll('.gallery-popup-thumb');
  const bigImg = galleryPopup.querySelector('.gallery-popup-big-img');
  thumbs.forEach(thumb => {
    thumb.onclick = function() {
      thumbs.forEach(t => t.classList.remove('selected'));
      this.classList.add('selected');
      bigImg.src = this.src;
    };
  });
}

function closePopup() {
  let popup = document.querySelector('.popup-overlay');
  if (popup) popup.remove();
}

function popupImgSwitch(dir) {
  let popupImg = document.querySelector('.popup-img');
  if (!popupImg) return;
  popupImg.classList.remove('fade-in');
  popupImg.classList.add('fade-out');
  setTimeout(() => {
    current = (current + dir + images.length) % images.length;
    popupImg.src = images[current].src;
    popupImg.classList.remove('fade-out');
    popupImg.classList.add('fade-in');
  }, 350);
}

const addPhotoBtn = document.getElementById('add-photo-btn');
const addPhotoPopup = document.getElementById('add-photo-popup');
const closeAddPhotoPopup = document.getElementById('close-add-photo-popup');
const uploadPopup = document.getElementById('upload-popup');
const closeUploadPopup = document.getElementById('close-upload-popup');
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const selectedFile = document.getElementById('selected-file');
const continueUploadBtn = document.getElementById('continue-upload-btn');
const adminPopup = document.getElementById('admin-popup');
const closeAdminPopup = document.getElementById('close-admin-popup');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminPassword = document.getElementById('admin-password');
const showHidePassword = document.getElementById('show-hide-password');
const errorPopup = document.getElementById('error-popup');
const closeErrorPopup = document.getElementById('close-error-popup');

if (addPhotoBtn && addPhotoPopup && closeAddPhotoPopup && uploadPopup && closeUploadPopup && fileInput && uploadArea) {
  addPhotoBtn.addEventListener('click', () => {
    addPhotoPopup.style.display = 'flex';
    addPhotoPopup.classList.remove('fadeOut');
  });
  closeAddPhotoPopup.addEventListener('click', () => {
    addPhotoPopup.classList.add('fadeOut');
    setTimeout(() => { addPhotoPopup.style.display = 'none'; addPhotoPopup.classList.remove('fadeOut'); }, 400);
  });
  // Evet ve Hayır butonları popup'ı kapatır
  addPhotoPopup.querySelector('.popup-evet').onclick = () => {
    addPhotoPopup.classList.add('fadeOut');
    setTimeout(() => {
      addPhotoPopup.style.display = 'none';
      addPhotoPopup.classList.remove('fadeOut');
      uploadPopup.style.display = 'flex';
      uploadPopup.classList.remove('fadeOut');
    }, 400);
  };
  addPhotoPopup.querySelector('.popup-hayir').onclick = () => {
    addPhotoPopup.classList.add('fadeOut');
    setTimeout(() => { addPhotoPopup.style.display = 'none'; addPhotoPopup.classList.remove('fadeOut'); }, 400);
  };
  closeUploadPopup.onclick = () => {
    uploadPopup.classList.add('fadeOut');
    setTimeout(() => { uploadPopup.style.display = 'none'; uploadPopup.classList.remove('fadeOut'); }, 400);
  };
  // Dosya seçme
  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      selectedFile.textContent = files.map(f => f.name).join(', ');
      selectedFile.style.display = 'inline-block';
      continueUploadBtn.style.display = 'inline-block';
    } else {
      selectedFile.style.display = 'none';
      continueUploadBtn.style.display = 'none';
    }
  };
  // Drag & drop
  uploadArea.ondragover = (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ff6ec7';
  };
  uploadArea.ondragleave = (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#a259f7';
  };
  uploadArea.ondrop = (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#a259f7';
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      console.log('Yüklenen dosyalar:', files.map(f => f.name));
    }
  };
}
if (continueUploadBtn && adminPopup && uploadPopup) {
  continueUploadBtn.onclick = () => {
    uploadPopup.classList.add('fadeOut');
    setTimeout(() => {
      uploadPopup.style.display = 'none';
      uploadPopup.classList.remove('fadeOut');
      adminPopup.style.display = 'flex';
      adminPopup.classList.remove('fadeOut');
    }, 400);
  };
}
if (closeAdminPopup && adminPopup) {
  closeAdminPopup.onclick = () => {
    adminPopup.classList.add('fadeOut');
    setTimeout(() => { adminPopup.style.display = 'none'; adminPopup.classList.remove('fadeOut'); }, 400);
  };
}
if (showHidePassword && adminPassword) {
  showHidePassword.onclick = () => {
    if (adminPassword.type === 'password') {
      adminPassword.type = 'text';
      showHidePassword.textContent = '🙈';
    } else {
      adminPassword.type = 'password';
      showHidePassword.textContent = '👁️';
    }
  };
}
if (adminLoginBtn && errorPopup) {
  adminLoginBtn.onclick = () => {
    adminPopup.classList.add('fadeOut');
    setTimeout(() => {
      adminPopup.style.display = 'none';
      adminPopup.classList.remove('fadeOut');
      errorPopup.style.display = 'flex';
      errorPopup.classList.remove('fadeOut');
    }, 400);
  };
}
if (closeErrorPopup && errorPopup) {
  closeErrorPopup.onclick = () => {
    errorPopup.classList.add('fadeOut');
    setTimeout(() => { errorPopup.style.display = 'none'; errorPopup.classList.remove('fadeOut'); }, 400);
  };
}

const randomMemoryBtn = document.getElementById('random-memory-btn');
const randomMemoryPopup = document.getElementById('random-memory-popup');
const closeRandomMemoryPopup = document.getElementById('close-random-memory-popup');
const randomMemoryImg = document.getElementById('random-memory-img');
const randomMemoryQuote = document.getElementById('random-memory-quote');
const randomNextBtn = document.getElementById('random-next-btn');

function showRandomMemory(direction = 'in') {
  // Rastgele fotoğraf ve söz seç
  const idx = Math.floor(Math.random() * images.length);
  const quoteIdx = Math.floor(Math.random() * memoryQuotes.length);
  randomMemoryImg.src = images[idx].src;
  randomMemoryQuote.textContent = memoryQuotes[quoteIdx];
  if (direction === 'in') {
    randomMemoryPopup.classList.remove('slide-in-left', 'slide-out-right');
    randomMemoryPopup.classList.add('slide-in-right');
  } else if (direction === 'reverse') {
    randomMemoryPopup.classList.remove('slide-in-right', 'slide-out-left');
    randomMemoryPopup.classList.add('slide-in-left');
  }
}

const memoryQuotes = [
  'Sana bakmak, bir ömre bedel. -Cemal Süreya',
  'Bir tek dileğim var, mutlu ol yeter. -Mutlu Ol Yeter',
  'İçimde öyle bir his var ki, anlatamam. -Yalın',
  'Senden daha güzel yok. -Duman',
  'Seninle bir dakika, sensiz bir ömre bedel. -Tarkan',
  'Aşk, iki kişilik bir yalnızlıktır. -Paul Valery',
  'Bana ellerini ver, hayat seni sevince güzel. -Ajda Pekkan',
  'Gözlerin gözlerimde, ellerin ellerimde, aşkın içimde. -Sezen Aksu',
  'Sana bir sır vereyim mi? Benim en güzel hikayem sensin. -Cemal Süreya',
  'Sana sarılmak, eve dönmek gibi. -Can Yücel',
  'Birlikte gülmek, en güzel anımız. -XXXX & XXXX',
  'Ve ben seni, gözlerimle değil, kalbimle seviyorum. -Nazım Hikmet',
  'Sen benim en güzel tesadüfümsün. -Zülfü Livaneli',
  'Seninle her şey çok güzel. -XXXX & XXXX',
  'Sana ihtiyacım var, çünkü seni seviyorum. -Teoman',
  'Seninle bir ömür, bir saniye gibi. -Tarkan',
  'Gülmek en güzel ilaçtır, seninle gülmek ise mucize. -Barış Manço',
  'Beni bana bırakma, al yanına. -Mor ve Ötesi',
  'Aşk iki kişiliktir. -Ataol Behramoğlu',
  'Beni unutma, unutursan kalbim durur. -Sezen Aksu',
  'Sana bakmak, bir ömre bedel. -Cemal Süreya',
  'Birlikte yaşlanalım. -XXXX & XXXX',
  'Seninle olmak, yıldızlara dokunmak gibi. -Kenan Doğulu',
  'Sana sarılmak, eve dönmek gibi. -Can Yücel',
  'Birlikte gülmek, en güzel anımız. -XXXX & XXXX',
  'Aşk, bir kelime değil, bir cümledir. -Cemal Süreya',
  'Sana bakmak, bir ömre bedel. -Cemal Süreya',
  'Birlikte gülmek, en güzel anımız. -XXXX & XXXX',
  'Seninle her şey çok güzel. -XXXX & XXXX',
  'Senden daha güzel yok. -Duman',
  'Bana ellerini ver, hayat seni sevince güzel. -Ajda Pekkan',
  'Sana bir sır vereyim mi? Benim en güzel hikayem sensin. -Cemal Süreya',
  'Aşk iki kişiliktir. -Ataol Behramoğlu',
  'Beni bana bırakma, al yanına. -Mor ve Ötesi',
  'Bir tek dileğim var, mutlu ol yeter. -Mutlu Ol Yeter',
  'Beni unutma, unutursan kalbim durur. -Sezen Aksu',
  'Seninle bir dakika, sensiz bir ömre bedel. -Tarkan',
  'İçimde öyle bir his var ki, anlatamam. -Yalın',
  'Sen benim en güzel tesadüfümsün. -Zülfü Livaneli',
  'Ve ben seni, gözlerimle değil, kalbimle seviyorum. -Nazım Hikmet',
  'Gözlerin gözlerimde, ellerin ellerimde, aşkın içimde. -Sezen Aksu',
  'Birlikte yaşlanalım. -XXXX & XXXX',
];

if (randomMemoryBtn && randomMemoryPopup && randomMemoryImg && randomMemoryQuote) {
  randomMemoryBtn.onclick = () => {
    showRandomMemory('in');
    randomMemoryPopup.style.display = 'flex';
    randomMemoryPopup.classList.remove('fadeOut');
  };
}
if (closeRandomMemoryPopup && randomMemoryPopup) {
  closeRandomMemoryPopup.onclick = () => {
    randomMemoryPopup.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right');
    randomMemoryPopup.classList.add('slide-out-fade');
    setTimeout(() => { randomMemoryPopup.style.display = 'none'; randomMemoryPopup.classList.remove('slide-out-fade'); }, 700);
  };
}
if (randomNextBtn && randomMemoryPopup) {
  randomNextBtn.onclick = () => {
    randomMemoryPopup.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-fade');
    randomMemoryPopup.classList.add('slide-out-right');
    setTimeout(() => {
      showRandomMemory('reverse');
      randomMemoryPopup.classList.remove('slide-out-right');
      randomMemoryPopup.classList.add('slide-in-left');
    }, 700);
  };
}

const sinnerPixel = document.querySelector('.sinner-pixel');
const sinnerPopup = document.getElementById('sinner-popup');
const closeSinnerPopup = document.getElementById('close-sinner-popup');
const sinnerThanksBtn = document.getElementById('sinner-thanks-btn');
const sinnerText = document.querySelector('.sinner-text');
const sinnerThankText = document.getElementById('sinner-thank-text');
const sinnerThankSign = document.getElementById('sinner-thank-sign');
const sinnerThankBox = document.getElementById('sinner-thank-box');

function showSinnerPopup() {
  sinnerPopup.style.display = 'flex';
  sinnerPopup.classList.remove('fadeOut');
}

if (sinnerPixel && sinnerPopup) {
  sinnerPixel.onclick = showSinnerPopup;
}
if (sinnerText && sinnerPopup) {
  sinnerText.onclick = showSinnerPopup;
}
if (closeSinnerPopup && sinnerPopup) {
  closeSinnerPopup.onclick = () => {
    sinnerPopup.classList.add('fadeOut');
    setTimeout(() => { sinnerPopup.style.display = 'none'; sinnerPopup.classList.remove('fadeOut'); }, 500);
  };
}
if (sinnerThanksBtn && sinnerPopup) {
  sinnerThanksBtn.onclick = () => {
    sinnerPopup.classList.add('slide-out-fade');
    setTimeout(() => {
      sinnerPopup.style.display = 'none';
      sinnerPopup.classList.remove('slide-out-fade');
      // Kalp yağmuru efekti (yukarıdan aşağıya, 5 saniye)
      setTimeout(() => {
        if (sinnerThankBox) sinnerThankBox.style.display = 'block';
        for (let i = 0; i < 48; i++) {
          const heart = document.createElement('img');
          heart.src = 'img/icon.png';
          heart.className = 'sinner-heart-effect';
          heart.style.position = 'fixed';
          heart.style.left = (Math.random() * 98) + 'vw';
          heart.style.top = '-8vh';
          heart.style.width = (Math.random() * 36 + 18) + 'px';
          heart.style.transform = `rotate(${Math.random()*360}deg)`;
          heart.style.opacity = '0.92';
          heart.style.zIndex = 99999;
          document.body.appendChild(heart);
          setTimeout(() => {
            heart.style.transition = 'top 5s cubic-bezier(.4,1.6,.6,1), opacity 0.8s';
            heart.style.top = (Math.random() * 80 + 10) + 'vh';
          }, 30);
          setTimeout(() => {
            heart.style.transition = 'top 1.2s, opacity 1.2s';
            heart.style.top = '110vh';
            heart.style.opacity = '0';
          }, 5000);
          setTimeout(() => heart.remove(), 6400);
        }
        setTimeout(() => {
          if (sinnerThankBox) sinnerThankBox.style.display = 'none';
        }, 5200);
      }, 500);
    }, 700);
  };
}

const kavgaBtn = document.getElementById('kavga-btn');
const peacePopup = document.getElementById('peace-popup');
const closePeacePopup = document.getElementById('close-peace-popup');
const peaceYesBtn = document.getElementById('peace-yes-btn');
const peaceNoBtn = document.getElementById('peace-no-btn');
const peaceGifPopup = document.getElementById('peace-gif-popup');

if (kavgaBtn && peacePopup) {
  kavgaBtn.onclick = () => {
    peacePopup.style.display = 'flex';
    peacePopup.classList.remove('fadeOut');
    if (peaceYesBtn) peaceYesBtn.classList.remove('grow');
  };
}
if (closePeacePopup && peacePopup) {
  closePeacePopup.onclick = () => {
    peacePopup.classList.add('fadeOut');
    setTimeout(() => { peacePopup.style.display = 'none'; peacePopup.classList.remove('fadeOut'); }, 500);
  };
}
if (peaceNoBtn && peaceYesBtn) {
  let growScale = 1;
  let shrinkScale = 1;
  peaceNoBtn.onclick = () => {
    growScale += 0.25;
    shrinkScale = Math.max(0.2, shrinkScale - 0.18);
    peaceYesBtn.style.transform = `scale(${growScale})`;
    peaceYesBtn.style.boxShadow = "0 0 32px #ff6ec7, 0 0 64px #a259f7";
    // Hayır butonunu sola kaydır, opacity azalt, küçült
    const offset = Math.min((growScale - 1) * 120, 300);
    peaceNoBtn.style.transform = `translateX(-${offset}px) scale(${shrinkScale})`;
    let opacity = Math.max(1 - (growScale - 1) * 1.2, 0);
    peaceNoBtn.style.opacity = opacity;
    if (opacity === 0) peaceNoBtn.style.pointerEvents = "none";
  };
}
if (peaceYesBtn && peacePopup && peaceGifPopup && peaceNoBtn) {
  peaceYesBtn.onclick = () => {
    peaceYesBtn.style.transform = "";
    peaceYesBtn.style.boxShadow = "";
    peaceNoBtn.style.transform = "";
    peaceNoBtn.style.opacity = "";
    peaceNoBtn.style.pointerEvents = "";
    peacePopup.classList.add('fadeOut');
    setTimeout(() => {
      peacePopup.style.display = 'none';
      peacePopup.classList.remove('fadeOut');
      peaceGifPopup.style.display = 'flex';
      setTimeout(() => {
        peaceGifPopup.style.display = 'none';
      }, 2500);
    }, 500);
  };
} 

const activityBtn = document.getElementById('activity-btn');
const activityPopup = document.getElementById('activity-popup');
const closeActivityPopup = document.getElementById('close-activity-popup');
const activityPopupMsg = document.getElementById('activity-popup-msg');

const activities = [
  'Birlikte film gecesi yapın 🍿',
  'En sevdiğiniz şarkıda dans edin 💃🕺',
  'Birlikte yeni bir yemek tarifi deneyin 👩‍🍳👨‍🍳',
  'Gün batımını izleyin 🌅',
  'Birlikte yürüyüşe çıkın 🚶‍♀️🚶‍♂️',
  'Birbirinize mektup yazın ✉️',
  'Birlikte fotoğraf albümü hazırlayın 📸',
  'Birlikte oyun oynayın 🎲',
  'Birlikte kahve için ☕',
  'Birlikte yıldızları izleyin ✨',
  'Birlikte resim çizin veya boyayın 🎨',
  'Birlikte kitap okuyun 📚',
  'Birlikte hayal kurun ve hedeflerinizi konuşun 💭',
  'Birlikte eski fotoğraflara bakın 🖼️',
  'Birlikte piknik yapın 🧺',
  'Birlikte komik bir video çekin 🤳',
  'Birlikte yeni bir yer keşfedin 🗺️',
  'Birlikte puzzle yapın 🧩',
  'Birlikte karaoke yapın 🎤',
  'Birlikte dondurma yiyin 🍦',
  '🎥 Sinema gecesi yapın (evde veya dışarıda)',
  '🍝 Birlikte yemek pişirin',
  '🍦 Dondurma yemeye gidin',
  '🎡 Lunaparka gidin',
  '🌄 Gün doğumu / batımı izleyin',
  '📸 Birlikte fotoğraf çekin',
  '🎨 Birlikte resim yapın',
  '🌳 Piknik yapın',
  '🛏️ Tembel bir gün geçirip film-dizi maratonu yapın',
  '🎮 Oyun oynayın (Playstation, masa oyunu vs.)',
  '🎵 Konser veya festivale gidin',
  '🍷 Romantik bir akşam yemeği planlayın',
  '🚲 Bisiklet turu yapın',
  '🧩 Puzzle yapın',
  '🏞️ Doğa yürüyüşüne çıkın',
  '📚 Aynı kitabı okuyup tartışın',
  '🌙 Yıldızları izleyin',
  '💆‍♀️💆‍♂️ Spa günü yapın',
  '🎢 Macera parkına gidin',
  '🎤 Karaoke yapın',
  '🎭 Tiyatroya gidin',
  '🏖️ Denize veya göle gidin',
  '🧁 Birbirinize tatlı yapın',
  '🏨 Sürpriz otel kaçamağı yapın',
  '✈️ Küçük bir seyahat planlayın',
  '🍇 Bağ gezisine gidin, şarap tadın',
  '🧘‍♀️ Birlikte yoga veya meditasyon yapın',
  '🎯 Paintball ya da lazer tag oynayın',
  '🐶 Birlikte barınak ziyareti yapın, hayvanlarla vakit geçirin',
  '🪩 Dans kursuna katılın',
  '🥾 Kamp yapın',
  '🏰 Birlikte tarihi bir yer keşfedin',
  '🍵 Kahve dükkanı turu yapın',
  '🧺 Evde battaniye kalesi yapıp film izleyin',
  '🕯️ Mum ışığında banyo keyfi yapın',
  '🎳 Birlikte bowling oynayın'
];

if (activityBtn && activityPopup && activityPopupMsg) {
  activityBtn.onclick = () => {
    const idx = Math.floor(Math.random() * activities.length);
    activityPopupMsg.textContent = activities[idx];
    activityPopup.style.display = 'flex';
    activityPopup.classList.remove('fadeOut');
  };
}
if (closeActivityPopup && activityPopup) {
  closeActivityPopup.onclick = () => {
    activityPopup.classList.add('fadeOut');
    setTimeout(() => { activityPopup.style.display = 'none'; activityPopup.classList.remove('fadeOut'); }, 500);
  };
} 