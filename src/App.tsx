import { useMemo, useState } from "react";
import { ChevronDown, Instagram, Mail, MapPin, Menu, Search, X } from "lucide-react";
import { roundImages, roundLogo } from "./roundAssets";

type Category = "Cover" | "Interview" | "Shortform" | "Fashion" | "Beauty" | "Lifestyle" | "News";

type Article = {
  id: string;
  category: Category;
  title: string;
  description: string;
  image: string;
  credit: string;
  date: string;
};

const nav = [
  { label: "Original", children: ["All", "Cover", "Interview", "Shortform"] },
  { label: "Fashion" },
  { label: "Beauty" },
  { label: "Lifestyle", children: ["All", "News", "Place", "Food", "Sports"] },
  { label: "About" },
  { label: "Contact" },
];

const articles: Article[] = [
  {
    id: "sunghanbin-covernat",
    category: "Cover",
    title: "SUNGHANBIN X COVERNAT",
    description: "녹음이 푸르게 짙은 어느 봄날, 성한빈과 커버낫이 펼쳐낸 나른한 청춘의 일상.",
    image: roundImages.highcut_sunghanbin,
    credit: "DIGITAL COVER",
    date: "APRIL",
  },
  {
    id: "cha-jungwon-fitflop",
    category: "Cover",
    title: "CHA JUNGWON X FITFLOP",
    description: "차분한 실루엣과 제품 포커스가 살아있는 라운드매거진형 디지털 커버 레퍼런스.",
    image: roundImages.round_jungwon,
    credit: "DIGITAL COVER",
    date: "MAY",
  },
  {
    id: "bambam-first-issue",
    category: "Cover",
    title: "BAMBAM, FIRST ISSUE",
    description: "퍼플 톤 클로즈업과 강한 표정으로 완성한 모바일 피드형 커버 무드.",
    image: roundImages.round_bambam_purple,
    credit: "FIRST ISSUE",
    date: "APRIL",
  },
  {
    id: "bambam-closeup",
    category: "Interview",
    title: "BAMBAM, CLOSE TO THE LIGHT",
    description: "주얼리 디테일과 눈빛을 중심으로 만든 클로즈업 인터뷰 커버.",
    image: roundImages.round_bambam_close,
    credit: "INTERVIEW",
    date: "APRIL",
  },
  {
    id: "highcut-nana",
    category: "Fashion",
    title: "HIGH CUT: NANA",
    description: "럭키슈에뜨와 함께한 항해의 여정. 강한 헤어·메이크업과 레드 포인트의 조합.",
    image: roundImages.highcut_nana,
    credit: "FASHION",
    date: "OCTOBER",
  },
  {
    id: "vogue-mona",
    category: "Fashion",
    title: "MONA TOUGAARD, SHE'S GOT THE LOOK",
    description: "화이트 배경 위에서 인물의 포즈와 타이포그래피가 선명하게 살아나는 커버 구성.",
    image: roundImages.vogue_mona,
    credit: "REFERENCE",
    date: "JULY",
  },
  {
    id: "vogue-kim",
    category: "Beauty",
    title: "KIM DOYEON, RED PORTRAIT",
    description: "단색 배경, 큰 로고, 얼굴 중심 크롭으로 완성하는 뷰티 커버 밸런스.",
    image: roundImages.vogue_kim,
    credit: "BEAUTY",
    date: "JULY",
  },
  {
    id: "dazed-johnny",
    category: "Shortform",
    title: "OUR JOHNNY",
    description: "아웃도어 촬영, 청량한 컬러, 움직임 있는 물방울 컷으로 만든 서머 무드.",
    image: roundImages.dazed_johnny,
    credit: "SHORTFORM",
    date: "JUNE",
  },
  {
    id: "dazed-enhypen",
    category: "Cover",
    title: "ENHYPEN, DAZED GROUP COVER",
    description: "그룹 화보에서 중요한 인물 간격, 로고 안전 영역, 밝은 톤의 커버 구성.",
    image: roundImages.dazed_enhypen,
    credit: "GROUP COVER",
    date: "JUNE",
  },
  {
    id: "film-strip",
    category: "Lifestyle",
    title: "AQUA FILM STRIP",
    description: "캠페인 촬영의 무드보드를 보여주는 3컷 시퀀스. 하이라이트 영역에 적합한 이미지.",
    image: roundImages.film_strip,
    credit: "MOOD BOARD",
    date: "CAMPAIGN",
  },
];

const filters = ["All", "Cover", "Interview", "Shortform", "Fashion", "Beauty", "Lifestyle"] as const;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryMatch = activeFilter === "All" || article.category === activeFilter;
      const queryMatch = !normalizedQuery || `${article.title} ${article.description} ${article.credit}`.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeFilter, query]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="site">
      <header className="header">
        <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="메뉴 열기">
          <Menu size={22} />
          <span>MENU</span>
        </button>

        <button className="logo-button" type="button" onClick={() => scrollTo("top")} aria-label="ROUNDMAG 홈">
          <img src={roundLogo} alt="ROUNDMAG" />
        </button>

        <nav className="nav" aria-label="주 메뉴">
          {nav.map((item) => (
            <div className="nav-item" key={item.label}>
              <button type="button" onClick={() => scrollTo(item.label.toLowerCase())}>
                {item.label}
                {item.children && <ChevronDown size={13} />}
              </button>
              {item.children && (
                <div className="dropdown">
                  {item.children.map((child) => (
                    <button key={child} type="button" onClick={() => scrollTo(item.label.toLowerCase())}>
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="header-right">
          <label className="search">
            <Search size={17} />
            <input value={query} onChange={(event: { target: { value: string } }) => setQuery(event.target.value)} placeholder="site search" />
          </label>
          <a href="https://www.instagram.com/_roundmag/" target="_blank" rel="noreferrer" aria-label="라운드매거진 인스타그램">
            <Instagram size={19} />
          </a>
        </div>
      </header>

      {menuOpen && (
        <aside className="mobile-drawer" aria-modal="true" role="dialog">
          <div className="drawer-head">
            <img src={roundLogo} alt="ROUNDMAG" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">
              <X size={24} />
            </button>
          </div>
          {nav.map((item) => (
            <button key={item.label} type="button" onClick={() => scrollTo(item.label.toLowerCase())}>
              {item.label}
            </button>
          ))}
        </aside>
      )}

      <main id="top">
        <section className="main-visual" id="original">
          <div className="lead-grid">
            {articles.slice(0, 3).map((article, index) => (
              <article className={index === 0 ? "lead-card lead-card-large" : "lead-card"} key={article.id}>
                <figure>
                  <img src={article.image} alt={article.title} />
                </figure>
                <div className="article-copy">
                  <p>{article.credit}</p>
                  <h1>{article.title}</h1>
                  <span>{article.description}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="cover">
          <div className="section-head">
            <h2>Original</h2>
            <p>Cover · Interview · Shortform</p>
          </div>
          <div className="filter-bar">
            {filters.map((filter) => (
              <button className={activeFilter === filter ? "active" : ""} type="button" key={filter} onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
          <div className="article-grid">
            {filteredArticles.map((article) => (
              <article className="article-card" key={article.id}>
                <figure>
                  <img src={article.image} alt={article.title} />
                </figure>
                <div className="article-copy">
                  <p>{article.category}</p>
                  <h3>{article.title}</h3>
                  <span>{article.description}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="highlight" id="shortform">
          <div className="section-head">
            <h2>Highlight</h2>
            <p>Digital cover, reel, mood sequence</p>
          </div>
          <div className="highlight-row">
            {articles.slice(0, 8).map((article) => (
              <article className="highlight-card" key={`highlight-${article.id}`}>
                <figure>
                  <img src={article.image} alt={article.title} />
                </figure>
                <h3>{article.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="news-section" id="fashion">
          <div className="section-head">
            <h2>Lastest News</h2>
            <p>Fashion · Beauty · Lifestyle</p>
          </div>
          <div className="news-list">
            {articles.slice(3, 11).map((article) => (
              <article className="news-item" key={`news-${article.id}`}>
                <span>{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about" id="about">
          <div>
            <h2>About</h2>
            <p>
              ROUNDMAG는 셀럽 화보, 브랜드 협찬, 디지털 커버, 쇼츠형 콘텐츠를 다루는 프라이데이컴퍼니의 디지털 매거진입니다.
            </p>
          </div>
          <dl>
            <div>
              <dt>Company</dt>
              <dd>(주)프라이데이컴퍼니</dd>
            </div>
            <div>
              <dt>CEO</dt>
              <dd>박준희</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>서울 성동구 성수이로 66 서울숲 드림타워 408호</dd>
            </div>
          </dl>
        </section>

        <section className="contact" id="contact">
          <div>
            <h2>Contact</h2>
            <p>커버 디자인, 브랜드 협찬, 디지털 매거진 구축 관련 문의</p>
          </div>
          <div className="contact-links">
            <a href="https://www.instagram.com/_roundmag/" target="_blank" rel="noreferrer"><Instagram size={18} /> @_roundmag</a>
            <a href="mailto:contact@roundmag.kr"><Mail size={18} /> contact@roundmag.kr</a>
            <span><MapPin size={18} /> Seoul, Seongsu</span>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={roundLogo} alt="ROUNDMAG" />
        <p>www.roundmag.kr</p>
        <p>© FRIDAY COMPANY. All rights reserved.</p>
      </footer>
    </div>
  );
}
