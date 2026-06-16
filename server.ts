import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Dynamic DB files inside user directory to persist items across sessions
const parentDataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(parentDataDir)) {
  fs.mkdirSync(parentDataDir, { recursive: true });
}

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storiesFile = path.join(parentDataDir, "stories.json");
const newsFile = path.join(parentDataDir, "news.json");

// Initial/Seed Data
const initialStories = [
  {
    id: "story-1",
    num: "01",
    title: "Symmetry & Silence",
    sub: "구조적 공간과 선이 만들어내는 미니멀리즘의 정수",
    c: "Architecture",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    content: "바쁜 도심 속에서 비움의 가치를 실천하는 성수동의 한 주거 공간을 찾았습니다. 콘크리트와 따뜻한 나무 톤이 조화롭게 교차하며 연출하는 감각적인 공간의 리듬감. 프라이데이컴퍼니가 소개하는 _roundmag의 시그니처 큐레이션 시리즈.",
    createdAt: new Date("2026-06-10T12:00:00Z").toISOString(),
  },
  {
    id: "story-2",
    num: "02",
    title: "Minimal Sculpture",
    sub: "흙과 불이 자아내는 오가닉 텍스처와 오브제의 아름다움",
    c: "Art & Craft",
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
    content: "손가락 끝 마디마디의 미세한 압력과 불의 우연성이 결합하여 탄생한 단 하나의 세라믹 오브제. 장식적인 기교를 일절 배제하여 본질적인 실루엣과 태생적인 비대칭성만을 담아낸 공예 작품의 시적인 내러티브입니다.",
    createdAt: new Date("2026-06-11T12:00:00Z").toISOString(),
  },
  {
    id: "story-3",
    num: "03",
    title: "Bauhaus Legacies",
    sub: "시간을 거스르는 철제 프레임과 가죽의 간결한 직조",
    c: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80",
    content: "1920년대 바이마르 데사우의 모던한 실험 정신은 백년이 흘러 오늘의 다이닝 테이블 앞에서도 고귀한 비례감으로 증명됩니다. 크롬 도금 스틸 튜브가 그리는 우아한 외곡선과 오랜 세월을 기억하는 가죽의 유연함.",
    createdAt: new Date("2026-06-12T10:00:00Z").toISOString(),
  },
  {
    id: "story-4",
    num: "04",
    title: "Chiaroscuro Light",
    sub: "공간의 온도를 맑게 정화하는 빛과 한 뼘의 따뜻한 음영",
    c: "Design Object",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    content: "황혼 무렵, 작은 촛불처럼 은은하게 번지는 탁상 조명의 불빛은 공간을 치유하는 힘이 있습니다. 그림자의 길이에 따라 섬세하게 부각되는 오브제의 입체감과 한낮에는 보이지 않던 벽면의 섬세한 질감.",
    createdAt: new Date("2026-06-12T14:00:00Z").toISOString(),
  },
  {
    id: "story-5",
    num: "05",
    title: "Slow Living Table",
    sub: "나만의 속도로 머무는 고요한 서재 한편의 감도 높은 기록",
    c: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=1200&q=80",
    content: "따뜻한 커피 한 잔과 차분히 인쇄된 매거진. 테이블 위에 무심코 얹어진 무광 세라믹 화병과 사각거리는 노트 연필이 일깨우는 지적인 휴식. 복잡한 생각들을 정갈하게 비울 수 있는 정서적 안식처의 탐색.",
    createdAt: new Date("2026-06-12T18:00:00Z").toISOString(),
  },
  {
    id: "story-6",
    num: "06",
    title: "Ambient Warmth",
    sub: "오가닉 린넨 패브릭과 햇살이 만나 빚어내는 아득한 풍경",
    c: "Space Look",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    content: "기교 없는 순백의 린넨이 주는 시각적인 해방감. 바람결에 잔잔하게 일렁이는 커튼 아래로 스며드는 부드러운 자연광. 휴식과 사색의 농도를 깊고 투명하게 무르익게 하는 내추럴한 침실 인테리어.",
    createdAt: new Date("2026-06-13T01:00:00Z").toISOString(),
  },
  {
    id: "story-7",
    num: "07",
    title: "Curated Cozy Corner",
    sub: "비워진 벽면 위에 그려 넣는 가구와 식물의 서정적 하모니",
    c: "Plant & Object",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    content: "식물 잎새 하나가 남기는 그림자와 우드 캐비닛의 나이테 무늬가 만들어내는 지극히 감성적인 조화. 기하학적 형태의 모빌이 그리는 미세한 회전은 침묵으로 가득 차 있던 거실의 한편을 조용한 미술관으로 변화시킵니다.",
    createdAt: new Date("2026-06-13T02:40:00Z").toISOString(),
  }
];

const initialNews = [
  {
    id: "news-1",
    c: "Art Object",
    t: "오브제가 지니는 내러티브와 미니멀 예술의 만남",
    sub: "공간을 가득 채우는 작은 세라믹 공예품들의 독창적 세계관",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-13T02:00:00Z").toISOString(),
  },
  {
    id: "news-2",
    c: "Interior Setup",
    t: "공간의 온도를 새롭게 변경하는 감도 높은 테이블 조명",
    sub: "황홀한 간접 조명과 미학적 실루엣으로 디자인된 시크 램프",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-12T21:00:00Z").toISOString(),
  },
  {
    id: "news-3",
    c: "Earth Craft",
    t: "자연의 아름다움을 그대로 투영한 세라믹 디자인 공예",
    sub: "전통 기법에 혁신적 시각을 더해 일상 속 비움을 선사하다",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-12T15:00:00Z").toISOString(),
  },
  {
    id: "news-4",
    c: "Design Furniture",
    t: "가구 디자인의 새로운 트렌드: 선과 리듬의 해체주의",
    sub: "건축가들과 공간 기획자들이 극찬한 미적 가구 오브제 컬렉션",
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-11T18:00:00Z").toISOString(),
  },
  {
    id: "news-5",
    c: "Sensory Cafe",
    t: "조용히 머무르기 좋은 성수동 감성 공간 서제",
    sub: "바쁜 발걸음을 멈추고 온전히 혼자 감상하는 예술 공간 리스트",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-10T14:30:00Z").toISOString(),
  },
  {
    id: "news-6",
    c: "Texture Weave",
    t: "클래식을 트위스트하는 서정적인 직조 공예 스튜디오",
    sub: "핸드 크래프트 텍스타일과 우드 요소로 연출하는 편안한 일상",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date("2026-06-09T09:00:00Z").toISOString(),
  }
];

// Helper to read and write database
function loadStories() {
  if (!fs.existsSync(storiesFile)) {
    fs.writeFileSync(storiesFile, JSON.stringify(initialStories, null, 2), "utf-8");
    return initialStories;
  }
  try {
    const raw = fs.readFileSync(storiesFile, "utf-8");
    const data = JSON.parse(raw);
    if (data.some((s: any) => s.title === "The Cobalt Hour" || s.title === "Aesthetic Equilibrium" || !s.title.includes("Symmetry"))) {
      fs.writeFileSync(storiesFile, JSON.stringify(initialStories, null, 2), "utf-8");
      return initialStories;
    }
    return data;
  } catch (e) {
    console.error("Error reading stories db", e);
    return initialStories;
  }
}

function saveStories(stories: any[]) {
  fs.writeFileSync(storiesFile, JSON.stringify(stories, null, 2), "utf-8");
}

function loadNews() {
  if (!fs.existsSync(newsFile)) {
    fs.writeFileSync(newsFile, JSON.stringify(initialNews, null, 2), "utf-8");
    return initialNews;
  }
  try {
    const raw = fs.readFileSync(newsFile, "utf-8");
    const data = JSON.parse(raw);
    if (data.some((n: any) => n.t && (n.t.indexOf("무엇을 입는가") > -1 || n.id === "news-1" && n.t !== "오브제가 지니는 내러티브와 미니멀 예술의 만남"))) {
      fs.writeFileSync(newsFile, JSON.stringify(initialNews, null, 2), "utf-8");
      return initialNews;
    }
    return data;
  } catch (e) {
    console.error("Error reading news db", e);
    return initialNews;
  }
}

function saveNews(news: any[]) {
  fs.writeFileSync(newsFile, JSON.stringify(news, null, 2), "utf-8");
}

// REST API endpoints

// Static serving for custom directory to ensure uploads are persistent
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// GET all stories
app.get("/api/stories", (req, res) => {
  const data = loadStories();
  res.json(data);
});

// POST simple Base64 image upload
app.post("/api/upload-base64", (req, res) => {
  try {
    const { filename, base64Data, adminToken } = req.body;
    
    // Simple password validation (can be customized, default "1234")
    if (adminToken !== "1234" && adminToken !== process.env.ADMIN_PIN) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (!filename || !base64Data) {
      return res.status(400).json({ error: "Missing filename or base64Data" });
    }

    // Strip base64 metadata headers if present (e.g., "data:image/png;base64,...")
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let actualFilename = filename;

    if (matches && matches.length === 3) {
      const ext = matches[1].split('/')[1] || 'jpg';
      actualFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(base64Data, "base64");
    }

    fs.writeFileSync(path.join(uploadsDir, actualFilename), buffer);
    res.json({ imageUrl: `/uploads/${actualFilename}` });
  } catch (error: any) {
    console.error("Upload error", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

// POST add normal digital story
app.post("/api/stories", (req, res) => {
  const { title, sub, c, imageUrl, content, adminToken } = req.body;
  if (adminToken !== "1234" && adminToken !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  if (!title || !c || !imageUrl) {
    return res.status(400).json({ error: "Missing required story fields" });
  }

  const stories = loadStories();
  
  // Format story sequence order number
  const nextNum = String(stories.length + 1).padStart(2, "0");

  const newStory = {
    id: `story-${Date.now()}`,
    num: nextNum,
    title,
    sub: sub || "",
    c,
    imageUrl,
    content: content || "",
    createdAt: new Date().toISOString()
  };

  stories.push(newStory);
  saveStories(stories);
  res.status(201).json(newStory);
});

// DELETE a story
app.delete("/api/stories/:id", (req, res) => {
  const { id } = req.params;
  const { adminToken } = req.body;
  if (adminToken !== "1234" && adminToken !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  let stories = loadStories();
  const exists = stories.find(s => s.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Story not found" });
  }

  stories = stories.filter(s => s.id !== id);
  
  // Re-adjust numbers (num: 01, 02, etc) dynamically
  stories.forEach((story, index) => {
    story.num = String(index + 1).padStart(2, "0");
  });

  saveStories(stories);
  res.json({ message: "Story deleted", id });
});

// GET all News items
app.get("/api/news", (req, res) => {
  const data = loadNews();
  res.json(data);
});

// POST add news item
app.post("/api/news", (req, res) => {
  const { c, t, sub, adminToken } = req.body;
  if (adminToken !== "1234" && adminToken !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!c || !t) {
    return res.status(400).json({ error: "Missing news category or title" });
  }

  const news = loadNews();
  const newItem = {
    id: `news-${Date.now()}`,
    c,
    t,
    sub: sub || "",
    createdAt: new Date().toISOString()
  };

  news.unshift(newItem); // Insert at beginning so "Latest" loads first
  saveNews(news);
  res.status(201).json(newItem);
});

// DELETE a news item
app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params;
  const { adminToken } = req.body;
  if (adminToken !== "1234" && adminToken !== process.env.ADMIN_PIN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let news = loadNews();
  const exists = news.find(n => n.id === id);
  if (!exists) {
    return res.status(404).json({ error: "News item not found" });
  }

  news = news.filter(n => n.id !== id);
  saveNews(news);
  res.json({ message: "News deleted", id });
});

// POST auth validating simple admin pin
app.post("/api/auth", (req, res) => {
  const { pin } = req.body;
  const targetPin = process.env.ADMIN_PIN || "1234";
  if (pin === targetPin) {
    return res.json({ success: true, token: targetPin });
  }
  res.status(401).json({ success: false, error: "Incorrect administrator PIN password." });
});

// Vite Middleware for development OR public serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ROUNDMAG full-stack server listening on http://localhost:${PORT}`);
  });
}

startServer();
