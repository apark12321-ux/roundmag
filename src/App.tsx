import { Menu, Search } from "lucide-react";
import "./fashion-launch.css";

const assets = {
  hero: "/fashion/hero.webp",
  cover01: "/fashion/cover-01.webp",
  beauty: "/fashion/beauty-closeup.webp",
  duo: "/fashion/duo-cover.webp",
  cover02: "/fashion/cover-02.webp",
  cover03: "/fashion/cover-03.webp",
};

const stories = [
  {
    label: "COVER STORY",
    title: "THE FIRST ISSUE",
    desc: "ROUNDMAG launches with clean silhouettes, architectural light, and a new digital fashion language.",
    image: assets.cover01,
  },
  {
    label: "BEAUTY",
    title: "SHARP FOCUS",
    desc: "A close-up beauty editorial built around texture, gaze, jewelry, and precise light.",
    image: assets.beauty,
  },
  {
    label: "EDITORIAL",
    title: "DUO FORM",
    desc: "Tailoring, contrast, and the quiet confidence of a new generation.",
    image: assets.duo,
  },
  {
    label: "FASHION",
    title: "WHITE STRUCTURE",
    desc: "Minimal color, strong structure, and a premium magazine-ready visual system.",
    image: assets.cover02,
  },
  {
    label: "STYLE",
    title: "DRAPED MOOD",
    desc: "Soft fabric, sculptural posture, and warm shadows for a refined launch mood.",
    image: assets.cover03,
  },
];

const nav = ["Cover", "Fashion", "Beauty", "Editorial", "Archive", "Contact"];

function Header() {
  return (
    <header className="rf-header">
      <div className="rf-navline">
        <a href="#top" className="rf-wordmark">ROUNDMAG</a>
        <nav>
          {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
        <div className="rf-icons">
          <span>IG</span>
          <span>YT</span>
          <Search size={16} strokeWidth={1.7} />
          <Menu size={20} strokeWidth={1.7} />
        </div>
      </div>
      <div className="rf-masthead">ROUNDMAG</div>
    </header>
  );
}

function Hero() {
  return (
    <section className="rf-hero" id="cover">
      <div className="rf-hero-image">
        <picture>
          <source srcSet={assets.hero} type="image/webp" />
          <img src="/fashion/hero.jpg" alt="ROUNDMAG launch hero" fetchPriority="high" />
        </picture>
      </div>
      <div className="rf-hero-copy">
        <p className="rf-kicker">DIGITAL FASHION MAGAZINE · LAUNCH ISSUE</p>
        <h1>NEW<br />VISUAL<br />LANGUAGE</h1>
        <p>
          라운드매거진을 완전히 새롭게 런칭하는 패션 매거진 톤으로 재구성했습니다.
          흐린 기존 이미지는 제거하고, AI로 새로 만든 고해상도 패션 에디토리얼 이미지만 사용합니다.
        </p>
      </div>
    </section>
  );
}

function CoverStories() {
  return (
    <section className="rf-section" id="fashion">
      <div className="rf-section-head">
        <span>01</span>
        <h2>Cover Stories</h2>
        <p>보그·데이즈드·바자 계열의 대형 타이포, 인물 중심 화보, 넓은 여백, 강한 에디토리얼 구성을 라운드매거진용으로 재해석했습니다.</p>
      </div>
      <div className="rf-cover-grid">
        {stories.map((story, index) => (
          <article className={`rf-card rf-card-${index + 1}`} key={story.title}>
            <figure>
              <img src={story.image} alt={story.title} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
            </figure>
            <div>
              <span>{story.label}</span>
              <h3>{story.title}</h3>
              <p>{story.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeautyFeature() {
  return (
    <section className="rf-beauty" id="beauty">
      <div>
        <span>02 · BEAUTY FOCUS</span>
        <h2>Faces,<br />fabric,<br />focus.</h2>
        <p>
          웹에서 흐려 보이지 않도록 업스케일된 WebP/JPG 이미지를 사용하고,
          이미지는 카드 안에서 `cover` 처리하여 패션 매거진식 크롭으로 선명하게 보이게 했습니다.
        </p>
      </div>
      <figure>
        <img src={assets.beauty} alt="Beauty editorial closeup" loading="lazy" decoding="async" />
      </figure>
    </section>
  );
}

function Archive() {
  return (
    <section className="rf-archive" id="editorial">
      <div className="rf-section-head">
        <span>03</span>
        <h2>Editorial Index</h2>
        <p>런칭 후 Cover, Fashion, Beauty, Culture, Campaign 콘텐츠를 이 구조로 확장할 수 있습니다.</p>
      </div>
      <div className="rf-index">
        {stories.map((story, index) => (
          <a href="#cover" key={story.title}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span>{story.label}</span>
            <h3>{story.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rf-footer" id="contact">
      <div className="rf-footer-logo">ROUNDMAG</div>
      <div className="rf-footer-info">
        <p>About<br />Contact<br />Media Kit<br />Instagram</p>
        <p>(주)프라이데이컴퍼니<br />서울 성동구 성수이로 66 서울숲 드림타워 408호<br />E. info@roundmag.kr</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="rf-site" id="top">
      <Header />
      <main>
        <Hero />
        <CoverStories />
        <BeautyFeature />
        <Archive />
      </main>
      <Footer />
    </div>
  );
}
