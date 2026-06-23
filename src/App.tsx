import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { roundImages, roundLogo } from "./roundAssets";
import "./round2.css";

type View = "home" | "original" | "fashion" | "beauty" | "lifestyle" | "about" | "contact";

const baseImages = [
  roundImages.film_strip,
  roundImages.round_jungwon,
  roundImages.round_bambam_purple,
  roundImages.round_bambam_close,
  roundImages.highcut_sunghanbin,
  roundImages.highcut_nana,
  roundImages.vogue_mona,
  roundImages.vogue_ate,
  roundImages.vogue_ida,
  roundImages.dazed_johnny,
  roundImages.dazed_enhypen,
];

const hero = {
  title: "ROUNDMAG, Beyond the Hue",
  subtitle: "하나의 컬러로 규정할 수 없는, 라운드매거진이 포착한 지금의 결",
  image: roundImages.film_strip,
};

const highlight = [
  "성한빈 X COVERNAT",
  "다시 봄, 다시 라운드",
  "선명한 표정과 가까워진 계절",
  "나나보다, 나나가",
  "정은주, Born to Be Spotlight",
  "솔직하고 가장 가까운 순간",
  "담백한 빛, 선명한 인터뷰",
  "Pose That SYSTEM",
  "This Is My Era, Not Croissant",
  "HUF 서울: REDDISH 시선",
  "ROUNDMAG IN YOUR AREA",
  "도시의 오후를 걷다",
  "#H BEAUTY! 가장 가까운 메이크업",
  "컬러가 선명해지는 순간",
  "브랜드 스토리 안쪽",
  "MZ들이 한눈에 보는 감각",
  "스튜디오에서 오래, 선명",
  "테마가 만든 레이어",
  "FASHION 컷은 계속된다",
  "새 시즌의 얼굴",
  "겨울의 따뜻한 시선",
  "FASHION 오늘의 기록",
].map((title, index) => ({ title, image: baseImages[(index + 1) % baseImages.length] }));

const originalItems = [
  "Interview 무엇을 읽는가보다 어떤 방향을 선택하는가",
  "Interview 느림은 이해가 아니라 감각으로 시작된다",
  "Interview 취향과 첫 터닝포인트",
  "Cover 프레임 위에서 시작된 라운드의 첫 터치",
  "Cover ROUNDMAG, Beyond the Hue B컷",
  "Cover ROUNDMAG, Beyond the Hue",
  "Cover SEOUL with ACCRUE EYEWEAR",
  "Cover Soft Construct",
  "Cover Knit",
  "Cover NO RULE, JUST RHYTHM",
  "Cover 첫 스물의 여름!",
  "Cover The Crossover",
  "Cover Love My Persona",
  "Cover 성한빈 X COVERNAT",
  "Cover DANIEL HENNEY X NATURALIZE",
  "Interview 완벽한 일상을 만드는 순간",
  "Cover 나만의 오후",
  "Cover Born to Be Spotlight",
  "Interview 지금의 시선",
  "Cover HOSHI, Hush",
  "Cover Don’t Forget Me",
  "Cover 이동욱 순수한 LANGUAGE",
  "Interview 빛을 따라가는 감독 인터뷰",
].map((title, index) => ({ title, image: baseImages[index % baseImages.length] }));

const latest = [
  "Interview 무해한 얼굴과 선명한 시선",
  "Interview 노래는 이해가 아니라 감각으로 시작된다",
  "Interview 취향과 첫 터닝포인트",
  "Cover 프레임 위에서 시작된 새로운 시즌",
  "Beauty 클린한 피부와 선명한 컬러",
  "Fashion 컬렉션의 구조와 리듬",
  "Fashion 속삭이듯 선명한 무드",
  "News 프라이데이컴퍼니의 새로운 프로젝트",
].map((title, index) => ({ title, image: baseImages[(index + 3) % baseImages.length] }));

function Header({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  const nav: { label: string; view: View }[] = [
    { label: "Original", view: "original" },
    { label: "Fashion", view: "fashion" },
    { label: "Beauty", view: "beauty" },
    { label: "Lifestyle", view: "lifestyle" },
    { label: "About", view: "about" },
    { label: "Contact", view: "contact" },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="menu-button" type="button" aria-label="menu" onClick={() => onNavigate("home")}>
          <Menu size={22} strokeWidth={1.7} />
        </button>
        <button className="brand" type="button" onClick={() => onNavigate("home")} aria-label="Roundmag home">
          <img src={roundLogo} alt="ROUNDMAG" />
        </button>
        <nav className="main-nav" aria-label="main navigation">
          {nav.map((item) => (
            <button
              key={item.label}
              type="button"
              className={view === item.view ? "is-active" : ""}
              onClick={() => onNavigate(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="social-nav" aria-label="social links">
          <a href="https://www.instagram.com/_roundmag/" aria-label="instagram">◎</a>
          <span>▶</span>
          <span>♪</span>
          <span>×</span>
          <Search size={15} strokeWidth={1.8} />
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-shell">
        <article className="main-cover">
          <figure>
            <img src={hero.image} alt={hero.title} />
          </figure>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
        </article>

        <section className="home-section">
          <h2>Highlight</h2>
          <div className="highlight-grid">
            {highlight.map((item) => (
              <article className="highlight-card" key={item.title}>
                <figure><img src={item.image} alt={item.title} /></figure>
                <p>{item.title}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section latest-section">
          <h2>Lastest news</h2>
          <div className="latest-grid">
            {latest.map((item) => (
              <article className="latest-card" key={item.title}>
                <figure><img src={item.image} alt={item.title} /></figure>
                <p>{item.title}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function BoardPage({ title }: { title: string }) {
  return (
    <main className="board-page">
      <section className="board-shell">
        <div className="board-heading"><span>{title}</span></div>
        <nav className="board-tabs" aria-label="category tabs">
          <button type="button">All</button>
          <button type="button">Cover</button>
          <button type="button">Interview</button>
          <button type="button">Shortform</button>
          <button type="button">Editor&apos;s Letter</button>
        </nav>
        <div className="board-grid">
          {originalItems.map((item) => (
            <article className="board-card" key={`${title}-${item.title}`}>
              <figure><img src={item.image} alt={item.title} /></figure>
              <p>{item.title}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-intro">
        <h1>ROUND<br />MAGAZINE</h1>
        <p>라운드매거진은 트렌드를 선도하고 새로운 변화를 감각하는 이들과 함께 이야기를 만듭니다.</p>
        <p>Roundmag leads the mood with people who long for new changes and curates culture with its own sensitivity.</p>
      </section>
      <figure className="about-hero"><img src={roundImages.film_strip} alt="Roundmag visual" /></figure>
      <section className="about-body">
        <p><strong>라운드매거진은 사람에 집중합니다.</strong></p>
        <p>얼굴이 아닌 각자의 이야기와 경험, 개인의 독특한 영향력에 주목합니다. 우리는 인플루언서라는 단어의 의미를 이야기로 전개하고, 다양한 크리에이티브 커뮤니티를 형성합니다.</p>
        <p><strong>라운드매거진의 시선, 소비가 아닌 문화를 만들어갑니다.</strong></p>
        <p>패션, 뷰티, 엔터테인먼트, 예술, 라이프스타일의 모든 소재는 라운드매거진의 시선을 거쳐 일상의 영감이 됩니다.</p>
      </section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-shell">
        <div className="contact-top">
          <div>
            <h1>&lt;ROUNDMAG&gt;</h1>
            <p>(주)프라이데이컴퍼니<br />서울 성동구 성수이로 66 서울숲 드림타워 408호<br />TEL. 02-3444-0331</p>
          </div>
          <a className="media-kit" href="mailto:info@roundmag.kr">미디어킷</a>
        </div>
        <hr />
        <div className="contact-list">
          <p><strong>광고 및 취재 문의</strong><br />ad@roundmag.kr</p>
          <p><strong>보도자료 문의</strong><br />info@roundmag.kr</p>
          <p><strong>MCN 문의</strong><br />MCN@roundmag.kr</p>
        </div>
      </section>
    </main>
  );
}

function Footer({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-left">
          <button type="button" onClick={() => onNavigate("about")}>About</button>
          <button type="button" onClick={() => onNavigate("contact")}>Contact</button>
          <button type="button" onClick={() => onNavigate("contact")}>Media kit</button>
          <div className="footer-social"><span>◎</span><span>▶</span><span>♪</span><span>✱</span></div>
        </div>
        <div className="footer-right">
          <img src={roundLogo} alt="ROUNDMAG" />
          <p>www.roundmag.kr<br />© FRIDAY COMPANY. All rights reserved.<br />서울 성동구 성수이로 66 서울숲 드림타워 408호<br />E. info@roundmag.kr</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");

  const navigate = (nextView: View) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="round-site">
      <Header view={view} onNavigate={navigate} />
      {view === "home" && <HomePage />}
      {view === "original" && <BoardPage title="Original" />}
      {view === "fashion" && <BoardPage title="Fashion" />}
      {view === "beauty" && <BoardPage title="Beauty" />}
      {view === "lifestyle" && <BoardPage title="Lifestyle" />}
      {view === "about" && <AboutPage />}
      {view === "contact" && <ContactPage />}
      <Footer onNavigate={navigate} />
    </div>
  );
}
