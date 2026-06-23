import { roundImages, roundLogo } from "./roundAssets";
import "./round2.css";

const baseImages = [
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
  roundImages.film_strip,
];

const hero = {
  title: "ROUNDMAG, Beyond the Hue",
  subtitle: "지금 가장 선명한 감각을 기록하는 디지털 매거진",
  image: roundImages.round_bambam_purple,
};

const highlight = [
  "성한빈 X COVERNAT",
  "다시 봄, 다시 라운드",
  "배경과 가까워진 선명한 표정",
  "나나보다, 나나가",
  "정은주, Born to Be Spotlight",
  "솔직하고 가장 가까운 순간",
  "담백한 빛과 명료한 인터뷰",
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
].map((title, index) => ({
  title,
  image: baseImages[index % baseImages.length],
}));

const originalItems = [
  "Interview 무엇을 읽는가보다 어떤 방향을 선택하는가",
  "Interview 느림은 이해가 아니라 감각으로 시작된다",
  "Interview 취향과 첫 터닝포인트",
  "Cover 프레임 위에서 시작된 하이컷의 첫 터치",
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
  "Cover Don't Forget Me",
  "Cover 이동욱 순수한 LANGUAGE",
  "Interview 빛을 따라가는 감독 인터뷰",
].map((title, index) => ({
  type: title.split(" ")[0],
  title,
  image: baseImages[(index + 2) % baseImages.length],
}));

const latest = [
  "Interview 무해한 얼굴과 선명한 시선",
  "Interview 노래는 이해가 아니라 감각으로 시작된다",
  "Interview 취향과 첫 터닝포인트",
  "Cover 프레임 위에서 시작된 새로운 시즌",
  "Beauty 클린한 피부와 선명한 컬러",
  "Fashion 컬렉션의 구조와 리듬",
  "Fashion 속삭이듯 선명한 무드",
  "News 프라이데이컴퍼니의 새로운 프로젝트",
].map((title, index) => ({ title, image: baseImages[(index + 5) % baseImages.length] }));

function Header() {
  return (
    <header className="hc-header">
      <div className="hc-header-inner">
        <a className="hamburger" href="#top" aria-label="menu"><span></span><span></span><span></span></a>
        <a className="hc-logo" href="#top"><img src={roundLogo} alt="ROUNDMAG" /></a>
        <nav className="hc-nav" aria-label="main navigation">
          <a href="#original">Original</a>
          <a href="#fashion">Fashion</a>
          <a href="#beauty">Beauty</a>
          <a href="#lifestyle">Lifestyle</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="hc-social" aria-label="social links">
          <a href="https://www.instagram.com/_roundmag/">◎</a>
          <a href="#top">▶</a>
          <a href="#top">♪</a>
          <a href="#top">×</a>
          <a href="#top">⌕</a>
        </div>
      </div>
    </header>
  );
}

function HighlightCard({ item }: { item: (typeof highlight)[number] }) {
  return (
    <article className="highlight-card">
      <a href="#original">
        <div className="thumb portrait"><img src={item.image} alt={item.title} /></div>
        <p>{item.title}</p>
      </a>
    </article>
  );
}

function OriginalCard({ item }: { item: (typeof originalItems)[number] }) {
  return (
    <article className="original-card">
      <a href="#article">
        <div className="thumb square"><img src={item.image} alt={item.title} /></div>
        <p>{item.title}</p>
      </a>
    </article>
  );
}

function LatestCard({ item }: { item: (typeof latest)[number] }) {
  return (
    <article className="latest-card">
      <a href="#article">
        <div className="thumb news"><img src={item.image} alt={item.title} /></div>
        <p>{item.title}</p>
      </a>
    </article>
  );
}

function Footer() {
  return (
    <footer className="hc-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-left">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#contact">Media kit</a>
          <div className="footer-icons"><span>◎</span><span>▶</span><span>♪</span><span>✱</span></div>
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
  return (
    <div className="hc-site" id="top">
      <Header />

      <main>
        <section className="home-wrap">
          <article className="hero-card">
            <a href="#article">
              <div className="hero-image"><img src={hero.image} alt={hero.title} /></div>
              <h1>{hero.title}</h1>
              <p>{hero.subtitle}</p>
            </a>
          </article>

          <section className="highlight-section">
            <h2>Highlight</h2>
            <div className="highlight-grid">
              {highlight.map((item) => <HighlightCard key={item.title} item={item} />)}
            </div>
          </section>

          <section className="latest-section">
            <h2>Lastest news</h2>
            <div className="latest-grid">
              {latest.map((item) => <LatestCard key={item.title} item={item} />)}
            </div>
          </section>
        </section>

        <section className="board-page" id="original">
          <div className="board-title"><span>Original</span></div>
          <nav className="board-tabs">
            <a>All</a><a>Cover</a><a>Interview</a><a>Shortform</a><a>Editor's Letter</a>
          </nav>
          <div className="original-grid">
            {originalItems.map((item) => <OriginalCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className="about-page" id="about">
          <div className="about-copy">
            <h2>ROUND<br />MAGAZINE</h2>
            <p>라운드매거진은 새로운 감각과 변화를 기록하는 디지털 매거진입니다.</p>
            <p>Roundmag leads the visual mood with people, fashion, beauty, entertainment and culture.</p>
          </div>
          <div className="about-visual"><img src={roundImages.film_strip} alt="Roundmag visual" /></div>
          <div className="about-text">
            <p><strong>라운드매거진은 사람에 집중합니다.</strong></p>
            <p>얼굴이 아닌 각자의 이야기와 경험, 개인의 독특한 영향력에 주목합니다. 우리는 인물로부터 출발해 패션, 뷰티, 라이프스타일, 컬처를 연결합니다.</p>
            <p><strong>라운드매거진의 시선은 소비가 아닌 문화를 만듭니다.</strong></p>
            <p>다양성을 지지하며, 모든 이야기에 귀를 기울이고, 다가가고, 전달합니다.</p>
          </div>
        </section>

        <section className="contact-page">
          <div className="contact-head">
            <h2>&lt;ROUNDMAG&gt;</h2>
            <a className="media-button" href="#contact">미디어킷</a>
          </div>
          <p className="address">(주)프라이데이컴퍼니<br />서울 성동구 성수이로 66 서울숲 드림타워 408호<br />TEL. 02-3444-0331</p>
          <div className="contact-line"></div>
          <div className="contact-grid">
            <div><strong>광고 및 취재 문의</strong><br />ad@roundmag.kr</div>
            <div><strong>보도자료 문의</strong><br />info@roundmag.kr</div>
            <div><strong>MCN 문의</strong><br />MCN@roundmag.kr</div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
