import React, { useState, useEffect } from "react";
import { Story, NewsItem, SiteSettings } from "./types";
import AdminPanel from "./components/AdminPanel";
import CoStudioWorkspace from "./components/CoStudioWorkspace";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Instagram, 
  Youtube, 
  Clock, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Send,
  ExternalLink,
  Laptop,
  Cpu,
  Radio,
  Database,
  Terminal,
  Activity
} from "lucide-react";
// Silent sound function (No-op to remove annoying sci-fi beeps from minimalist magazine)
function playTechBeep(frequency = 1000, duration = 0.03, type: OscillatorType = "sine") {
  // Silent
}


const INITIAL_OFFLINE_STORIES: Story[] = [
  {
    id: "story-1",
    num: "01",
    title: "Symmetry & Silence",
    sub: "구조적 공간과 선이 만들어내는 미니멀리즘의 정수",
    c: "Architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    content: "바쁜 도심 속에서 비움의 가치를 실천하는 성수동의 한 주거 공간을 찾았습니다. 콘크리트와 따뜻한 나무 톤이 조화롭게 교차하며 연출하는 감각적인 공간의 리듬감. 프라이데이컴퍼니가 소개하는 _roundmag의 시그니처 큐레이션 시리즈.",
    createdAt: "2026-06-10T12:00:00Z"
  },
  {
    id: "story-2",
    num: "02",
    title: "Minimal Sculpture",
    sub: "흙과 불이 자아내는 오가닉 텍스처와 오브제의 아름다움",
    c: "Art & Craft",
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
    content: "손가락 끝 마디마디의 미세한 압력과 불의 우연성이 결합하여 탄생한 단 하나의 세라믹 오브제. 장식적인 기교를 일절 배제하여 본질적인 실루엣과 태생적인 비대칭성만을 담아낸 공예 작품의 시적인 내러티브입니다.",
    createdAt: "2026-06-11T12:00:00Z"
  },
  {
    id: "story-3",
    num: "03",
    title: "Bauhaus Legacies",
    sub: "시간을 거스르는 철제 프레임과 가죽의 간결한 직조",
    c: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80",
    content: "1920년대 바이마르 데사우의 모던한 실험 정신은 백년이 흘러 오늘의 다이닝 테이블 앞에서도 고귀한 비례감으로 증명됩니다. 크롬 도금 스틸 튜브가 그리는 우아한 외곡선과 오랜 세월을 기억하는 가죽의 유연함.",
    createdAt: "2026-06-12T10:00:00Z"
  },
  {
    id: "story-4",
    num: "04",
    title: "Chiaroscuro Light",
    sub: "공간의 온도를 맑게 정화하는 빛과 한 뼘의 따뜻한 음영",
    c: "Design Object",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    content: "황혼 무렵, 작은 촛불처럼 은은하게 번지는 탁상 조명의 불빛은 공간을 치유하는 힘이 있습니다. 그림자의 길이에 따라 섬세하게 부각되는 오브제의 입체감과 한낮에는 보이지 않던 벽면의 섬세한 질감.",
    createdAt: "2026-06-12T14:00:00Z"
  }
];

const INITIAL_OFFLINE_NEWS: NewsItem[] = [
  {
    id: "news-1",
    c: "Art Object",
    t: "오브제가 지니는 내러티브와 미니멀 예술의 만남",
    sub: "공간을 가득 채우는 작은 세라믹 공예품들의 독창적 세계관",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-06-13T02:00:00Z"
  },
  {
    id: "news-2",
    c: "Interior Setup",
    t: "공간의 온도를 새롭게 변경하는 간접 무드 조명",
    sub: "황홀한 조색과 미학적 스탠드 실루엣으로 디자인된 시크 램프",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-06-12T21:00:00Z"
  }
];

export default function App() {
  const [stories, setStories] = useState<Story[]>(INITIAL_OFFLINE_STORIES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_OFFLINE_NEWS);
  
  // Hover and mouse percentage trackers for premium visual sensory AI-era effects on hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range: -0.5 to 0.5
    setMousePos({ x, y });
  };
  
  // Navigation & Interactive Tabs
  // "home" | "original" | "fashion" | "beauty" | "lifestyle" | "about" | "contact" | "admin"
  const [activeTab, setActiveTab] = useState<string>("home");
  const [originalSubfilter, setOriginalSubfilter] = useState<string>("All");

  // Site Settings loaded from Express full-stack backend
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "ROUNDMAG",
    siteDesc: "STRUCTURAL HARMONY & MINIMALIST SENTIMENT",
    snsInstagram: "https://www.instagram.com/_roundmag",
    snsYoutube: "https://www.youtube.com",
    snsPinterest: "https://www.pinterest.com",
    aboutUsText: "ROUNDMAG은 공간과 사물이 빚어내는 무언의 리얼리티와 사색의 핏을 탐닉하는 크리에이티브 미디어 매거진입니다.",
    homepageMediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-minimalist-living-room-with-plants-and-soft-lighting-43283-large.mp4",
    homepageMediaType: "video"
  });

  // SNS/Instagram Magazine enhancements
  const [feedViewMode, setFeedViewMode] = useState<"grid" | "sns">("grid");
  const [bookmarkedStories, setBookmarkedStories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("roundmag_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [storyComments, setStoryComments] = useState<Record<string, Array<{ id: string; name: string; text: string; time: string }>>>({
    "story-1": [
      { id: "c1", name: "curator_jin", text: "미니멀리즘의 정수를 담았네요. 공간 비율이 예술입니다.", time: "2시간 전" },
      { id: "c2", name: "architect_y", text: "성수동 공간의 정갈함에서 프라이데이컴퍼니의 깊은 감도가 느껴집니다.", time: "4시간 전" }
    ],
    "story-2": [
      { id: "c3", name: "aesthetic_mood", text: "단 하나의 오브제가 공간 전체의 공기 흐름을 지배하네요.", time: "1일 전" }
    ],
    "story-3": [
      { id: "c4", name: "bauhaus_legacy", text: "시간이 흘러도 변치 않는 튜브 프레임의 간결한 비례감!", time: "2일 전" }
    ]
  });

  const [activeStoryCommentInput, setActiveStoryCommentInput] = useState<Record<string, string>>({});
  const [doubleClickLiked, setDoubleClickLiked] = useState<Record<string, boolean>>({});

  // Hero carousel index
  const [heroIdx, setHeroIdx] = useState(0);

  // Search overlay state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Login overlay state
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Reader detail modal
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin access token
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("roundmag_admin_token");
  });

  // Likes features saved locally
  const [likedStories, setLikedStories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("roundmag_likes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Contact form submission state
  const [contactForm, setContactForm] = useState({ name: "", email: "", msg: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Fetch initial data from express backend
  const fetchData = async () => {
    try {
      const [storiesRes, newsRes, settingsRes] = await Promise.all([
        fetch("/api/stories"),
        fetch("/api/news"),
        fetch("/api/settings"),
      ]);
      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setStories(storiesData);
      }
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error("Failed to fetch ROUNDMAG content:", error);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Simple path-based router synchronization
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, "") || "home";
      const allowedPaths = ["home", "original", "fashion", "beauty", "lifestyle", "about", "contact", "admin"];
      if (allowedPaths.includes(path)) {
        setActiveTab(path);
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Autoplay loop of 6 seconds for premium editorial carousel
  useEffect(() => {
    if (stories.length === 0) return;
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  // Handle like toggle
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = likedStories.includes(id)
      ? likedStories.filter((x) => x !== id)
      : [...likedStories, id];
    setLikedStories(updated);
    localStorage.setItem("roundmag_likes", JSON.stringify(updated));
  };

  // Simulated Login Submit (Accepts admin passcode 1234 or processes like standard login)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === "1234" || loginEmail === "admin@roundmag.co.kr") {
      // Authenticate as Admin
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: loginPassword }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          handleAdminLogin(data.token);
          setLoginOpen(false);
          alert("관리자 모드로 로그인되었습니다. 우측 하단의 관리 톱니바퀴 또는 관리자 탭을 사용하실 수 있습니다.");
          return;
        }
      } catch (err) {
        console.error("Auth server connection failed", err);
      }
    }
    
    // Normal simulated subscriber login
    setAdminToken("normal-subscriber");
    localStorage.setItem("roundmag_admin_token", "normal-subscriber");
    setLoginOpen(false);
    alert(`안녕하세요, ${loginEmail || "구독자"}님! ROUNDMAG 디지털 서비스에 로그인되었습니다.`);
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("roundmag_admin_token", token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("roundmag_admin_token");
    alert("로그아웃 되었습니다.");
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSettings, adminToken })
      });
      if (res.ok) {
        setSettings(newSettings);
        alert("사이트 설정이 성수동 본사 DB에 영구 반영되었습니다.");
      } else {
        const err = await res.json();
        throw new Error(err.error || "설정 저장 실패");
      }
    } catch (e: any) {
      alert(`오류: ${e.message}`);
    }
  };

  // Creating & Deleting Cover Stories
  const handleAddStory = async (newStory: Omit<Story, "id" | "num" | "createdAt">) => {
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStory, adminToken }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        throw new Error(err.error || "스토리 업로드 실패");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminToken }),
      });
      if (res.ok) {
        await fetchData();
        if (selectedStory?.id === id) {
          setSelectedStory(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || "스토리 삭제 실패");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Creating & Deleting News Items
  const handleAddNews = async (newNews: Omit<NewsItem, "id" | "createdAt">) => {
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newNews, adminToken }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        throw new Error(err.error || "기사 업로드 실패");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminToken }),
      });
      if (res.ok) {
        await fetchData();
        if (selectedNews?.id === id) {
          setSelectedNews(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || "기사 삭제 실패");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Contact Form handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", msg: "" });
      setContactSubmitted(false);
      alert("문의가 성공적으로 접수되었습니다. 담당자 검토 후 신속하게 회신 드리겠습니다.");
    }, 1200);
  };

  // Search Math filtering
  const filteredStories = searchQuery.trim() 
    ? stories.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.c.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.content && s.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredNews = searchQuery.trim()
    ? news.filter(n =>
        n.t.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.sub && n.sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.c.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalSearchResults = filteredStories.length + filteredNews.length;

  // 3D Tilt perspective effect handlers for premium tactile feedback
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -(y - yc) / 10;
    const rotateY = (x - xc) / 10;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025) translateY(-6px)`;
    el.style.boxShadow = `${-rotateY * 0.8}px ${rotateX * 0.8}px 25px rgba(34, 211, 238, 0.22)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)`;
    el.style.boxShadow = "none";
  };

  // Custom Category Filtering on Original, Fashion, Beauty, Lifestyle pages
  const displayStories = (() => {
    if (activeTab === "home") {
      return stories;
    } else if (activeTab === "original") {
      if (originalSubfilter === "All") return stories;
      return stories.filter(s => s.c.toLowerCase() === originalSubfilter.toLowerCase());
    } else {
      // General tabs like 'fashion', 'beauty', 'lifestyle'
      return stories.filter(s => s.c.toLowerCase() === activeTab.toLowerCase());
    }
  })();

  const displayNews = (() => {
    if (activeTab === "home") {
      return news;
    } else if (activeTab === "original" || activeTab === "about" || activeTab === "contact") {
      return [];
    } else {
      // General tab news
      return news.filter(n => n.c.toLowerCase() === activeTab.toLowerCase());
    }
  })();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Smooth address routing update
    const path = tabId === "home" ? "/" : `/${tabId}`;
    window.history.pushState({}, "", path);
  };

  // Hero carousel actions
  const nextHero = () => {
    if (stories.length > 0) {
      setHeroIdx((prev) => (prev + 1) % stories.length);
    }
  };

  const prevHero = () => {
    if (stories.length > 0) {
      setHeroIdx((prev) => (prev - 1 + stories.length) % stories.length);
    }
  };

  const activeHeroStory = stories[heroIdx] || stories[0] || {
    id: "hero-fallback",
    title: "Symmetry & Silence",
    sub: "구조적 공간과 선이 만들어내는 미니멀리즘의 정수",
    c: "Cover Story",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    content: "바쁜 도심 속에서 비움의 가치를 실천하는 성수동의 한 주거 공간을 찾았습니다. 콘크리트와 따뜻한 나무 톤이 조화롭게 교차하며 연출하는 감각적인 공간의 리듬감. 프라이데이컴퍼니가 소개하는 _roundmag의 시그니처 큐레이션 시리즈.",
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-zinc-100 selection:bg-zinc-700 selection:text-white flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Elegant minimalist gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-zinc-900/10 via-transparent to-transparent pointer-events-none select-none z-0" />

      {/* HEADER: Sticky, sleek cyber-black background with subtle neon bottom line */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-cyan-950/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />

          {/* Brand Logo - Styled with a beautiful editorial serif typography */}
          <div 
            onClick={() => {
              handleTabClick("home");
            }}
            className="cursor-pointer font-serif text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-zinc-100 hover:text-white transition-colors uppercase relative group"
            id="brand-logo"
          >
            {settings.siteName}
          </div>

          {/* Desktop Navigation Category Headers - Clean minimalist layout */}
          <nav className="hidden lg:flex items-center space-x-8 text-[12px] font-semibold tracking-widest text-zinc-400 font-sans">
            {[
              { id: "home", label: "Home" },
              { id: "original", label: "Original" },
              { id: "fashion", label: "Fashion" },
              { id: "beauty", label: "Beauty" },
              { id: "lifestyle", label: "Lifestyle" },
              { id: "about", label: "About" },
              { id: "contact", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabClick(tab.id);
                }}
                className={`transition-colors flex items-center py-2 relative hover:text-white uppercase ${
                  activeTab === tab.id ? "text-zinc-100 font-bold" : "text-zinc-400"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-none" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Widgets: Socials, Search, Profile */}
          <div className="flex items-center space-x-3 md:space-x-4">
            
            {/* Social Media Linkages */}
            <div className="hidden sm:flex items-center space-x-2 text-zinc-500">
              {settings.snsInstagram && (
                <a 
                  href={settings.snsInstagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full hover:bg-zinc-900 hover:text-white transition"
                  title="Instagram 연결"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.snsYoutube && (
                <a 
                  href={settings.snsYoutube} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full hover:bg-zinc-900 hover:text-white transition"
                  title="Youtube 연결"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {settings.snsPinterest && (
                <a 
                  href={settings.snsPinterest} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-full hover:bg-zinc-900 hover:text-white transition text-[9px] font-bold tracking-tight inline-flex items-center justify-center"
                  title="Pinterest 연결"
                >
                  P
                </a>
              )}
            </div>

            <button 
              onClick={() => {
                setSearchOpen(true);
              }}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition outline-none cursor-pointer"
              title="검색 열기"
              id="search-trigger"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Login or User status avatar option */}
            <button
              onClick={() => {
                setLoginOpen(true);
              }}
              className={`p-2 rounded-full transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                adminToken 
                  ? "bg-zinc-100 text-zinc-950 px-3 py-1.5 hover:bg-zinc-200" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
              title="로그인 / 내정보"
              id="login-trigger"
            >
              <User className="h-4 w-4" />
              {adminToken && <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider">{adminToken === "1234" ? "Admin" : "Subscriber"}</span>}
            </button>

            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 text-zinc-400 hover:text-white lg:hidden rounded-full transition outline-none cursor-pointer"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-[85%] max-w-[320px] bg-zinc-950 border-r border-zinc-800/80 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-right relative z-50">
            
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <span className="font-serif text-2xl font-black tracking-[0.2em] text-zinc-100 uppercase">ROUNDMAG</span>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories Link List */}
              <nav className="flex flex-col space-y-4 text-base font-semibold tracking-wide text-zinc-300">
                {[
                  { id: "home", label: "Home" },
                  { id: "original", label: "Original" },
                  { id: "fashion", label: "Fashion" },
                  { id: "beauty", label: "Beauty" },
                  { id: "lifestyle", label: "Lifestyle" },
                  { id: "about", label: "About" },
                  { id: "contact", label: "Contact" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabClick(tab.id);
                    }}
                    className={`flex items-center justify-between py-3 px-2 border-b border-zinc-900 hover:bg-zinc-900 rounded transition text-left cursor-pointer uppercase text-xs tracking-widest ${
                      activeTab === tab.id ? "text-white font-black pl-4 bg-zinc-900 border-zinc-800" : "text-zinc-400"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-zinc-500">→</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Footer Info Block with Inquiry Links matching imweb structure */}
            <div className="space-y-6 pt-12 border-t border-zinc-900">
              <div className="space-y-2 text-xs text-zinc-400 max-w-sm font-sans">
                <p className="font-bold text-zinc-200 text-sm">주식회사 프라이데이컴퍼니</p>
                <p>대표: 박준희  ·  등록번호: 152-88-00989</p>
                <p>서울 성동구 성수이로 66, 408호</p>
                <p>이메일: info@roundmag.co.kr</p>
              </div>

              {/* Social links inside drawer */}
              <div className="flex items-center space-x-3 text-zinc-400">
                <a href="https://www.instagram.com/_roundmag" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-250">
                  <Instagram className="h-4 w-4" />
                </a>
                <span className="text-xs text-zinc-500 font-serif">MCN: creator@roundmag.co.kr</span>
              </div>
            </div>

          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}


      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        
        {/* ========================================================= */}
        {/* TAB 1: HOME VIEW                                          */}
        {/* ========================================================= */}
        {activeTab === "home" && (
          <div className="animate-fade-in">
            
            {/* MEGA HERO VIEW CAROUSEL (ROUNDMAG PREMIUM AI-SENSORY SLIDER) */}
            {stories.length > 0 ? (
              <section 
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setMousePos({ x: 0, y: 0 });
                }}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[440px] max-h-[700px] bg-zinc-950 overflow-hidden flex items-center group cursor-default transition-all duration-500 border-b border-zinc-900"
              >
                {/* Futuristic Multi-Slice Cyber-Scanner assemble effect */}
                <div className="absolute inset-0 overflow-hidden bg-zinc-950">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeHeroStory.id} 
                      className="absolute inset-0 flex w-full h-full overflow-hidden"
                    >
                      {[0, 1, 2, 3].map((index) => {
                        const isEven = index % 2 === 0;
                        const delay = index * 0.1;
                        return (
                          <div 
                            key={index} 
                            className="relative w-1/4 h-full overflow-hidden border-r border-cyan-400/10 last:border-r-0 select-none pointer-events-none"
                            style={{ zIndex: 10 }}
                          >
                            <div 
                              className="w-full h-full overflow-hidden"
                              style={{
                                transform: `translateY(${mousePos.y * -35 * (1 + index * 0.15)}px)`,
                                transition: "transform 0.5s ease-out"
                              }}
                            >
                              <motion.div
                                initial={{ 
                                  y: isEven ? "-110%" : "110%", 
                                  opacity: 0,
                                  filter: "brightness(0.0) saturate(0.2) blur(15px)"
                                }}
                                animate={{ 
                                  y: "0%", 
                                  opacity: 1,
                                  filter: "brightness(0.65) saturate(1) blur(0px)",
                                  // Subtle 3D Depth shifting of background image on cursor offset
                                  x: mousePos.x * -40 * (1 + index * 0.15),
                                }}
                                exit={{ 
                                  y: isEven ? "110%" : "-110%", 
                                  opacity: 0,
                                  filter: "brightness(0.0) saturate(0.1) blur(15px)"
                                }}
                                transition={{ 
                                  y: { type: "spring", stiffness: 60, damping: 18, delay },
                                  opacity: { duration: 0.7, delay },
                                  filter: { duration: 0.7, delay },
                                  x: { type: "spring", stiffness: 45, damping: 25 },
                                }}
                                className="absolute top-0 bottom-0 h-full scale-[1.03] origin-center bg-cover bg-center"
                                style={{
                                  width: "400%",
                                  left: `-${index * 105}%`,
                                  backgroundImage: `url(${activeHeroStory.imageUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Tactile Cinematic Film Grain Noise Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(9,9,11,0.5))] pointer-events-none z-15 mix-blend-multiply" />
                <div 
                  className="absolute inset-0 opacity-[0.035] pointer-events-none z-25 bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/></svg>')]"
                />

                {/* High contrast luxury vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30 pointer-events-none z-10" />

                {/* Overlying Content Card: Splitting fluid translation transitions */}
                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-18 text-white z-20 flex flex-col items-start select-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeHeroStory.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ 
                        opacity: 1, 
                        x: mousePos.x * 25,
                        y: mousePos.y * 25,
                      }}
                      exit={{ opacity: 0, y: -25 }}
                      transition={{ 
                        opacity: { duration: 0.6 },
                        y: { type: "spring", stiffness: 55, damping: 16 },
                        x: { type: "spring", stiffness: 40, damping: 22 }
                      }}
                      className="space-y-5"
                    >
                      <div className="inline-flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-zinc-850 text-zinc-300 text-[11px] sm:text-xs font-bold tracking-[0.25em] px-4 py-2 uppercase font-sans">
                        ROUNDMAG ORIGINAL · {activeHeroStory.c}
                      </div>

                      {/* Title Header */}
                      <div className="relative select-none py-1">
                        <h1 
                          className="relative font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] max-w-5xl cursor-pointer hover:text-zinc-350 transition-colors duration-200" 
                          onClick={() => setSelectedStory(activeHeroStory)}
                        >
                          {activeHeroStory.title}
                        </h1>
                      </div>

                      <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-sans font-normal tracking-wide leading-relaxed line-clamp-2">
                        {activeHeroStory.sub || "하나의 컬러로 규정할 수 없는, 대체불가 라운드맥의 특별한 시너지를 만나보세요."}
                      </p>

                      <div className="pt-3 flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedStory(activeHeroStory)}
                          className="bg-white hover:bg-zinc-900 hover:text-white text-zinc-950 text-xs sm:text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-none transition duration-150 shadow-md cursor-pointer font-sans"
                        >
                          Read Editorial Story
                        </button>
                        
                        <button
                          onClick={(e) => toggleLike(activeHeroStory.id, e)}
                          className="p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                          title="좋아요 보관"
                        >
                          <Heart className={`h-5 w-5 ${likedStories.includes(activeHeroStory.id) ? "fill-red-500 text-red-500 stroke-red-500" : "text-white"}`} />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Slide index indicators dots with sequential active highlight */}
                <div className="absolute bottom-6 left-6 md:left-8 flex items-center space-x-2 z-30">
                  {stories.map((story, dotIdx) => (
                    <button
                      key={story.id}
                      onClick={() => setHeroIdx(dotIdx)}
                      className={`h-1.5 transition-all duration-300 cursor-pointer ${dotIdx === heroIdx ? "w-8 bg-white" : "w-2.5 bg-white/30 hover:bg-white/60"}`}
                      title={`${dotIdx + 1}번 슬라이드로 이동`}
                    />
                  ))}
                </div>

                {/* Carousel previous / next sliding buttons */}
                {stories.length > 1 && (
                  <>
                    <button 
                      onClick={prevHero}
                      className="absolute left-6 z-30 p-2.5 rounded-full bg-black/40 hover:bg-zinc-800 text-white transition opacity-0 group-hover:opacity-100 backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={nextHero}
                      className="absolute right-6 z-30 p-2.5 rounded-full bg-black/40 hover:bg-zinc-800 text-white transition opacity-0 group-hover:opacity-100 backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Active Slide Timeline progress bar simulating active autoplay status */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900/40 z-30 overflow-hidden pointer-events-none">
                  <motion.div
                    key={activeHeroStory.id}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-zinc-100"
                  />
                </div>

                {/* Indicators index numbers list block on bottom-right corner (Benchmark Screenshot 1) */}
                <div className="absolute bottom-6 right-8 z-30 flex items-center space-x-1.5 font-mono text-xs text-white/70 select-none bg-black/50 backdrop-blur-md px-3 py-1 border border-white/5">
                  <span className="text-white font-bold">0{heroIdx + 1}</span>
                  <span className="opacity-30">/</span>
                  <span>0{stories.length}</span>
                </div>

              </section>
            ) : (
              // Fallback skeleton banner
              <div className="bg-zinc-100 py-32 text-center animate-pulse">
                <p className="text-zinc-400 text-sm font-semibold tracking-widest uppercase">ROUNDMAG COVER IS LOADING...</p>
              </div>
            )}


            {/* COVER STORIES SECTION - Elegant Minimalist Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
              <div className="flex items-baseline justify-between mb-10 border-b border-zinc-900 pb-5">
                <div className="space-y-1.5">
                  <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 uppercase tracking-wide">
                    Cover Stories
                  </span>
                  <p className="text-sm text-zinc-400 font-serif italic">ROUNDMAG signature curations and visual highlights</p>
                </div>
                <span className="text-xs sm:text-sm font-mono tracking-wider text-zinc-400 uppercase">Issue [01-0{stories.length}]</span>
              </div>

              {stories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {stories.slice(0, 8).map((story) => (
                    <div 
                      key={story.id} 
                      onClick={() => {
                        setSelectedStory(story);
                      }}
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      className="group cursor-pointer flex flex-col space-y-4 transition-transform duration-300 ease-out h-full"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Image Frame with vertical ratio (aspect-[3/4]) */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950 shadow-md border border-zinc-900 group-hover:border-zinc-750 transition-colors duration-300 select-none">
                        
                        {/* Clean minimal hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4 z-20">
                          <span className="text-xs uppercase tracking-widest text-white border border-white/40 px-4 py-2 bg-black/20 backdrop-blur-sm font-sans font-medium">
                            Read Editorial
                          </span>
                        </div>

                        <img 
                          src={story.imageUrl} 
                          alt={story.title} 
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-90 brightness-90 group-hover:brightness-100"
                          loading="lazy"
                        />
                        
                        {/* Issue Number badge */}
                        <div className="absolute top-3 left-3 bg-zinc-950 text-white border border-zinc-800 text-[8px] font-mono tracking-widest uppercase font-bold px-2.5 py-1 z-10 shadow-md">
                          ISSUE 0{story.num}
                        </div>

                        {/* Quick love action */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(story.id, e);
                          }}
                          className="absolute bottom-3 right-3 p-2 bg-zinc-950/90 border border-zinc-800 hover:border-red-500/50 rounded-full text-zinc-400 hover:text-red-550 transition-all scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100 z-30 shadow-lg cursor-pointer"
                        >
                          <Heart className={`h-3.5 w-3.5 ${likedStories.includes(story.id) ? "fill-red-500 text-red-500 stroke-red-500" : ""}`} />
                        </button>
                      </div>

                      {/* Text details below */}
                      <div className="space-y-2 px-1">
                        <span className="text-[11px] sm:text-xs font-sans text-zinc-400 tracking-[0.15em] uppercase font-bold">
                          {story.c}
                        </span>
                        <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-zinc-100 leading-tight group-hover:text-zinc-300 transition-colors duration-200 line-clamp-1">
                          {story.title}
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                          {story.sub}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 text-zinc-500 border border-dashed border-zinc-800 rounded-none bg-zinc-950/20">등록된 스토리 하이라이트가 아직 없거나 불러오는 중입니다.</div>
              )}
            </section>


            {/* LATEST NEWS SECTION - Cybernetic Telemetry Logic Grid */}
            <section className="bg-[#08080c] py-24 border-t border-b border-zinc-900/60 relative z-10 animate-fade-in">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                <div className="flex items-baseline justify-between mb-10 border-b border-zinc-800 pb-5">
                  <div className="space-y-1.5">
                    <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                      <Radio className="h-5 w-5 text-cyan-400 animate-pulse" />
                      Latest news
                    </span>
                    <p className="text-sm text-zinc-400 font-serif italic">Fresh reports, designer insights, and daily updates</p>
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-zinc-400">[{news.length} articles]</span>
                </div>

                {news.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {news.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedNews(item);
                        }}
                        className="bg-zinc-950/60 p-5 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col space-y-3 rounded-none group relative overflow-hidden backdrop-blur-md"
                      >
                        {/* News Thumbnail Image Preview */}
                        <div className="aspect-[4/3] w-full bg-zinc-900 border border-zinc-900 overflow-hidden relative">
                          <img 
                            src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"}
                            alt={item.t}
                            className="w-full h-full object-cover transform transition-transform duration-550 group-hover:scale-105 filter saturate-90 group-hover:saturate-100 brightness-95 group-hover:brightness-100"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 bg-zinc-900/90 text-zinc-100 text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border border-zinc-850 shadow-sm">
                            {item.c}
                          </span>
                        </div>

                        {/* Text Detail blocks */}
                        <div className="flex-grow flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <span className="text-[11px] sm:text-xs text-zinc-400 tracking-widest uppercase font-bold">
                              {item.c}
                            </span>
                            <h4 className="font-serif text-[18px] sm:text-[20px] font-bold text-zinc-100 group-hover:text-zinc-300 leading-snug line-clamp-2 transition-colors duration-200">
                              {item.t}
                            </h4>
                            {item.sub && (
                              <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                                {item.sub}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px] text-zinc-500 font-mono">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-zinc-450" />
                              {new Date(item.createdAt).toLocaleDateString("ko-KR", {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            
                            {/* Fast inline delete button if authenticated */}
                            {adminToken === "1234" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`'${item.t}' 기사를 즉각 삭제하시겠습니까?`)) {
                                    handleDeleteNews(item.id);
                                  }
                                }}
                                className="text-red-400 hover:underline hover:text-red-300 z-30 relative px-1 font-bold"
                              >
                                삭제 (Admin)
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-zinc-500 border border-zinc-900 bg-zinc-950/20 text-sm font-sans">등록된 새로운 소식이 아직 없습니다.</div>
                )}

              </div>
            </section>

          </div>
        )}


        {/* ========================================================= */}
        {/* TAB 0: ROUNDMAG AI CORE WORKSPACE STUDIO                  */}
        {/* ========================================================= */}
        {activeTab === "studio" && (
          <CoStudioWorkspace />
        )}


        {/* ========================================================= */}
        {/* TAB 2: EDITORIAL SECTIONS (ORIGINAL PAGE FILTER - Screenshot 2) */}
        {/* ========================================================= */}
        {activeTab === "original" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fade-in space-y-10">
            
            {/* Elegant Header Block matching Screenshot 2 "Original" rectangle border */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="border border-zinc-900 px-6 py-2">
                <h1 className="font-serif text-3xl font-black text-zinc-950 tracking-[0.10em] uppercase">Original</h1>
              </div>
              <p className="text-xs text-zinc-500 font-serif italic mt-2">ROUNDMAG Authentic Curated Media Cuts</p>
            </div>

            {/* Sub-Filters option row (All, Cover, Interview, Shortform, Editor's Letter) */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-4 border-b border-zinc-100 pb-3 overflow-x-auto scrollbar-none whitespace-nowrap">
              {["All", "Cover", "Interview", "Fashion", "Beauty", "Lifestyle"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOriginalSubfilter(filter)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                    originalSubfilter === filter
                      ? "text-zinc-950 font-bold border-b-2 border-zinc-950"
                      : "text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Results Grid - Interactive 4-column squares (Screenshot 2) */}
            {displayStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStories.map((story) => (
                  <div 
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="group cursor-pointer bg-white border border-zinc-100 flex flex-col space-y-3 hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-zinc-50">
                      <img 
                        src={story.imageUrl} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                      
                      <div className="absolute bottom-3 left-3 bg-white/95 text-zinc-900 text-[8px] font-mono tracking-widest uppercase font-bold px-2 py-0.5">
                        {story.c}
                      </div>
                    </div>

                    <div className="p-3 pt-0 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">{story.c}</span>
                      <h3 className="font-serif text-base font-bold text-zinc-900 line-clamp-1 group-hover:underline">
                        {story.title}
                      </h3>
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {story.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-400">선택된 카테고리에 할당된 고품질 인화 컷이 존재하지 않습니다.</div>
            )}

          </div>
        )}


        {/* ========================================================= */}
        {/* TABS: SPECIFIC CATEGORIES (FASHION, BEAUTY, LIFESTYLE)     */}
        {/* ========================================================= */}
        {(activeTab === "fashion" || activeTab === "beauty" || activeTab === "lifestyle") && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fade-in space-y-12">
            
            <div className="border-l-4 border-zinc-900 pl-4 py-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase font-serif">Category Section</span>
              <h1 className="font-serif text-3xl font-black text-zinc-950 uppercase tracking-widest">{activeTab}</h1>
            </div>

            {/* Display matched stories */}
            <div className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 border-b pb-1">Cover & Editorial Cuts</h2>
              {displayStories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayStories.map((story) => (
                    <div 
                      key={story.id}
                      onClick={() => setSelectedStory(story)}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="aspect-[4/5] bg-zinc-100 overflow-hidden border">
                        <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover transform transition duration-500 group-hover:scale-102" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl font-bold text-zinc-950 group-hover:underline">{story.title}</h3>
                        <p className="text-xs text-zinc-650 leading-relaxed italic">{story.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400 py-6">등록된 이 테마 에디토리얼 화보가 아직 기재되지 않았습니다.</p>
              )}
            </div>

            {/* Display matched News items */}
            <div className="space-y-6 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 border-b pb-1">Latest Stream News</h2>
              {displayNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayNews.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => setSelectedNews(n)}
                      className="bg-zinc-50 p-4 border flex gap-4 hover:border-zinc-300 transition duration-350 cursor-pointer"
                    >
                      <img src={n.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=150&q=80"} alt={n.t} className="w-20 h-20 object-cover" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">{n.c}</span>
                          <h4 className="font-serif text-base font-bold text-zinc-900 leading-snug line-clamp-1">{n.t}</h4>
                          <p className="text-xs text-zinc-500 line-clamp-1">{n.sub}</p>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono mt-2 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400 py-6">관련된 피드 소식이 등록 대기중입니다.</p>
              )}
            </div>

          </div>
        )}


        {/* ========================================================= */}
        {/* TAB 4: ABOUT VIEW (HIGHQUALITY MAGAZINE - Screenshot 3)   */}
        {/* ========================================================= */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 animate-fade-in space-y-12">
            
            {/* Big typographic title */}
            <div className="space-y-2 text-center">
              <h1 className="font-serif text-4xl md:text-6xl font-black text-zinc-950 tracking-wider text-zinc-100 uppercase">{settings.siteName} MUSEUM</h1>
              <div className="h-0.5 w-16 bg-cyan-400 mx-auto" />
              <p className="text-xs font-mono text-cyan-400 italic font-medium tracking-widest">{settings.siteName} BRAND PHILOSOPHY</p>
            </div>

            {/* Bilingual Statement Block Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-zinc-300 text-justify divide-y md:divide-y-0 md:divide-x divide-zinc-800 pt-6">
              
              <div className="space-y-4 pr-0 md:pr-6">
                <p className="font-bold text-zinc-100 text-base">
                  &lt;{settings.siteName}&gt;는 디자인, 건축, 가구를 예술적 시선과 고요한 호흡으로 아우르는 프리미엄 가치 플랫폼입니다.
                </p>
                <p>
                  {settings.aboutUsText || `매체 그 이상의 소통과 비움을 선사하다. 예술과 공간의 자연스러운 경계에서 ${settings.siteName}은 독창적인 미니멀리즘 시각과 간결한 가치를 통해, 일상 속에서 마주할 수 있는 가장 깊고 아득한 감성의 순간을 선사하고자 합니다.`}
                </p>
              </div>

              <div className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-8 italic font-serif text-zinc-400">
                <p className="font-semibold text-zinc-200">
                  {settings.siteName} beautifully synthesizes architecture, pure design craft, and premium living with people who search for authentic balance.
                </p>
                <p>
                  {settings.siteDesc || "STRUCTURAL HARMONY & MINIMALIST SENTIMENT"}
                </p>
              </div>

            </div>

            {/* Dual Portrait Hero Photo or Video inside about */}
            <div className="space-y-4">
              <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden relative shadow-sm border border-zinc-800 flex items-center justify-center">
                {settings.homepageMediaType === "video" ? (
                  <video 
                    src={settings.homepageMediaUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={settings.homepageMediaUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"} 
                    alt="Roundmag Curation Space"
                    className="w-full h-full object-cover filter saturate-[0.85] brightness-[0.9]"
                  />
                )}
              </div>
              <p className="text-[11px] text-zinc-400 text-center font-serif leading-normal uppercase tracking-widest">
                {settings.siteName} BRAND CURATION EXHIBIT · SYMMETRIC SPACE & OBJECT DIALOGUE
              </p>
            </div>

            {/* Secondary philosophies block */}
            <div className="space-y-6 pt-6 border-t border-zinc-800">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-zinc-100">&lt;{settings.siteName}&gt;는 본연의 아름다움에 주목합니다</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  인위적인 수식을 한 겹 덜어낸 자리, 자연광이 비취어 생겨난 그림자, 가구의 내추럴한 옹이 무늬와 대지의 흙 무늬를 조명합니다. 소모적인 트렌드 소비에서 과감하게 벗어나 오랫동안 향유될 패러다임을 제안합니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-zinc-100">&lt;{settings.siteName}&gt;의 프레임, 예술과 가교가 됩니다</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  우리가 엮어 나가는 웹 아카이브와 디자인 큐레이션 매체는 단순히 하나의 잡지 책을 넘어서, 공간을 사랑하고 매만지는 연출가들과 창작자들의 멋진 생각들을 차분히 잇는 따뜻한 미학적 허브가 될 것입니다.
                </p>
              </div>
            </div>

          </div>
        )}


        {/* ========================================================= */}
        {/* TAB 5: CONTACT VIEW (Screenshot 4 Benchmark)              */}
        {/* ========================================================= */}
        {activeTab === "contact" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 animate-fade-in space-y-12">
            
            <div className="space-y-2 text-center pb-6">
              <h1 className="font-serif text-3xl font-black text-zinc-950 uppercase tracking-[0.12em]">Contact Us</h1>
              <p className="text-xs text-zinc-500 font-serif italic">Let's create something highquality together</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Side: Address particulars (Screenshot 4) */}
              <div className="space-y-8 font-sans">
                
                <div className="bg-zinc-50 p-6 border border-zinc-150">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">HEADQUARTER OFFICE</h3>
                  
                  <div className="space-y-4 text-zinc-700 text-sm">
                    <p className="font-semibold text-zinc-950 text-base">주식회사 프라이데이컴퍼니 (Friday Company)</p>
                    
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-zinc-950 font-medium">서울 성동구 성수이로 66 서울숲 드림타워 408호</p>
                        <p className="text-xs text-zinc-500">408, Seoul Forest Dream Tower, 66 Seongsu-yi-ro, Seongdong-gu, Seoul, Republic of Korea</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4.5 w-4.5 text-zinc-500" />
                      <span>TEL. 02-3444-0331</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Laptop className="h-4.5 w-4.5 text-zinc-500" />
                      <span>URL. www.instagram.com/_roundmag</span>
                    </div>
                  </div>
                </div>

                {/* Specific inquiries portals columns */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pb-1 border-b">Inquiry Direct Contacts</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <div className="bg-zinc-50/50 p-4 border border-zinc-100/85">
                      <p className="text-xs font-bold text-zinc-800">광고 및 취재 문의</p>
                      <a href="mailto:ad@roundmag.co.kr" className="text-[11px] text-zinc-500 font-mono hover:underline hover:text-zinc-950 block mt-1.5 break-all">
                        ad@roundmag.co.kr
                      </a>
                    </div>

                    <div className="bg-zinc-50/50 p-4 border border-zinc-100/85">
                      <p className="text-xs font-bold text-zinc-800">보도자료 문의</p>
                      <a href="mailto:info@roundmag.co.kr" className="text-[11px] text-zinc-500 font-mono hover:underline hover:text-zinc-950 block mt-1.5 break-all">
                        info@roundmag.co.kr
                      </a>
                    </div>

                    <div className="bg-zinc-50/50 p-4 border border-zinc-100/85">
                      <p className="text-xs font-bold text-zinc-800">파트너십 문의</p>
                      <a href="mailto:creator@roundmag.co.kr" className="text-[11px] text-zinc-500 font-mono hover:underline hover:text-zinc-950 block mt-1.5 break-all">
                        creator@roundmag.co.kr
                      </a>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Side: Local Active Inquiries Form */}
              <div className="bg-white p-6 border border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">DIRECT SYSTEM INQUIRY</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">성함 / 담당자명 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: 홍길동 팀장"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full text-sm border border-zinc-200 rounded-sm bg-zinc-50/50 px-3 py-2.5 focus:border-zinc-950 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">이메일 주소 *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="example@yourbrand.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full text-sm border border-zinc-200 rounded-sm bg-zinc-50/50 px-3 py-2.5 focus:border-zinc-950 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">제휴 희망 내용</label>
                    <textarea 
                      rows={4}
                      placeholder="하이컷 디지털 지면 광고 계약, 브랜드 인터뷰 제안, 혹은 협력하고 싶으신 프로모션에 관해 편하게 기재해주십시오."
                      value={contactForm.msg}
                      onChange={(e) => setContactForm({ ...contactForm, msg: e.target.value })}
                      className="w-full text-sm border border-zinc-200 rounded-sm bg-zinc-50/50 px-3 py-2.5 focus:border-zinc-950 focus:outline-none focus:bg-white leading-relaxed font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-950 text-white font-bold tracking-wider text-xs uppercase py-3 rounded hover:bg-zinc-800 transition flex items-center justify-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    문의 제출하기
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </main>


      {/* ========================================================= */}
      {/* FULL SCREEN SEARCH MODAL (Screenshot 5 Benchmark)        */}
      {/* ========================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col p-6 overflow-y-auto animate-fade-in font-sans">
          
          {/* Header row */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-zinc-150">
            <span className="font-serif text-lg font-bold text-zinc-400">ROUNDMAG Digital Finder</span>
            <button 
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-900 transition flex items-center justify-center"
              title="Close search"
              id="search-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Input bar (Benchmark Screenshot 5) */}
          <div className="max-w-3xl mx-auto w-full pt-16 pb-8 space-y-6">
            <div className="relative border-b-2 border-zinc-950 pb-2 flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-2xl md:text-4xl font-bold tracking-wider bg-transparent text-zinc-950 placeholder-zinc-350 outline-none"
              />
              <Search className="h-8 w-8 text-zinc-950 absolute right-1" />
            </div>
            
            <p className="text-xs text-zinc-400">인물명, 커버 정보, 에디토리얼 키워드 등을 기재하여 조명하세요 (예: 쿄카, Cobalt, Fashion)</p>
          </div>

          {/* Search Result outputs */}
          <div className="max-w-3xl mx-auto w-full flex-grow">
            {searchQuery.trim() ? (
              <div className="space-y-8 pb-12">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <span>총 <strong className="text-zinc-900">{totalSearchResults}</strong>개의 검색 결과</span>
                  <button onClick={() => setSearchQuery("")} className="underline hover:text-zinc-900">클리어</button>
                </div>

                {/* Matched stories */}
                {filteredStories.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Cover & Highlight stories ({filteredStories.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredStories.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => {
                            setSelectedStory(s);
                            setSearchOpen(false);
                          }}
                          className="flex gap-3 bg-zinc-50 p-3 border border-zinc-100/90 rounded hover:border-zinc-300 transition cursor-pointer"
                        >
                          <img src={s.imageUrl} alt={s.title} className="w-16 h-16 object-cover bg-zinc-200" />
                          <div className="overflow-hidden">
                            <span className="text-[8px] bg-zinc-200 font-bold tracking-widest text-zinc-800 px-1 py-0.5 rounded uppercase">{s.c}</span>
                            <h4 className="font-serif text-sm font-bold text-zinc-900 truncate mt-1">{s.title}</h4>
                            <p className="text-xs text-zinc-500 truncate">{s.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched news items */}
                {filteredNews.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Latest News items ({filteredNews.length})</h3>
                    <div className="space-y-2">
                      {filteredNews.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setSelectedNews(item);
                            setSearchOpen(false);
                          }}
                          className="flex items-center gap-3 bg-zinc-50/50 p-2 border hover:border-zinc-200 transition cursor-pointer"
                        >
                          <img src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80"} alt={item.t} className="w-10 h-10 object-cover" />
                          <div className="truncate">
                            <span className="text-[8px] border border-zinc-300 text-zinc-500 font-bold px-1 rounded uppercase mr-1.5">{item.c}</span>
                            <span className="font-serif text-xs font-medium text-zinc-800 hover:underline">{item.t}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {totalSearchResults === 0 && (
                  <div className="text-center py-20 text-zinc-400">
                    "{searchQuery}"에 일치하는 에디토리얼 컨텐츠를 찾지 못했습니다. <br />
                    다른 핵심 키워드를 기입해 주십시오.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-300 italic font-serif">검색어를 입력하시면 일치 여부를 즉시 투영합니다.</div>
            )}
          </div>

        </div>
      )}


      {/* ========================================================= */}
      {/* 2. TRADITIONAL LOGIN MODAL OVERLAY (Screenshot 7 Benchmark) */}
      {/* ========================================================= */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-zinc-950 text-zinc-150 border border-cyan-500/30 rounded-none w-full max-w-[400px] shadow-[0_0_25px_rgba(6,182,212,0.15)] relative animate-scale-up" id="login-modal-window">
            
            {/* HUD Scan corner highlights */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Header style "ACCESS CORE DECRYPT" and close */}
            <div className="flex items-center justify-between border-b border-zinc-900 px-6 py-5">
              <div className="flex flex-col">
                <span className="font-mono font-bold text-xs text-cyan-400 tracking-widest uppercase">SECURE LINK CONSOLE</span>
                <span className="font-serif font-black text-lg text-white tracking-wide uppercase">ACCESS KEY LOG</span>
              </div>
              <button 
                onClick={() => {
                  playTechBeep(800, 0.05, "sine");
                  setLoginOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-cyan-400 transition cursor-pointer"
                id="login-close-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Login inputs */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-mono uppercase text-cyan-500/75 tracking-widest mb-1">// IDENTITY KEY (EMAIL)</label>
                  <input 
                    type="text" 
                    placeholder="E-mail Address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full text-xs font-mono border border-zinc-900 p-3.5 rounded-none bg-zinc-900/60 text-white focus:bg-zinc-950 focus:border-cyan-500 focus:outline-none transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-[9px] font-mono uppercase text-cyan-500/75 tracking-widest mb-1">// DECRYPT SEQUENCE (PIN)</label>
                  <input 
                    type="password"
                    required
                    placeholder="Access Code (Admin PIN: 1234)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs font-mono border border-zinc-900 p-3.5 rounded-none bg-zinc-900/60 text-white focus:bg-zinc-950 focus:border-cyan-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Login State checkbox */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 font-mono">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-cyan-500 bg-zinc-900 border-zinc-800"
                  />
                  <span className="text-[10px] tracking-wide text-zinc-400">REMEMBER CONSOLE STATE</span>
                </label>
                <span className="hover:text-cyan-400 text-[10px] cursor-pointer">RESET CONSOLE</span>
              </div>

              {/* Action standard login button */}
              <button
                type="submit"
                onClick={() => playTechBeep(1200, 0.1, "sine")}
                className="w-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-405 text-cyan-300 hover:text-white font-mono font-bold text-xs tracking-widest uppercase py-4 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                DECRYPT ENTRY
              </button>

              {/* Helper joins text */}
              <div className="text-center text-xs text-zinc-500 pt-3 border-t border-zinc-900 mt-2 font-mono text-[10px]">
                SECURE ACCESS REQUEST · NO TOKEN RECORDED? <span className="text-cyan-400 font-bold hover:underline cursor-pointer ml-1">REGISTER CONSOLE</span>
              </div>

              {/* Password notice overlay */}
              <div className="bg-cyan-950/20 border border-cyan-500/10 p-3 text-[10px] text-cyan-400/80 text-center leading-normal font-mono">
                NOTICE: 비밀번호 필드에 <strong>1234</strong>를 입력하시면, 매거진 에디토리얼 업로드 관리자 권한이 활성화됩니다.
              </div>

            </form>

          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* IMMERSIVE DETAILED ARTICLE READER MODALS DEFAULT VIEWS   */}
      {/* ========================================================= */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-zinc-950 text-zinc-100 border border-zinc-900 w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-scale-up relative">
            
            {/* Left Column covers photo image */}
            <div className="relative md:w-1/2 h-44 md:h-full bg-zinc-900 flex-shrink-0 select-none">
              <img src={selectedStory.imageUrl} alt={selectedStory.title} className="w-full h-full object-cover filter saturate-90 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-cyan-900/90 text-cyan-300 border border-cyan-400/20 text-[9px] font-mono tracking-widest px-2.5 py-1 font-bold uppercase shadow">
                {selectedStory.c}
              </div>
            </div>

            {/* Right Column: Scrollable editorial content */}
            <div className="flex-grow overflow-y-auto p-5 sm:p-8 md:p-12 flex flex-col justify-between bg-zinc-950/90 backdrop-blur-xl">
              
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <span className="text-xs font-mono text-zinc-400 tracking-wider font-bold">// ROUNDMAG SEC-DECRYPT · ISSUE 0{selectedStory.num}</span>
                  <button 
                    onClick={() => {
                      playTechBeep(800, 0.05, "sine");
                      setSelectedStory(null);
                    }} 
                    className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-300 font-mono tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 uppercase inline-block">{selectedStory.c}</span>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
                    {selectedStory.title}
                  </h2>
                  <p className="text-base sm:text-lg italic font-serif text-zinc-300 border-l-2 border-zinc-500 pl-4 py-2 bg-zinc-900/40">
                    {selectedStory.sub}
                  </p>
                </div>

                <p className="text-zinc-200 text-justify text-[15px] sm:text-[17px] md:text-[18px] leading-relaxed md:leading-loose break-all whitespace-pre-wrap font-sans border-t border-zinc-900 pt-6">
                  {selectedStory.content || "상세한 매거진 에디토리얼 단독 글이 곧 발행됩니다. 잠시만 가라앉은 사색의 핏을 기대해 주십시오."}
                </p>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-zinc-900 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      playTechBeep(2100, 0.05, "triangle");
                      toggleLike(selectedStory.id, e);
                    }}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 transition outline-none cursor-pointer font-mono"
                  >
                    <Heart className={`h-4.5 w-4.5 ${likedStories.includes(selectedStory.id) ? "fill-red-500 text-red-500 stroke-red-500" : ""}`} />
                    <span>{likedStories.includes(selectedStory.id) ? "LOVED ARCHIVE" : "SAVE TO LOCAL HOST"}</span>
                  </button>
                  <span className="text-zinc-800">|</span>
                  <span className="text-zinc-500 font-mono">
                    {new Date(selectedStory.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <div className="flex gap-2">
                  {adminToken === "1234" && (
                    <button
                      onClick={() => {
                        playTechBeep(600, 0.15, "sawtooth");
                        if (confirm(`'${selectedStory.title}' 스토리를 매거진에서 삭제하시겠습니까?`)) {
                          handleDeleteStory(selectedStory.id);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-red-400 text-xs font-mono font-bold transition cursor-pointer"
                    >
                      Delete (Admin)
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      playTechBeep(800, 0.05, "sine");
                      setSelectedStory(null);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-805 text-zinc-300 hover:text-white border border-zinc-800 hover:border-cyan-500/30 px-5 py-2.5 transition text-xs font-mono tracking-wider cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* NEWS ITEM MODAL DETAIL READER OVERLAY */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-zinc-950 text-zinc-100 border border-zinc-900 rounded-none w-full max-w-xl p-6 sm:p-8 shadow-2xl relative animate-scale-up">
            
            <button 
              onClick={() => {
                playTechBeep(800, 0.05, "sine");
                setSelectedNews(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <span className="text-xs text-zinc-300 font-bold bg-zinc-900 border border-zinc-800 px-3 py-1 uppercase font-mono">
                  {selectedNews.c}
                </span>
                <span className="text-xs text-zinc-500 font-mono">// SIGNAL RE-ROUTE : {new Date(selectedNews.createdAt).toLocaleDateString()}</span>
              </div>

              {selectedNews.imageUrl && (
                <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden border border-zinc-900">
                  <img src={selectedNews.imageUrl} alt={selectedNews.t} className="w-full h-full object-cover filter saturate-90 brightness-90" />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight">
                  {selectedNews.t}
                </h3>
                {selectedNews.sub && (
                  <p className="text-sm italic font-serif text-zinc-300 border-l-2 border-zinc-500 pl-3">{selectedNews.sub}</p>
                )}
              </div>

              <div className="text-sm sm:text-base text-zinc-300 leading-relaxed space-y-4 font-sans pt-4 border-t border-zinc-900">
                <p>본 기사는 라운드매그 디지털 에디토리얼을 통해 취재 및 기획된 공간 뉴스입니다.</p>
                <p>공간을 구성하는 사물들과 예술적인 미학을 매개로 제작된 상세 큐레이션은 ROUNDMAG 매거진 리포트를 통해 감상해 보실 수 있습니다.</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-900 gap-2">
                {adminToken === "1234" && (
                  <button
                    onClick={() => {
                      playTechBeep(650, 0.15, "sawtooth");
                      if (confirm(`'${selectedNews.t}' 뉴스를 정말로 완전 삭제하시겠습니까?`)) {
                        handleDeleteNews(selectedNews.id);
                      }
                    }}
                    className="px-3 py-1.5 text-red-400 hover:underline text-xs font-mono font-bold mr-auto cursor-pointer"
                  >
                    DELETE SIGNAL
                  </button>
                )}
                
                <button
                  onClick={() => {
                    playTechBeep(800, 0.05, "sine");
                    setSelectedNews(null);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-mono px-5 py-2 cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>

          </div>
        </div>
      )}



      {/* ========================================================= */}
      {/* FULL-STACK INTERACTIVE ADMIN WORKSPACE OVERLAY COMPONENT */}
      {/* ========================================================= */}
      <AdminPanel 
        stories={stories}
        news={news}
        adminToken={adminToken}
        settings={settings}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onAddStory={handleAddStory}
        onDeleteStory={handleDeleteStory}
        onAddNews={handleAddNews}
        onDeleteNews={handleDeleteNews}
        onSaveSettings={handleSaveSettings}
      />





      {/* FOOTER: pitch-black block spanning full width (Screenshot 1: bottom) */}
      <footer className="bg-zinc-950 text-white pt-16 pb-12 mt-20 border-t border-zinc-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Left Block: Company Name */}
            <div className="space-y-4">
              <div className="font-serif text-2xl font-black tracking-widest text-white flex items-center gap-1 cursor-pointer" onClick={() => handleTabClick("home")}>
                {settings.siteName}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs font-sans">
                예술과 공간, 라이프스타일의 깊이 있는 영감을 기록하는 프리미엄 디지털 매거진 {settings.siteName}.
                <span className="block mt-1.5 text-zinc-500 italic font-medium">{settings.siteDesc}</span>
              </p>
            </div>

            {/* Middle links */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Links & Menu</h5>
              <ul className="text-xs text-zinc-300 space-y-2.5">
                <li><button onClick={() => handleTabClick("original")} className="hover:text-white transition">Original Grid</button></li>
                <li><button onClick={() => handleTabClick("about")} className="hover:text-white transition">About Us</button></li>
                <li><button onClick={() => handleTabClick("contact")} className="hover:text-white transition">Contact inquiries</button></li>
                {adminToken && (
                  <li>
                    <span className="text-cyan-400 text-[10px] font-bold tracking-wider uppercase font-mono">
                      ● ADMIN WORKSPACE ENABLED
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Inquiry Contacts details (Screenshot 4 Contacts) */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Partnership</h5>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li><a href="mailto:ad@roundmag.co.kr" className="hover:text-white block font-mono">광고: ad@roundmag.co.kr</a></li>
                <li><a href="mailto:info@roundmag.co.kr" className="hover:text-white block font-mono">제휴: info@roundmag.co.kr</a></li>
                <li><a href="mailto:creator@roundmag.co.kr" className="hover:text-white block font-mono">파트너십: creator@roundmag.co.kr</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Digital Newsletter</h5>
              <div className="flex gap-1.5 max-w-xs">
                <input 
                  type="email" 
                  placeholder="E-mail Address" 
                  className="rounded-none bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-500 w-full"
                />
                <button 
                  onClick={() => alert(`${settings.siteName} 뉴스레터 구독 신청이 완료되었습니다! 최신 큐레이션 리포트를 주기적으로 기재해 전해 드리겠습니다.`)}
                  className="bg-white text-zinc-950 px-4 py-2 text-xs font-bold hover:bg-zinc-200 transition"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright columns */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-zinc-900 pt-8 mt-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-6">
              {settings.snsInstagram && (
                <a href={settings.snsInstagram} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition flex items-center gap-1">
                  <span>공식 인스타그램</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {settings.snsYoutube && (
                <a href={settings.snsYoutube} target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition flex items-center gap-1">
                  <span>공식 유튜브</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <span className="hover:text-zinc-300 transition cursor-pointer">이용약관</span>
              <span className="hover:text-zinc-300 transition cursor-pointer">개인정보처리방침</span>
              <span onClick={() => {
                const element = document.getElementById("admin-trigger-btn");
                if (element) {
                  element.click();
                } else {
                  handleTabClick("admin");
                }
              }} className="hover:text-zinc-300 transition cursor-pointer">관리자콘솔</span>
            </div>
            
            <div className="text-right space-y-1">
              <p>© 2026 {settings.siteName} Corp. All Rights Reserved.</p>
              <p className="text-[10px] text-zinc-500 font-sans">
                주식회사 프라이데이컴퍼니  ·  대표: 박준희  ·  사업자등록번호: 152-88-00989  ·  주소: 서울 성동구 성수이로 66, 408호
              </p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
