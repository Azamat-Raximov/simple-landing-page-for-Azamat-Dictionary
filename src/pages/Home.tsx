import { useState, useEffect, useRef, useCallback } from "react";

const screenshots = [
  { src: "/screenshot-1.webp", alt: "Azamat Dictionary - Bosh sahifa" },
  { src: "/screenshot-2.webp", alt: "Azamat Dictionary - So'z ma'nosi" },
  { src: "/screenshot-3.webp", alt: "Azamat Dictionary - So'z tarixi" },
  { src: "/screenshot-4.webp", alt: "Azamat Dictionary - Saqlangan so'zlar" },
  { src: "/screenshot-5.webp", alt: "Azamat Dictionary - Mavzular" },
  { src: "/screenshot-6.webp", alt: "Azamat Dictionary - Mavzu so'zlari" },
  { src: "/screenshot-7.webp", alt: "Azamat Dictionary - Haqida" },
];

type Lang = "uz" | "en" | "ru";

const translations: Record<Lang, {
  heading: string;
  desc: string;
  featuresTitle: string;
  features: { bold: string; rest: string }[];
  downloadBtn: string;
  zoomHint: string;
  telegramLabel: string;
  prev: string;
  next: string;
  close: string;
}> = {
  uz: {
    heading: "TIL O'RGANAMAN DEB CHALG'IB KETAYABSIZMI?",
    desc: "Butunlayiga offline, komputeringizda ishlaydigan Azamat Dictionary dasturini yuklab oling.",
    featuresTitle: "Dastur imkoniyatlari",
    features: [
      { bold: "ma'nosini", rest: "Har qanday inglizcha so'zning {bold} toping" },
      { bold: "talaffuzini", rest: "So'zning {bold} eshiting va o'rganing" },
      { bold: "gaplarda qanday ishlatilishini", rest: "So'z {bold} ko'ring" },
      { bold: "Sinonim va antonimlarini", rest: "{bold} bir joyda toping" },
      { bold: "saqlab", rest: "Topgan so'zlaringizni {bold} qo'ying" },
      { bold: "tarixini", rest: "Qidirgan so'zlaringizning {bold} ko'ring" },
      { bold: "mavzularga bo'lingan", rest: "So'zlarni {bold} holda topib, yodlashni osonlashtiring" },
    ],
    downloadBtn: "DASTURNI YUKLASH",
    zoomHint: "Kattalashtirish uchun bosing",
    telegramLabel: "Telegram:",
    prev: "Oldingi",
    next: "Keyingi",
    close: "Yopish",
  },
  en: {
    heading: "GETTING LOST WHILE TRYING TO LEARN A LANGUAGE?",
    desc: "Download Azamat Dictionary — a fully offline dictionary that runs right on your computer.",
    featuresTitle: "Features",
    features: [
      { bold: "meaning", rest: "Find the {bold} of any English word" },
      { bold: "pronunciation", rest: "Listen to and learn the {bold}" },
      { bold: "example sentences", rest: "See how the word is used in {bold}" },
      { bold: "Synonyms and antonyms", rest: "{bold} all in one place" },
      { bold: "save", rest: "Words you look up — {bold} them for later" },
      { bold: "search history", rest: "Browse your {bold} any time" },
      { bold: "by topic", rest: "Find words {bold} and memorize them easily" },
    ],
    downloadBtn: "DOWNLOAD",
    zoomHint: "Click to enlarge",
    telegramLabel: "Telegram:",
    prev: "Previous",
    next: "Next",
    close: "Close",
  },
  ru: {
    heading: "ТЕРЯЕТЕСЬ, ПЫТАЯСЬ ВЫУЧИТЬ ЯЗЫК?",
    desc: "Скачайте Azamat Dictionary — полностью офлайн словарь, который работает прямо на вашем компьютере.",
    featuresTitle: "Возможности программы",
    features: [
      { bold: "значение", rest: "Найдите {bold} любого английского слова" },
      { bold: "произношение", rest: "Слушайте и изучайте {bold}" },
      { bold: "в предложениях", rest: "Смотрите, как слово используется {bold}" },
      { bold: "Синонимы и антонимы", rest: "{bold} — всё в одном месте" },
      { bold: "сохраняйте", rest: "Найденные слова {bold} для себя" },
      { bold: "историю поиска", rest: "Просматривайте {bold} в любое время" },
      { bold: "по темам", rest: "Находите слова {bold} и легко запоминайте" },
    ],
    downloadBtn: "СКАЧАТЬ",
    zoomHint: "Нажмите для увеличения",
    telegramLabel: "Telegram:",
    prev: "Назад",
    next: "Вперёд",
    close: "Закрыть",
  },
};

function renderFeature(feature: { bold: string; rest: string }) {
  const parts = feature.rest.split("{bold}");
  return (
    <>
      {parts[0]}
      <span className="text-white font-semibold">{feature.bold}</span>
      {parts[1]}
    </>
  );
}

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Carousel({ onOpen, t }: { onOpen: (index: number) => void; t: typeof translations["uz"] }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % screenshots.length);
    }, 3000);
  }, []);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  const goNext = () => { setCurrent((c) => (c + 1) % screenshots.length); startInterval(); };
  const goPrev = () => { setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length); startInterval(); };
  const goTo = (i: number) => { setCurrent(i); startInterval(); };

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      <div
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-pointer group relative"
        onClick={() => onOpen(current)}
      >
        <img src={screenshots[current].src} alt={screenshots[current].alt} className="w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1A237E] text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg">
            {t.zoomHint}
          </span>
        </div>
      </div>

      <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-150 z-10 border-2 border-white/30 outline-none focus:outline-none" aria-label={t.prev}>
        <ArrowLeft />
      </button>
      <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-150 z-10 border-2 border-white/30 outline-none focus:outline-none" aria-label={t.next}>
        <ArrowRight />
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 outline-none focus:outline-none ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function Lightbox({ index, onClose, t }: { index: number; onClose: () => void; t: typeof translations["uz"] }) {
  const [current, setCurrent] = useState(index);
  const next = useCallback(() => setCurrent((c) => (c + 1) % screenshots.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [next, prev, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-4xl w-full mx-16" onClick={(e) => e.stopPropagation()}>
        <img src={screenshots[current].src} alt={screenshots[current].alt} className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]" draggable={false} />
        <button onClick={prev} className="absolute -left-14 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-colors duration-150 border-2 border-white/30 outline-none focus:outline-none" aria-label={t.prev}><ArrowLeft /></button>
        <button onClick={next} className="absolute -right-14 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-colors duration-150 border-2 border-white/30 outline-none focus:outline-none" aria-label={t.next}><ArrowRight /></button>
        <button onClick={onClose} className="absolute top-3 right-3 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors duration-150 shadow-lg border-2 border-white/30 outline-none focus:outline-none" aria-label={t.close}>✕</button>
        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 outline-none focus:outline-none ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <p className="text-center text-white/60 text-sm mt-2">{current + 1} / {screenshots.length}</p>
      </div>
    </div>
  );
}

const langLabels: Record<Lang, string> = { uz: "O'ZB", en: "ENG", ru: "РУС" };

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>("uz");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {screenshots.map((s) => (
        <link key={s.src} rel="preload" as="image" href={s.src} />
      ))}
      <div className="min-h-screen bg-[#1A237E] text-white flex flex-col">

        {/* Header: logo + language switcher */}
        <div className="flex justify-between items-center px-4 pt-3 gap-1">

          {/* Name */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-white font-bold text-base leading-tight">Azamat Dictionary</span>
          </div>

          {/* Language buttons (right side) */}
          <div className="flex items-center gap-1">

          {/* Desktop: show all 3 buttons */}
          <div className="hidden sm:flex gap-1">
            {(["uz", "en", "ru"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-150 outline-none focus:outline-none border ${
                  lang === l
                    ? "bg-white text-[#1A237E] border-white"
                    : "bg-transparent text-white/70 border-white/30 hover:text-white hover:border-white/60"
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>

          {/* Mobile: dropdown */}
          <div className="relative sm:hidden" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-[#1A237E] border border-white outline-none focus:outline-none flex items-center gap-1"
            >
              {langLabels[lang]}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#1A237E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 flex flex-col gap-1 bg-[#1A237E] border border-white/30 rounded-xl p-1.5 z-50 shadow-lg">
                {(["uz", "en", "ru"] as Lang[]).filter((l) => l !== lang).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setDropdownOpen(false); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150 outline-none focus:outline-none text-left"
                  >
                    {langLabels[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>

        <main className="flex flex-col items-center px-4 pt-4 pb-8 md:pt-6 md:pb-14 flex-1">
          <section className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-6">
              {t.heading}
            </h1>
            <p className="text-base md:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Butunlayiga offline, komputeringizda ishlaydigan{" "}
              <span className="font-bold text-white">Azamat Dictionary</span>{" "}
              {lang === "uz" && (
                <>
                  dasturini{" "}
                  <a
                    href="https://github.com/Azamat-Raximov/azamat-dictionary-exe/releases/download/v1.0.0/Azamat.Dictionary.Setup.1.0.0.exe"
                    download
                    className="font-bold text-white underline underline-offset-2 hover:text-blue-200 transition-colors"
                  >yuklab oling</a>.
                </>
              )}
              {lang === "en" && (
                <>
                  —{" "}
                  <a
                    href="https://github.com/Azamat-Raximov/azamat-dictionary-exe/releases/download/v1.0.0/Azamat.Dictionary.Setup.1.0.0.exe"
                    download
                    className="font-bold text-white underline underline-offset-2 hover:text-blue-200 transition-colors"
                  >download it now</a>.
                </>
              )}
              {lang === "ru" && (
                <>
                  —{" "}
                  <a
                    href="https://github.com/Azamat-Raximov/azamat-dictionary-exe/releases/download/v1.0.0/Azamat.Dictionary.Setup.1.0.0.exe"
                    download
                    className="font-bold text-white underline underline-offset-2 hover:text-blue-200 transition-colors"
                  >скачайте прямо сейчас</a>.
                </>
              )}
            </p>
          </section>

          <section className="w-full max-w-2xl mb-10">
            <Carousel onOpen={(i) => setLightboxIndex(i)} t={t} />
          </section>

          <section className="w-full max-w-2xl mx-auto mb-10 mt-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 tracking-wide">
              {t.featuresTitle}
            </h2>
            <ul className="space-y-3 text-base md:text-lg text-blue-100">
              {t.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-white"></span>
                  <span className="inline leading-relaxed">{renderFeature(feature)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <a
              href="https://github.com/Azamat-Raximov/azamat-dictionary-exe/releases/download/v1.0.0/Azamat.Dictionary.Setup.1.0.0.exe"
              download
              className="inline-flex items-center gap-3 bg-white text-[#1A237E] font-extrabold text-lg md:text-xl uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:bg-blue-100 transition-colors duration-200 active:scale-95 transform outline-none focus:outline-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <rect x="1" y="1" width="10.5" height="10.5" fill="#1A237E"/>
                <rect x="12.5" y="1" width="10.5" height="10.5" fill="#1A237E"/>
                <rect x="1" y="12.5" width="10.5" height="10.5" fill="#1A237E"/>
                <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#1A237E"/>
              </svg>
              {t.downloadBtn}
            </a>
          </section>
        </main>

        <footer className="text-center text-blue-300 text-sm py-6 border-t border-white/10">
          <span className="text-white font-semibold">Azamat Dictionary</span>
          {" · "}{t.telegramLabel}{" "}
          <a
            href="https://t.me/azamat_442"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-200 underline underline-offset-2 transition-colors outline-none focus:outline-none"
          >
            t.me/azamat_442
          </a>
        </footer>

        {lightboxIndex !== null && (
          <Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} t={t} />
        )}
      </div>
    </>
  );
}
