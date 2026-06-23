import { roundImages, roundLogo } from "./roundAssets";
import "./round2.css";

const images = [
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

const stories = [
  "ROUNDMAG, Beyond the Hue",
  "Soft Construct",
  "Clean Skin, Vivid Color",
  "New Face Archive",
  "The Cover Files",
  "City Texture",
  "Modern Muse",
  "Fashion Memo",
  "Beauty Report",
  "Round Selection",
  "Editorial Letter",
  "One Fine Day",
].map((title, index) => ({ title, image: images[index % images.length] }));

const news = [
  "Interview · 무엇을 읽는가보다 어떤 방향을 선택하는가",
  "Cover · 프레임 위에서 시작된 라운드의 첫 터치",
  "Beauty · 클린한 피부와 선명한 컬러",
  "Fashion · 컬렉션의 구조와 리듬",
  "Culture · 취향과 첫 터닝포인트",
  "News · 프라이데이컴퍼니의 새로운 프로젝트",
];

function Header() {
  return (
    <header className="rm-header" id="top">
      <div className="rm-header-top">
        <a className="rm-menu" href="#top">☰</a>
        <a className="rm-logo" href="#top"><img src={roundLogo} alt="ROUNDMAG" /></a>
        <nav className="rm-nav">
          <a href="#original">Original</a>
          <a href="#fashion">Fashion</a>
          <a href="#beauty">Beauty</a>
          <a href="#lifestyle">Lifestyle</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="rm-social"><span>IG</span><span>YT</span><span>TT</span><span>⌕</span></div>
      </div>
      <div className="rm-masthead">ROUNDMAG</div>
    </header>
  );
}

function Hero() {
  return (
    <section className="rm-hero">
      <div className="rm-hero-text">
        <p>June Digital Issue · Seoul</p>
        <h1>Beyond<br />the Hue</h1>
        <span>라운드매거진이 기록하는 지금의 얼굴, 패션, 뷰티, 컬처.</span>
      </div>
      <figure><img src={roundImages.film_strip} alt="ROUNDMAG cover" /></figure>
    </section>
  );
}

function CoverStories() {
  return (
    <section className="rm-section" id="original">
      <div className="rm-section-title"><p>Digital Covers</p><h2>Cover Stories</h2></div>
      <div className="rm-feature-grid">
        {stories.slice(0, 3).map((story, index) => (
          <article className={index === 0 ? "rm-feature-card large" : "rm-feature-card"} key={story.title}>
            <figure><img src={story.image} alt={story.title} /></figure>
            <p>{index === 0 ? "Digital Cover" : "Cover Story"}</p>
            <h3>{story.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function EditorialGrid() {
  return (
    <section className="rm-section" id="fashion">
      <div className="rm-section-title"><p>Editor's Picks</p><h2>Fashion · Beauty · Culture</h2></div>
      <div className="rm-editorial-grid">
        {stories.map((story, index) => (
          <article className={index === 1 || index === 7 ? "rm-card tall" : "rm-card"} key={story.title}>
            <figure><img src={story.image} alt={story.title} /></figure>
            <h3>{story.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function OriginalBoard() {
  return (
    <section className="rm-board" id="beauty">
      <div className="rm-board-head"><span>Original</span><nav><a>All</a><a>Cover</a><a>Interview</a><a>Shortform</a><a>Editor's Letter</a></nav></div>
      <div className="rm-board-grid">
        {stories.map((story) => (
          <article className="rm-board-card" key={`board-${story.title}`}>
            <figure><img src={story.image} alt={story.title} /></figure>
            <h3>{story.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function Latest() {
  return (
    <section className="rm-latest" id="lifestyle">
      <div className="rm-section-title"><p>Latest</p><h2>News & Interviews</h2></div>
      <div className="rm-news-list">
        {news.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>ROUNDMAG EDITORIAL</p></article>)}
      </div>
    </section>
  );
}

function AboutContact() {
  return (
    <section className="rm-about-contact" id="about">
      <div className="rm-about"><h2>ROUND<br />MAGAZINE</h2><p>라운드매거진은 인물, 패션, 뷰티, 컬처를 하나의 시선으로 엮는 디지털 매거진입니다.</p></div>
      <div className="rm-contact" id="contact"><h3>&lt;ROUNDMAG&gt;</h3><p>(주)프라이데이컴퍼니<br />서울 성동구 성수이로 66 서울숲 드림타워 408호</p></div>
    </section>
  );
}

function Footer() {
  return <footer className="rm-footer"><img src={roundLogo} alt="ROUNDMAG" /><p>www.roundmag.kr<br />© FRIDAY COMPANY. All rights reserved.</p></footer>;
}

export default function App() {
  return <div className="rm-site"><Header /><main><Hero /><CoverStories /><EditorialGrid /><OriginalBoard /><Latest /><AboutContact /></main><Footer /></div>;
}
