import { roundImages, roundLogo } from "./roundAssets";

const items = [
  { title: "DIGITAL COVER 01", image: roundImages.round_jungwon },
  { title: "FIRST ISSUE", image: roundImages.round_bambam_purple },
  { title: "CLOSE TO THE LIGHT", image: roundImages.round_bambam_close },
  { title: "SPRING YOUTH", image: roundImages.highcut_sunghanbin },
  { title: "FASHION COVER", image: roundImages.highcut_nana },
  { title: "THE LOOK", image: roundImages.vogue_mona },
];

export default function App() {
  return (
    <div className="site" id="top">
      <header className="site-header">
        <div className="header-inner">
          <a className="menu-label" href="#original">MENU</a>
          <a className="brand" href="#top"><img src={roundLogo} alt="ROUNDMAG" /></a>
          <label className="site-search"><span>site search</span><input aria-label="site search" /></label>
        </div>
        <nav className="gnb"><a href="#original">Original</a><a href="#fashion">Fashion</a><a href="#beauty">Beauty</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      </header>
      <main>
        <section className="home-board" id="original"><div className="home-grid">{items.map((item) => <article className="home-card" key={item.title}><figure><img src={item.image} alt={item.title} /></figure><h3>{item.title}</h3><p>Roundmag editorial archive.</p></article>)}</div></section>
        <section className="highlight-section" id="fashion"><h2>Highlight</h2></section>
        <section className="news-section"><h2>Lastest News</h2></section>
      </main>
      <footer className="site-footer" id="contact"><img src={roundLogo} alt="ROUNDMAG" /></footer>
    </div>
  );
}
