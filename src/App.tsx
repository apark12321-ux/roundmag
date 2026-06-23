import { roundImages, roundLogo } from "./roundAssets";

type Category = "Cover" | "Interview" | "Shortform" | "Fashion" | "Beauty" | "Lifestyle" | "News";

type Article = {
  id: string;
  category: Category;
  title: string;
  description: string;
  image: string;
  date: string;
};

const navItems = [
  { label: "Original", href: "#original", children: ["All", "Cover", "Interview", "Shortform", "Editor's Letter"] },
  { label: "Fashion", href: "#fashion" },
  { label: "Beauty", href: "#beauty" },
  { label: "Lifestyle", href: "#lifestyle", children: ["All", "News", "Place", "Food", "Sports"] },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const articles: Article[] = [
  {
    id: "sunghanbin-covernat",
    category: "Cover",
    title: "SUNGHANBIN X COVERNAT",
    description: "녹음이 푸르게 짙은 어느 봄날, 성한빈과 커버낫이 펼쳐낸 나른한 청춘의 일상.",
    image: roundImages.highcut_sunghanbin,
    date: "APRIL",
  },
  {
    id: "round-jungwon",
    category: "Cover",
    title: "CHA JUNGWON X FITFLOP",
    description: "담백한 실루엣과 제품 포커스가 살아있는 라운드매거진 디지털 커버.",
    image: roundImages.round_jungwon,
    date: "MAY",
  },
  {
    id: "bambam-first-issue",
    category: "Cover",
    title: "BAMBAM, FIRST ISSUE",
    description: "퍼플 톤 클로즈업과 강한 표정으로 완성한 모바일 피드형 커버 무드.",
    image: roundImages.round_bambam_purple,
    date: "APRIL",
  },
  {
    id: "bambam-closeup",
    category: "Interview",
    title: "BAMBAM, CLOSE TO THE LIGHT",
    description: "주얼리 디테일과 눈빛을 중심으로 만든 클로즈업 인터뷰 커버.",
    image: roundImages.round_bambam_close,
    date: "APRIL",
  },
  {
    id: "nana-highcut",
    category: "Fashion",
    title: "나아간다, 나나가.",
    description: "럭키슈에뜨와 함께한 항해의 여정. 레드 포인트와 선명한 인상이 남는 커버.",
    image: roundImages.highcut_nana,
    date: "OCTOBER",
  },
  {
    id: "mona-vogue",
    category: "Fashion",
    title: "MONA TOUGAARD, SHE'S GOT THE LOOK",
    description: "화이트 배경 위에서 포즈와 타이포그래피가 선명하게 살아나는 커버 구성.",
    image: roundImages.vogue_mona,
    date: "JULY",
  },
  {
    id: "kim-doyeon-red",
    category: "Beauty",
    title: "KIM DOYEON, RED PORTRAIT",
    description: "단색 배경, 큰 로고, 얼굴 중심 크롭으로 완성하는 뷰티 커버 밸런스.",
    image: roundImages.vogue_kim,
    date: "JULY",
  },
  {
    id: "dazed-johnny",
    category: "Shortform",
    title: "OUR JOHNNY",
    description: "아웃도어 촬영, 청량한 컬러, 움직임 있는 물방울 컷으로 만든 서머 무드.",
    image: roundImages.dazed_johnny,
    date: "JUNE",
  },
  {
    id: "dazed-enhypen",
    category: "Cover",
    title: "ENHYPEN, DAZED GROUP COVER",
    description: "그룹 화보에서 중요한 인물 간격과 로고 안전 영역을 보여주는 구성.",
    image: roundImages.dazed_enhypen,
    date: "JUNE",
  },
  {
    id: "ida-cover",
    category: "Fashion",
    title: "IDA HEINER BY SEAN AND SENG",
    description: "레드 톱과 그린 로고 대비로 완성한 패션 커버 레퍼런스.",
    image: roundImages.vogue_ida,
    date: "NOVEMBER",
  },
  {
    id: "aqua-film-strip",
    category: "Lifestyle",
    title: "AQUA FILM STRIP",
    description: "캠페인 촬영 무드보드를 보여주는 3컷 시퀀스.",
    image: roundImages.film_strip,
    date: "CAMPAIGN",
  },
];

const highlightItems = articles.slice(0, 10);
const latestItems = articles.slice(2, 10);

function Header() {
  return (
    <header className="site-header">
      <div className="header-line top-line">
        <a className="menu-text" href="#original">MENU</a>
        <a className="brand" href="#top" aria-label="ROUNDMAG home">
          <img src={roundLogo} alt="ROUNDMAG" />
        </a>
        <label className="site-search">
          <span>site search</span>
          <input aria-label="site search" />
        </label>
      </div>
      <nav className="gnb" aria-label="main navigation">
        {navItems.map((item) => (
          <div className="gnb-item" key={item.label}>
            <a href={item.href}>{item.label}</a>
            {item.children ? (
              <div className="depth">
                {item.children.map((child) => (
                  <a href={item.href} key={child}>{child}</a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </header>
  );
}

function ArticleCard({ article, wide = false }: { article: Article; wide?: boolean }) {
  return (
    <article className={wide ? "article-card wide" : "article-card"}>
      <a href={`#${article.id}`}>
        <figure>
          <img src={article.image} alt={article.title} loading="lazy" />
        </figure>
        <div className="card-copy">
          <p>{article.category}</p>
          <h3>{article.title}</h3>
          <span>{article.description}</span>
        </div>
      </a>
    </article>
  );
}

export default function App() {
  return (
    <div className="site" id="top">
      <Header />

      <main>
        <section className="hero" id="original">
          <div className="hero-grid">
            <ArticleCard article={articles[0]} wide />
            <ArticleCard article={articles[1]} />
            <ArticleCard article={articles[2]} />
            <ArticleCard article={articles[3]} />
            <ArticleCard article={articles[4]} />
            <ArticleCard article={articles[5]} />
            <ArticleCard article={articles[6]} />
          </div>
        </section>

        <section className="section" id="cover">
          <div className="section-title">
            <h2>Original</h2>
            <p>Cover · Interview · Shortform · Editor's Letter</p>
          </div>
          <div className="cover-grid">
            {articles.slice(0, 8).map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </section>

        <section className="highlight" id="shortform">
          <div className="section-title compact">
            <h2>Highlight</h2>
          </div>
          <div className="highlight-grid">
            {highlightItems.map((article) => (
              <article className="highlight-card" key={`highlight-${article.id}`}>
                <a href={`#${article.id}`}>
                  <figure>
                    <img src={article.image} alt={article.title} loading="lazy" />
                  </figure>
                  <h3>{article.title}</h3>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section" id="fashion">
          <div className="section-title vertical">
            <h2>Fashion</h2>
            <p>Digital cover and editorial archive</p>
          </div>
          <div className="cover-grid small">
            {[articles[4], articles[5], articles[9], articles[10]].map((article) => (
              <ArticleCard article={article} key={`fashion-${article.id}`} />
            ))}
          </div>
        </section>

        <section className="section split-section" id="beauty">
          <div className="section-title vertical">
            <h2>Beauty</h2>
            <p>Portrait, color, texture</p>
          </div>
          <div className="cover-grid small">
            {[articles[6], articles[3], articles[2]].map((article) => (
              <ArticleCard article={article} key={`beauty-${article.id}`} />
            ))}
          </div>
        </section>

        <section className="section split-section" id="lifestyle">
          <div className="section-title vertical">
            <h2>Lifestyle</h2>
            <p>Brand campaign, film mood, shortform</p>
          </div>
          <div className="cover-grid small">
            {[articles[10], articles[7], articles[8]].map((article) => (
              <ArticleCard article={article} key={`life-${article.id}`} />
            ))}
          </div>
        </section>

        <section className="latest" id="news">
          <div className="section-title compact">
            <h2>Lastest News</h2>
          </div>
          <div className="latest-list">
            {latestItems.map((article) => (
              <a className="latest-item" href={`#${article.id}`} key={`latest-${article.id}`}>
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <em>{article.description}</em>
              </a>
            ))}
          </div>
        </section>

        <section className="company" id="about">
          <div>
            <h2>About</h2>
            <p>ROUNDMAG는 셀럽 화보, 브랜드 협찬, 디지털 커버, 쇼츠형 콘텐츠를 다루는 프라이데이컴퍼니의 디지털 매거진입니다.</p>
          </div>
          <dl>
            <div><dt>Company</dt><dd>(주)프라이데이컴퍼니</dd></div>
            <div><dt>CEO</dt><dd>박준희</dd></div>
            <div><dt>Address</dt><dd>서울 성동구 성수이로 66 서울숲 드림타워 408호</dd></div>
          </dl>
        </section>

        <section className="contact" id="contact">
          <a href="https://www.instagram.com/_roundmag/" target="_blank" rel="noreferrer">Instagram @_roundmag</a>
          <a href="mailto:contact@roundmag.kr">contact@roundmag.kr</a>
          <span>Seoul, Seongsu</span>
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
