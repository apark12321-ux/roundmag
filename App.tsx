import { Search } from "lucide-react";
import { roundImages, roundLogo } from "./roundAssets";
import "./launch.css";

type LaunchImage = {
  src: string;
  title: string;
  label: string;
};

const imagePool = Object.values(roundImages).filter(Boolean) as string[];

const items: LaunchImage[] = [
  "FIRST ISSUE",
  "PURPLE ROOM",
  "NEW STEP",
  "BLUE SEASON",
  "RED GAZE",
  "GREEN RUNWAY",
  "ATE!",
  "MUSE FILE",
  "SUMMER BLUE",
  "GROUP CUT",
  "BLUE FIRE",
].map((title, index) => ({
  title,
  src: imagePool[index % imagePool.length],
  label: ["COVER", "FASHION", "BEAUTY", "CULTURE"][index % 4],
}));

const nav = ["Cover", "Fashion", "Beauty", "Culture", "Archive", "Contact"];

function EditorialImage({ item, className = "" }: { item: LaunchImage; className?: string }) {
  return (
    <figure className={`editorial-image ${className}`}>
      <img src={item.src} alt={`ROUNDMAG ${item.title}`} loading="lazy" decoding="async" />
    </figure>
  );
}

function Header() {
  return (
    <header className="launch-header" id="top">
      <div className="header-line">
        <a className="brand-mark" href="#top"><img src={roundLogo} alt="ROUNDMAG" /></a>
        <nav className="header-nav" aria-label="main navigation">
          {nav.map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <span>IG</span>
          <span>YT</span>
          <Search size={16} strokeWidth={1.7} />
        </div>
      </div>
      <div className="masthead">ROUNDMAG</div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-launch" id="cover">
      <div className="hero-copy">
        <p className="issue-label">ISSUE 001 · DIGITAL FASHION LAUNCH</p>
        <h1>NEW FASHION<br />MAGAZINE<br />FOR NOW</h1>
        <p className="hero-description">
          글로벌 패션 매거진의 대형 마스트헤드, 강한 타이포그래피, 정제된 커버 그리드,
          인물 중심 감각을 라운드매거진 톤으로 재구성했습니다.
        </p>
      </div>
      <div className="hero-cover-block">
        <EditorialImage item={items[0]} className="hero-img" />
        <div className="cover-caption">
          <span>{items[0].label}</span>
          <strong>{items[0].title}</strong>
        </div>
      </div>
    </section>
  );
}

function CoverWall() {
  return (
    <section className="cover-wall section-space" id="fashion">
      <div className="section-head">
        <span>01</span>
        <h2>Cover Wall</h2>
        <p>제공된 이미지를 커버 아카이브처럼 배치했습니다. 이미지는 눌림 없이 비율을 유지하고 큰 화면에서 선명하게 보이도록 렌더링합니다.</p>
      </div>
      <div className="cover-grid">
        {items.slice(1, 7).map((item, index) => (
          <article className={`cover-card card-${index + 1}`} key={item.title}>
            <EditorialImage item={item} />
            <div className="cover-meta">
              <span>{item.label}</span>
              <h3>{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeautyFeature() {
  return (
    <section className="beauty-feature section-space" id="beauty">
      <div className="beauty-copy">
        <span>02 · BEAUTY NOTE</span>
        <h2>Clean image,<br />bold typography.</h2>
        <p>필터와 과한 오버레이를 제거하고, 데스크톱에서는 넓은 커버 화면, 모바일에서는 원본 비율이 무너지지 않는 구조로 잡았습니다.</p>
      </div>
      <div className="beauty-images">
        <EditorialImage item={items[7]} />
        <EditorialImage item={items[8]} />
      </div>
    </section>
  );
}

function Archive() {
  return (
    <section className="archive section-space" id="culture">
      <div className="section-head archive-head">
        <span>03</span>
        <h2>Editorial Archive</h2>
      </div>
      <div className="archive-list">
        {items.slice(2).map((item, index) => (
          <article className="archive-row" key={item.title}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <h3>{item.title}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="statement" id="archive">
      <div>
        <span>LAUNCH STATEMENT</span>
        <h2>ROUNDMAG is a digital fashion magazine built for covers, campaigns, and culture.</h2>
      </div>
      <p>화보, 브랜드 협업, 디지털 커버, 숏폼 썸네일을 하나의 웹 매거진으로 전개합니다. 현재 이미지는 모두 제공된 이미지 소스만 사용했습니다.</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="launch-footer" id="contact">
      <div className="footer-mast">ROUNDMAG</div>
      <div className="footer-grid">
        <p>About<br />Contact<br />Media Kit</p>
        <p>(주)프라이데이컴퍼니<br />서울 성동구 성수이로 66 서울숲 드림타워 408호<br />E. info@roundmag.kr</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="launch-site">
      <Header />
      <main>
        <Hero />
        <CoverWall />
        <BeautyFeature />
        <Archive />
        <Statement />
      </main>
      <Footer />
    </div>
  );
}
