import React, { useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, Instagram, Mail, MapPin, Menu, Play, Search, X } from "lucide-react";

const coverImages = {
  hero: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/074ebed08abfa.jpg",
  blue: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/b633abda1b479.jpg",
  natural: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/65580d793ee63.jpg",
  youth: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/898c61cc19586.jpg",
  red: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/fb418a995e950.jpg",
  spotlight: "https://cdn.imweb.me/upload/S202404089e34c66a1a843/945f71b70f5ba.jpg",
  mood: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  studio: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80",
} as const;

type Cover = {
  id: string;
  type: "Cover" | "Shortform" | "Interview" | "Fashion" | "Beauty" | "Lifestyle";
  title: string;
  subtitle: string;
  label: string;
  sponsor: string;
  date: string;
  image: string;
  accent: string;
  summary: string;
};

const covers: Cover[] = [
  {
    id: "round-01",
    type: "Cover",
    title: "DIGITAL COVER · MAY",
    subtitle: "calm silhouette, clean product focus, post-feed editorial tone",
    label: "ROUNDMAG ORIGINAL",
    sponsor: "with FITFLOP",
    date: "MAY 2026",
    image: coverImages.hero,
    accent: "#ffffff",
    summary: "제품 협찬형 디지털 커버에 맞춘 정제된 타이포그래피, 여백 중심의 인물 배치, 모바일 리포스트에 최적화된 카드 비율을 기준으로 설계했습니다.",
  },
  {
    id: "round-02",
    type: "Cover",
    title: "FIRST ISSUE · APRIL",
    subtitle: "silk purple mood, close-up crop, glossy celebrity treatment",
    label: "ROUNDMAG COVER",
    sponsor: "First Issue",
    date: "APRIL 2026",
    image: coverImages.blue,
    accent: "#d9bbff",
    summary: "강한 컬러 무드와 초상 클로즈업을 메인 비주얼로 삼아 인스타그램 저장·공유에 강한 디지털 커버 문법을 적용했습니다.",
  },
  {
    id: "round-03",
    type: "Cover",
    title: "COVERNAT YOUTH EDITORIAL",
    subtitle: "clear sky tone, pale denim palette, clean brand exposure",
    label: "HIGH CUT BENCHMARK",
    sponsor: "with COVERNAT",
    date: "SPRING 2026",
    image: coverImages.youth,
    accent: "#cfefff",
    summary: "브랜드 로고와 인물 이미지를 동시에 살리는 하이컷식 디지털 커버 구성을 벤치마킹했습니다.",
  },
  {
    id: "round-04",
    type: "Fashion",
    title: "LUCKY CHOUETTE HIGH CUT",
    subtitle: "red headline, beauty crop, sharp social-card composition",
    label: "FASHION COVER",
    sponsor: "with LUCKY CHOUETTE",
    date: "OCTOBER 2026",
    image: coverImages.red,
    accent: "#f05a4e",
    summary: "텍스트가 이미지 위에 강하게 올라가는 커버형 디자인을 참고해 패션 협찬 기사 카드의 주목도를 높였습니다.",
  },
  {
    id: "round-05",
    type: "Cover",
    title: "ROUNDMAG FIRST ISSUE CLOSE-UP",
    subtitle: "jewelry detail, high contrast crop, scroll-stopping frame",
    label: "DIGITAL COVER",
    sponsor: "First Issue",
    date: "APRIL 2026",
    image: coverImages.natural,
    accent: "#f2f5ff",
    summary: "디테일 클로즈업 컷은 모바일 첫 화면에서 강하게 반응합니다. 커버·릴스·썸네일로 동시에 확장 가능한 구조입니다.",
  },
  {
    id: "round-06",
    type: "Interview",
    title: "VOGUE-LIKE RED PORTRAIT",
    subtitle: "single color background, oversized masthead, minimal caption",
    label: "REFERENCE STUDY",
    sponsor: "Editorial Reference",
    date: "JULY 2026",
    image: coverImages.spotlight,
    accent: "#063cff",
    summary: "보그·데이즈드 계열의 대형 마스트헤드, 단색 배경, 간결한 인물 중심 배치를 사이트 커버 그리드에 반영했습니다.",
  },
  {
    id: "round-07",
    type: "Fashion",
    title: "DAZED GROUP COVER STUDY",
    subtitle: "soft indoor light, group layout, clean white logo treatment",
    label: "REFERENCE STUDY",
    sponsor: "K-Pop Editorial",
    date: "JUNE 2026",
    image: coverImages.studio,
    accent: "#ffffff",
    summary: "그룹 화보는 인물 간격과 로고 안전 영역이 핵심입니다. 카드형 상세 페이지에서 썸네일 손실이 없도록 구성했습니다.",
  },
  {
    id: "round-08",
    type: "Lifestyle",
    title: "AQUA FILM STRIP",
    subtitle: "hazy light, cinematic sequence, campaign mood board",
    label: "MOOD BOARD",
    sponsor: "Film Sequence",
    date: "CAMPAIGN",
    image: coverImages.mood,
    accent: "#01d1d1",
    summary: "홈페이지 하단 하이라이트 영역에는 커버 한 장이 아니라 무드보드형 시퀀스도 노출할 수 있게 설계했습니다.",
  },
];

const latest = [
  {
    type: "Fashion",
    title: "요즘 커버 디자인의 핵심: 인물보다 먼저 보이는 마스트헤드",
    text: "대형 로고, 제한된 컬러 팔레트, 모바일 피드에서 읽히는 1초 타이포그래피.",
    image: coverImages.red,
  },
  {
    type: "Beauty",
    title: "화보 컷 셀렉 이후 3일 안에 커버 시안을 끝내는 워크플로우",
    text: "브랜드 레퍼런스, 셀럽 톤앤무드, 폰트 후보군, 색상 변주를 한 번에 묶는 제작 방식.",
    image: coverImages.blue,
  },
  {
    type: "Lifestyle",
    title: "인스타그램 저장을 부르는 디지털 매거진 카드 구조",
    text: "커버, 쇼츠, 기사 상세, 리포스트용 카드까지 하나의 비주얼 시스템으로 연결합니다.",
    image: coverImages.natural,
  },
];

const menu = ["Original", "Fashion", "Beauty", "Lifestyle", "About", "Contact"];

export default function App() {
  const [activeType, setActiveType] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Cover | null>(null);

  const filteredCovers = useMemo(() => {
    return covers.filter((item) => {
      const typeMatch = activeType === "All" || item.type === activeType;
      const queryMatch = `${item.title} ${item.subtitle} ${item.label} ${item.sponsor}`.toLowerCase().includes(query.toLowerCase());
      return typeMatch && queryMatch;
    });
  }, [activeType, query]);

  const scrollToId = (id: string) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="메뉴 열기"><Menu size={22} /></button>
        <button className="brand" onClick={() => scrollToId("top")} aria-label="ROUNDMAG 홈"><span>ROUNDMAG</span></button>
        <nav className="desktop-nav" aria-label="주 메뉴">
          {menu.map((item) => <button key={item} onClick={() => scrollToId(item.toLowerCase())}>{item}</button>)}
        </nav>
        <div className="header-actions">
          <div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search cover" aria-label="커버 검색" /></div>
          <a className="icon-button" href="https://www.instagram.com/_roundmag/" target="_blank" rel="noreferrer" aria-label="인스타그램"><Instagram size={19} /></a>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-panel" role="dialog" aria-modal="true">
          <div className="mobile-panel-head"><span>ROUNDMAG</span><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기"><X size={22} /></button></div>
          {menu.map((item) => <button key={item} onClick={() => scrollToId(item.toLowerCase())}>{item}<ChevronRight size={18} /></button>)}
        </div>
      )}

      <main id="top">
        <section className="hero-section" id="original">
          <div className="hero-copy">
            <p className="eyebrow">FRIDAY COMPANY PRESENTS</p>
            <h1>ROUNDMAG</h1>
            <p className="hero-sub">디지털 커버, 셀럽 화보, 브랜드 협찬 콘텐츠를 한 화면에서 강하게 보여주는 온라인 매거진 홈페이지.</p>
            <div className="hero-meta"><span>Cover</span><span>Interview</span><span>Shortform</span><span>Fashion</span><span>Beauty</span><span>Lifestyle</span></div>
            <div className="hero-actions"><button onClick={() => scrollToId("cover-grid")}>커버 보기</button><button className="ghost" onClick={() => scrollToId("contact")}>제작 문의</button></div>
          </div>
          <div className="hero-visual" onClick={() => setSelected(covers[0])} role="button" tabIndex={0}>
            <img src={covers[0].image} alt="ROUNDMAG digital cover" />
            <div className="masthead">ROUND</div>
            <div className="hero-card-caption"><span>{covers[0].label}</span><strong>{covers[0].title}</strong><small>{covers[0].sponsor}</small></div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true"><span>ROUNDMAG DIGITAL COVER</span><span>FASHION EDITORIAL</span><span>BRAND COLLABORATION</span><span>SHORTFORM MAGAZINE</span><span>ROUNDMAG DIGITAL COVER</span></div>

        <section className="section" id="cover-grid">
          <div className="section-title"><p>Original / Cover</p><h2>최신 디지털 커버</h2><span>하이컷식 카테고리 구조를 기준으로, 라운드매거진의 커버와 쇼츠형 비주얼을 전면에 배치했습니다.</span></div>
          <div className="filter-row">{["All", "Cover", "Fashion", "Beauty", "Lifestyle", "Interview"].map((item) => <button key={item} className={activeType === item ? "active" : ""} onClick={() => setActiveType(item)}>{item}</button>)}</div>
          <div className="cover-grid">
            {filteredCovers.map((item, index) => (
              <article className={`cover-card ${index === 0 ? "featured" : ""}`} key={item.id} onClick={() => setSelected(item)}>
                <div className="cover-image-wrap" style={{ "--accent": item.accent } as React.CSSProperties}><img src={item.image} alt={item.title} /><span>{item.type}</span></div>
                <div className="cover-card-body"><p>{item.label}</p><h3>{item.title}</h3><span>{item.subtitle}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" id="fashion">
          <div className="section-title sticky-title"><p>Fashion / Beauty / Lifestyle</p><h2>인스타그램 피드와 홈페이지를 동시에 살리는 구조</h2><span>커버 한 장만 올리는 사이트가 아니라, 리포스트·기사 상세·브랜드 협찬 페이지까지 확장되는 매거진형 구조입니다.</span></div>
          <div className="latest-stack">
            {latest.map((item) => (
              <article key={item.title} className="latest-card"><img src={item.image} alt={item.title} /><div><p>{item.type}</p><h3>{item.title}</h3><span>{item.text}</span><button>Read more <ArrowUpRight size={16} /></button></div></article>
            ))}
          </div>
        </section>

        <section className="highlight-section" id="beauty">
          <div className="highlight-copy"><p>Highlight</p><h2>커버 · 영상 · 쇼츠를 한 번에 보여주는 하이라이트 영역</h2><span>하이컷처럼 메인 기사와 영상 하이라이트를 분리해 노출하면, 협찬 콘텐츠의 체류시간과 클릭 동선을 동시에 확보할 수 있습니다.</span></div>
          <div className="video-grid">
            {covers.slice(1, 5).map((item) => <button key={item.id} className="video-card" onClick={() => setSelected(item)}><img src={item.image} alt={item.title} /><span><Play size={18} fill="currentColor" /></span><strong>{item.title}</strong></button>)}
          </div>
        </section>

        <section className="about-section" id="lifestyle">
          <div className="about-image"><img src={coverImages.mood} alt="ROUNDMAG mood sequence" /></div>
          <div className="about-copy" id="about"><p>About ROUNDMAG</p><h2>커머셜 화보를 디지털 매거진 문법으로 재편집하는 브랜드 미디어</h2><span>라운드매거진은 프라이데이컴퍼니가 운영하는 디지털 매거진입니다. 셀럽 화보, 브랜드 협찬, 커버 디자인, 쇼츠형 콘텐츠를 웹사이트와 인스타그램 피드에 맞게 재구성합니다.</span><dl><div><dt>Company</dt><dd>(주)프라이데이컴퍼니</dd></div><div><dt>CEO</dt><dd>박준희</dd></div><div><dt>Studio</dt><dd>서울 성동구 성수이로 66 서울숲 드림타워 408호</dd></div></dl></div>
        </section>

        <section className="contact-section" id="contact">
          <div><p>Contact</p><h2>커버 제작, 브랜드 협찬, 디지털 매거진 구축 문의</h2><span>현재 구조는 홈페이지 첫 버전입니다. 이후 관리자 업로드, 기사 상세 템플릿, 협찬사별 랜딩, SEO 메타데이터까지 확장할 수 있습니다.</span></div>
          <div className="contact-cards"><a href="mailto:contact@roundmag.kr"><Mail size={20} /> contact@roundmag.kr</a><a href="https://www.instagram.com/_roundmag/" target="_blank" rel="noreferrer"><Instagram size={20} /> @_roundmag</a><span><MapPin size={20} /> 성수동, Seoul</span></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand">ROUNDMAG</div><p>© 2026 FRIDAY COMPANY. DIGITAL COVER MAGAZINE.</p></footer>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <article className="detail-modal" onClick={(e) => e.stopPropagation()}><button className="icon-button close-modal" onClick={() => setSelected(null)} aria-label="닫기"><X size={22} /></button><img src={selected.image} alt={selected.title} /><div><p>{selected.label}</p><h2>{selected.title}</h2><strong>{selected.sponsor}</strong><span>{selected.summary}</span><button onClick={() => setSelected(null)}>닫기</button></div></article>
        </div>
      )}
    </div>
  );
}
