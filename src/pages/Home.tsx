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

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 4L7 10L13 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4L13 10L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Carousel({ onOpen }: { onOpen: (index: number) => void }) {
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const goNext = () => {
    setCurrent((c) => (c + 1) % screenshots.length);
    startInterval();
  };

  const goPrev = () => {
    setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length);
    startInterval();
  };

  const goTo = (i: number) => {
    setCurrent(i);
    startInterval();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      <div
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-pointer group relative"
        onClick={() => onOpen(current)}
      >
        <img
          src={screenshots[current].src}
          alt={screenshots[current].alt}
          className="w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1A237E] text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg">
            Kattalashtirish uchun bosing
          </span>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-150 z-10 border-2 border-white/30 outline-none focus:outline-none"
        aria-label="Oldingi"
      >
        <ArrowLeft />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors duration-150 z-10 border-2 border-white/30 outline-none focus:outline-none"
        aria-label="Keyingi"
      >
        <ArrowRight />
      </button>

      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 outline-none focus:outline-none ${
              i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slayd ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Lightbox({ index, onClose }: { index: number; onClose: () => void }) {
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
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={screenshots[current].src}
          alt={screenshots[current].alt}
          className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]"
          draggable={false}
        />

        <button
          onClick={prev}
          className="absolute -left-14 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-colors duration-150 border-2 border-white/30 outline-none focus:outline-none"
          aria-label="Oldingi"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={next}
          className="absolute -right-14 top-1/2 -translate-y-1/2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-colors duration-150 border-2 border-white/30 outline-none focus:outline-none"
          aria-label="Keyingi"
        >
          <ArrowRight />
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#1A237E] hover:bg-[#283593] text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold transition-colors duration-150 shadow-lg border-2 border-white/30 outline-none focus:outline-none"
          aria-label="Yopish"
        >
          ✕
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 outline-none focus:outline-none ${
                i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Slayd ${i + 1}`}
            />
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-2">
          {current + 1} / {screenshots.length}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {screenshots.map((s) => (
        <link key={s.src} rel="preload" as="image" href={s.src} />
      ))}
    <div className="min-h-screen bg-[#1A237E] text-white flex flex-col">
      <main className="flex flex-col items-center px-4 py-12 md:py-20 flex-1">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-6">
            TIL O'RGANAMAN DEB CHALG'IB KETAYABSIZMI?
          </h1>
          <p className="text-base md:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Butunlayiga offline, komputeringizda ishlaydigan{" "}
            <span className="font-bold text-white">Azamat Dictionary</span>{" "}
            dasturini yuklab oling.
          </p>
        </section>

        <section className="w-full max-w-2xl mb-10">
          <Carousel onOpen={(i) => setLightboxIndex(i)} />
        </section>

        <section className="w-full max-w-2xl mx-auto mb-12 mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 tracking-wide">
            Dastur imkoniyatlari
          </h2>
          <ul className="space-y-3 text-base md:text-lg text-blue-100">
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              Har qanday inglizcha so'zning <span className="text-white font-semibold mx-1">ma'nosini</span> toping
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              So'zning <span className="text-white font-semibold mx-1">talaffuzini</span> eshiting va o'rganing
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              So'z <span className="text-white font-semibold mx-1">gaplarda qanday ishlatilishini</span> ko'ring
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              <span className="text-white font-semibold mr-1">Sinonim va antonimlarini</span> bir joyda toping
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              Topgan so'zlaringizni <span className="text-white font-semibold mx-1">saqlab</span> qo'ying
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              Qidirgan so'zlaringizning <span className="text-white font-semibold mx-1">tarixini</span> ko'ring
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white"></span>
              So'zlarni <span className="text-white font-semibold mx-1">mavzularga bo'lingan</span> holda topib, yodlashni osonlashtiring
            </li>
          </ul>
        </section>

        <section className="mb-16">
          <a
            href="https://github.com/Azamat-Raximov/azamat-dictionary-exe/releases/download/v1.0.0/Azamat.Dictionary.Setup.1.0.0.exe"
            download
            className="inline-block bg-white text-[#1A237E] font-extrabold text-lg md:text-xl uppercase tracking-widest px-10 py-4 rounded-full shadow-lg hover:bg-blue-100 transition-colors duration-200 active:scale-95 transform outline-none focus:outline-none"
          >
            DASTURNI YUKLASH
          </a>
        </section>
      </main>

      <footer className="text-center text-blue-300 text-sm py-6 border-t border-white/10">
        <span className="text-white font-semibold">Azamat Dictionary</span>
        {" · "}Telegram:{" "}
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
        <Lightbox index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
    </>
  );
}
