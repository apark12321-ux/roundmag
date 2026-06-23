import { roundImages, roundLogo } from "./roundAssets";
import "./round.css";

const items = [
  { type: "Cover", title: "DIGITAL COVER 01", text: "Roundmag digital cover archive.", image: roundImages.round_jungwon },
  { type: "Cover", title: "FIRST ISSUE", text: "Portrait and color mood.", image: roundImages.round_bambam_purple },
  { type: "Interview", title: "CLOSE TO THE LIGHT", text: "Interview and cover story.", image: roundImages.round_bambam_close },
  { type: "Cover", title: "SPRING YOUTH", text: "Editorial cover archive.", image: roundImages.highcut_sunghanbin },
  { type: "Fashion", title: "SAILING MOOD", text: "Fashion cover rhythm.", image: roundImages.highcut_nana },
  { type: "Fashion", title: "THE LOOK", text: "Studio cover balance.", image: roundImages.vogue_mona },
  { type: "Beauty", title: "RED PORTRAIT", text: "Beauty portrait archive.", image: roundImages.vogue_kim },
  { type: "Shortform", title: "SUMMER MOTION", text: "Shortform visual archive.", image: roundImages.dazed_johnny },
  { type: "Cover", title: "GROUP COVER", text: "Group editorial archive.", image: roundImages.dazed_enhypen },
  { type: "Fashion", title: "RED AND GREEN", text: "Color contrast reference.", image: roundImages.vogue_ida },
  { type: "Lifestyle", title: "FILM STRIP", text: "Campaign mood sequence.", image: roundImages.film_strip },
];

function Card({ item }: { item: (typeof items)[number] }) {
  return <article className="home-card"><a href="#story"><figure><img src={item.image} alt={item.title} /></figure><h3>{item.title}</h3><p>{item.text}</p></a></article>;
}

export default function App() {
  return (
    <div className="site" id="top">
      <header className="site-header">
        <div className="header-inner">
          <a className="menu-label" href="#original">MENU</a>
          <a className="brand" href="#top"><img src={roundLogo} alt="ROUNDMAG" /></a>
          <label className="site-search"><span>site search</span><input aria-label="site search" /></label>
        </div>
        <nav className="gnb"><a href="#original">Original</a><a href="#fashion">Fashion</a><a href="#beauty">Beauty</a><a href="#lifestyle">Lifestyle</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      </header>
      <main>
        <section className="home-board" id="original"><div className="subnav"><a>All</a><a>Cover</a><a>Interview</a><a>Shortform</a><a>Editor's Letter</a></div><div className="home-grid">{items.slice(0,9).map((item) => <Card item={item} key={item.title} />)}</div></section>
        <section className="highlight-section"><h2>Highlight</h2><div className="highlight-grid">{items.map((item) => <article className="highlight-card" key={`h-${item.title}`}><a href="#story"><figure><img src={item.image} alt={item.title} /></figure><span>{item.title}</span></a></article>)}</div></section>
        <section className="home-board secondary" id="fashion"><div className="section-title-row"><h2>Fashion</h2><p>Digital cover and editorial archive</p></div><div className="home-grid three">{items.slice(4,10).map((item) => <Card item={item} key={`f-${item.title}`} />)}</div></section>
        <section className="news-section"><h2>Lastest News</h2><div className="latest-list">{items.slice(0,8).map((item) => <a className="latest-row" href="#story" key={`n-${item.title}`}><span>{item.type}</span><strong>{item.title}</strong></a>)}</div></section>
        <section className="feature-story" id="story"><div className="story-category">Original</div><hr /><div className="story-tabs"><a>All</a><a>Cover</a><a>Interview</a><a>Shortform</a></div><header className="story-head"><h1><span>Interview</span> CLOSE TO THE LIGHT</h1><p>Image first, copy second. The page keeps the original visual ratio and separates text from the picture for clear readability.</p></header><figure className="story-full"><img src={items[2].image} alt="story" /></figure></section>
        <section className="company-section" id="about"><div className="footer-links"><a>About</a><a>Contact</a><a>Media kit</a></div><div className="company-copy"><p>www.roundmag.kr</p><p>FRIDAY COMPANY. All rights reserved.</p><p>Seoul, Seongsu</p></div></section>
      </main>
      <footer className="site-footer" id="contact"><img src={roundLogo} alt="ROUNDMAG" /><div><a href="#top">Instagram</a><a href="#top">Contact</a></div></footer>
    </div>
  );
}
