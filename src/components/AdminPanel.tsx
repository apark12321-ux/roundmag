import React, { useState, useRef } from "react";
import { Story, NewsItem } from "../types";
import { Lock, FileText, Image, Plus, Trash2, X, UploadCloud, Check, Key } from "lucide-react";

interface AdminPanelProps {
  stories: Story[];
  news: NewsItem[];
  adminToken: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
  onAddStory: (story: Omit<Story, "id" | "num" | "createdAt">) => Promise<void>;
  onDeleteStory: (id: string) => Promise<void>;
  onAddNews: (news: Omit<NewsItem, "id" | "createdAt">) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
}

export default function AdminPanel({
  stories,
  news,
  adminToken,
  onLogin,
  onLogout,
  onAddStory,
  onDeleteStory,
  onAddNews,
  onDeleteNews,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  
  // Tabs: "story" | "news" | "list"
  const [activeTab, setActiveTab] = useState<"story" | "news" | "list">("story");

  // New Story Form State
  const [storyTitle, setStoryTitle] = useState("");
  const [storySub, setStorySub] = useState("");
  const [storyCategory, setStoryCategory] = useState("Cover");
  const [storyContent, setStoryContent] = useState("");
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // New News Form State
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSub, setNewsSub] = useState("");
  const [newsCategory, setNewsCategory] = useState("Fashion");
  const [newsImageUrl, setNewsImageUrl] = useState("");
  const [isNewsUploading, setIsNewsUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [newsDragActive, setNewsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newsFileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Cover", "Editorial", "Fashion", "Beauty", "Lifestyle", "Interview"];

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLogin(data.token);
        setPin("");
      } else {
        setPinError(data.error || "비밀번호가 일치하지 않습니다. (기본 PIN: 1234)");
      }
    } catch (err) {
      setPinError("서버와의 통신에 실패했습니다.");
    }
  };

  // Convert and upload file to base64 API (Supports both Stories and News images)
  const handleFileUpload = async (file: File, isForNews: boolean = false) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (isForNews) {
      setIsNewsUploading(true);
    } else {
      setIsUploading(true);
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      try {
        const response = await fetch("/api/upload-base64", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            adminToken: adminToken,
          }),
        });

        const data = await response.json();
        if (response.ok && data.imageUrl) {
          if (isForNews) {
            setNewsImageUrl(data.imageUrl);
          } else {
            setStoryImageUrl(data.imageUrl);
          }
        } else {
          alert(data.error || "이미지 업로드에 실패했습니다. (1234 PIN 로그인이 필요합니다)");
        }
      } catch (error) {
        alert("서버 연결에 실패하여 이미지를 업로드하지 못했습니다.");
      } finally {
        if (isForNews) {
          setIsNewsUploading(false);
        } else {
          setIsUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop events for Cover Story
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0], false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0], false);
    }
  };

  // Drag and drop events for News items
  const handleNewsDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setNewsDragActive(true);
    } else if (e.type === "dragleave") {
      setNewsDragActive(false);
    }
  };

  const handleNewsDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0], true);
    }
  };

  const handleNewsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0], true);
    }
  };

  const handleCreateStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyImageUrl) {
      alert("제목과 이미지는 필수 항목입니다.");
      return;
    }

    try {
      await onAddStory({
        title: storyTitle,
        sub: storySub,
        c: storyCategory,
        imageUrl: storyImageUrl,
        content: storyContent,
      });

      // Reset Form fields
      setStoryTitle("");
      setStorySub("");
      setStoryCategory("Cover");
      setStoryContent("");
      setStoryImageUrl("");
      alert("스토리가 라이브 매거진에 신속하게 반영되었습니다!");
    } catch (err: any) {
      alert(err.message || "스토리 등록 오류");
    }
  };

  const handleCreateNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle) {
      alert("뉴스 제목을 입력해 주세요.");
      return;
    }

    try {
      await onAddNews({
        c: newsCategory,
        t: newsTitle,
        sub: newsSub,
        imageUrl: newsImageUrl || undefined,
      });

      setNewsTitle("");
      setNewsSub("");
      setNewsCategory("Fashion");
      setNewsImageUrl("");
      alert("최신 뉴스피드가 등록되었습니다.");
    } catch (err: any) {
      alert(err.message || "기사 등록 오류");
    }
  };

  return (
    <>
      {/* Admin Floating Access Trigger Button - Styled discretely */}
      <button
        id="admin-trigger-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-white shadow-xl hover:bg-zinc-800 active:scale-95 transition-all outline-none"
        title="Admin Content Manager"
      >
        <Lock className="h-4.5 w-4.5" />
      </button>

      {/* Admin Central Drawer / Panel Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-md border border-zinc-200 bg-white p-6 shadow-2xl md:p-8 text-zinc-900" id="admin-workspace">
            
            {/* Header style resembling "imweb" config layout (Screenshot 8) */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-zinc-900 text-white p-1.5 rounded">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-black text-zinc-950 tracking-wider">ROUNDMAG 관리자 콘솔</h2>
                  <p className="text-[10px] text-zinc-400">ROUNDMAG PREMIUM CONTENT SYSTEM ADMIN</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Login Overlay if not Authenticated as admin (Tokens are initialized) */}
            {(!adminToken || adminToken === "normal-subscriber") ? (
              <div className="py-12 text-center space-y-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-800">
                  <Key className="h-5 w-5" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900">Administrator Console Login</h3>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                    본 채널은 하이컷 공식 라이브 기사를 직접 등록/삭제할 수 있는 등 통제용 게이트웨이입니다. 보안 PIN을 기입해 주십시오. (기본값: 1234)
                  </p>
                </div>

                <form onSubmit={handlePinSubmit} className="mx-auto max-w-xs space-y-4">
                  <input
                    type="password"
                    placeholder="PIN Code"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full text-sm border border-zinc-250 bg-zinc-50 px-4 py-3 text-center tracking-widest text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none"
                    required
                  />
                  {pinError && <p className="text-xs text-red-500 font-semibold">{pinError}</p>}
                  
                  <button
                    type="submit"
                    className="w-full text-xs font-bold uppercase rounded-sm tracking-widest bg-zinc-950 py-3 text-white transition hover:bg-zinc-805 hover:bg-zinc-850"
                  >
                    관리 권한 인증하기
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Navigation inside Admin Panel */}
                <div className="flex gap-1.5 border-b pb-3 mb-6 overflow-x-auto scrollbar-none whitespace-nowrap pr-2 items-center flex-nowrap scroll-smooth">
                  <button
                    onClick={() => setActiveTab("story")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all shrink-0 ${
                      activeTab === "story" ? "bg-zinc-950 text-white" : "text-zinc-550 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <Image className="h-3.5 w-3.5" />
                    Cover Story 등록
                  </button>
                  <button
                    onClick={() => setActiveTab("news")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all shrink-0 ${
                      activeTab === "news" ? "bg-zinc-950 text-white" : "text-zinc-550 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    뉴스피드 등록
                  </button>
                  <button
                    onClick={() => setActiveTab("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all shrink-0 ${
                      activeTab === "list" ? "bg-zinc-950 text-white" : "text-zinc-550 hover:bg-zinc-50 hover:text-zinc-950"
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    원고 관리 ({stories.length + news.length})
                  </button>
                  
                  <button
                    onClick={onLogout}
                    className="ml-auto px-3 py-1.5 text-xs uppercase font-bold tracking-wider text-red-500 hover:bg-red-50 rounded-sm transition shrink-0"
                  >
                    로그아웃
                  </button>
                </div>

                <div className="max-h-[55vh] overflow-y-auto pr-2">
                  
                  {/* TAB 1: STORY FORM */}
                  {activeTab === "story" && (
                    <form onSubmit={handleCreateStorySubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">스토리/커버 제목 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: 성한빈 X COVERNAT"
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            className="w-full text-sm rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">지면 카테고리 *</label>
                          <select
                            value={storyCategory}
                            onChange={(e) => setStoryCategory(e.target.value)}
                            className="w-full text-sm rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">부제목 / 서브 타이틀 *</label>
                        <input
                          type="text"
                          required
                          placeholder="예: 푸른빛이 머문 이번 시즌, 기하학적인 실루엣의 찬란한 전지 하이라이트"
                          value={storySub}
                          onChange={(e) => setStorySub(e.target.value)}
                          className="w-full text-sm rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                        />
                      </div>

                      {/* Cover image drag/drop base64 component */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">스토리 고화질 대표 이미지 *</label>
                        
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`group relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                            dragActive
                              ? "border-zinc-950 bg-zinc-50"
                              : storyImageUrl
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-zinc-250 hover:border-zinc-950 hover:bg-zinc-50/50"
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          {storyImageUrl ? (
                            <div className="flex flex-col items-center">
                              <Check className="h-6 w-6 text-emerald-500 mb-1" />
                              <p className="text-xs font-bold text-emerald-600">이미지가 업로드되었습니다.</p>
                              <img
                                src={storyImageUrl}
                                alt="Upload Preview"
                                className="mt-2 h-20 w-16 object-cover border shadow-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <UploadCloud className={`mb-2 h-7 w-7 text-zinc-400 group-hover:text-zinc-950 ${isUploading ? "animate-pulse" : ""}`} />
                              <p className="text-xs font-bold text-zinc-800">
                                {isUploading ? "이미지를 분석하여 업로드 중..." : "컴퓨터에서 이미지 드래그&드롭 또는 클릭"}
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG 고사양 파일 대응</p>
                            </>
                          )}
                        </div>

                        {/* Direct URL input fallback */}
                        <div className="mt-2 text-left">
                          <p className="text-[10px] text-zinc-400 mb-1">또는, 원격 서버 이미지 주소(URL)를 직접 기입하셔도 통용됩니다:</p>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/your-image-url..."
                            value={storyImageUrl}
                            onChange={(e) => setStoryImageUrl(e.target.value)}
                            className="w-full text-xs rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 focus:border-zinc-950 focus:outline-none text-zinc-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">매거진 심층 인터뷰 / 디테일 본문</label>
                        <textarea
                          placeholder="뷰티 및 패션 화보 상세 설명, 아티스트 딥 인터뷰 본문 등을 편하고 유려하게 작성해 주십시오."
                          value={storyContent}
                          onChange={(e) => setStoryContent(e.target.value)}
                          rows={4}
                          className="w-full text-sm rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none font-serif leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase py-3.5 tracking-wider transition disabled:opacity-50"
                      >
                        스토리 발행 및 라이브 게시
                      </button>

                    </form>
                  )}

                  {/* TAB 2: NEWS FORM (Supports Thumbnails now!) */}
                  {activeTab === "news" && (
                    <form onSubmit={handleCreateNewsSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">카테고리 분류 *</label>
                          <select
                            value={newsCategory}
                            onChange={(e) => setNewsCategory(e.target.value)}
                            className="w-full text-sm rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                          >
                            {["Interview", "Beauty", "Fashion", "Culture", "Place", "Lifestyle"].map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">뉴스 헤드라인 제목 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: 파리에서 펼쳐진 2026 FW 컬렉션 리뷰"
                            value={newsTitle}
                            onChange={(e) => setNewsTitle(e.target.value)}
                            className="w-full text-sm rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">요약문 / 한 줄 픽 *</label>
                        <input
                          type="text"
                          required
                          placeholder="예: 더 과감해진 구조주의 실루엣과 리사이클 오트쿠튀르의 도래"
                          value={newsSub}
                          onChange={(e) => setNewsSub(e.target.value)}
                          className="w-full text-sm rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                        />
                      </div>

                      {/* Image Upload Component for News */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">뉴스 대표 썸네일 이미지 (선택사항)</label>
                        
                        <div
                          onDragEnter={handleNewsDrag}
                          onDragOver={handleNewsDrag}
                          onDragLeave={handleNewsDrag}
                          onDrop={handleNewsDrop}
                          onClick={() => newsFileInputRef.current?.click()}
                          className={`group relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed p-5 text-center transition-all cursor-pointer ${
                            newsDragActive
                              ? "border-zinc-950 bg-zinc-50"
                              : newsImageUrl
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-zinc-250 hover:border-zinc-950 hover:bg-zinc-50/50"
                          }`}
                        >
                          <input
                            type="file"
                            ref={newsFileInputRef}
                            onChange={handleNewsFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          {newsImageUrl ? (
                            <div className="flex flex-col items-center">
                              <Check className="h-5 w-5 text-emerald-500 mb-0.5" />
                              <p className="text-[11px] font-bold text-emerald-600">대표 썸네일이 업로드되었습니다.</p>
                              <img
                                src={newsImageUrl}
                                alt="News Upload Preview"
                                className="mt-1.5 h-12 w-16 object-cover border"
                              />
                            </div>
                          ) : (
                            <>
                              <UploadCloud className={`mb-1.5 h-6 w-6 text-zinc-300 group-hover:text-zinc-950 ${isNewsUploading ? "animate-pulse" : ""}`} />
                              <p className="text-[11px] font-bold text-zinc-805 text-zinc-800">
                                {isNewsUploading ? "이미지 업로드 중..." : "컴퓨터에서 이미지 드래그 또는 클릭"}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Direct news URL input fallback */}
                        <div className="mt-2 text-left">
                          <input
                            type="text"
                            placeholder="원격 이미지 주소(URL) 기입 가능"
                            value={newsImageUrl}
                            onChange={(e) => setNewsImageUrl(e.target.value)}
                            className="w-full text-xs rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 focus:border-zinc-950 focus:outline-none text-zinc-700"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isNewsUploading}
                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase py-3.5 tracking-wider transition"
                      >
                        뉴스피드 조각 업로드
                      </button>

                    </form>
                  )}

                  {/* TAB 3: LISTS MANAGER */}
                  {activeTab === "list" && (
                    <div className="space-y-6">
                      
                      {/* Stories Section */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Cover & Editorial Highlight stories ({stories.length})</h4>
                        
                        {stories.length > 0 ? (
                          <div className="space-y-1.5 max-h-[25vh] overflow-y-auto pr-1">
                            {stories.map((s) => (
                              <div key={s.id} className="flex items-center justify-between bg-zinc-50 p-2 border hover:bg-zinc-100 transition">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <img src={s.imageUrl} alt={s.title} className="h-9 w-7 object-cover border" />
                                  <div className="overflow-hidden truncate text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[8px] bg-zinc-205 bg-zinc-200 px-1 py-0.2 rounded text-zinc-700 uppercase font-mono font-bold">{s.c}</span>
                                      <span className="text-[8px] text-zinc-400 font-mono">0{s.num}</span>
                                    </div>
                                    <p className="text-xs font-bold text-zinc-900 truncate">{s.title}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`'${s.title}' 스토리를 매거진 아카이브에서 완전히 삭제하시겠습니까?`)) {
                                      onDeleteStory(s.id);
                                    }
                                  }}
                                  className="p-1.5 text-zinc-450 hover:text-red-500 hover:bg-red-50 transition rounded-sm"
                                  title="원고 삭제"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400">아직 등록된 스토리가 존재하지 않습니다.</p>
                        )}
                      </div>

                      {/* News Section */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">Latest News list items ({news.length})</h4>
                        
                        {news.length > 0 ? (
                          <div className="space-y-1.5 max-h-[25vh] overflow-y-auto pr-1">
                            {news.map((n) => (
                              <div key={n.id} className="flex items-center justify-between bg-zinc-50 p-2 border hover:bg-zinc-100 transition">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <img src={n.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=100&q=80"} alt={n.t} className="h-8 w-11 object-cover border" />
                                  <div className="overflow-hidden truncate text-left">
                                    <span className="text-[8px] border border-zinc-250 text-zinc-500 px-1 rounded uppercase font-mono font-bold">{n.c}</span>
                                    <p className="text-xs font-bold text-zinc-900 truncate mt-0.5">{n.t}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`'${n.t}' 뉴스를 정말로 완전히 삭제하시겠습니까?`)) {
                                      onDeleteNews(n.id);
                                    }
                                  }}
                                  className="p-1.5 text-zinc-450 hover:text-red-500 hover:bg-red-50 transition rounded-sm"
                                  title="원고 삭제"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400">등록된 뉴스피드가 전혀 없습니다.</p>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
