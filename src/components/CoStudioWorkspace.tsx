import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, Plus, Trash2, X, UploadCloud, Check, Key, Settings, Video, Download, 
  MessageSquare, PlusCircle, AlignCenter, RefreshCw, Send, ChevronRight, HelpCircle, 
  Sparkles, User, Users, MousePointer, Lock, Unlock, Eye, Layout, Type, Compass, Play
} from "lucide-react";

interface CanvasLayer {
  id: string;
  type: "background" | "logo" | "text";
  name: string;
  imageSrc?: string;
  text?: string;
  x: number; // absolute 0-1200 coordinates
  y: number; // absolute 0-1600 coordinates
  width: number;
  height: number;
  fontSize?: number;
  fontName?: string;
  postScriptName?: string;
  color?: string;
  opacity?: number;
  locked?: boolean;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface FeedbackPin {
  id: string;
  x: number; // absolute 0-1200
  y: number; // absolute 0-1600
  author: string;
  text: string;
  createdAt: string;
  comments: Comment[];
}

interface Project {
  id: string;
  name: string;
  bgImage: string;
  logoImage: string;
  layers: CanvasLayer[];
  pins: FeedbackPin[];
  createdAt: string;
}

interface AIAnalysisResult {
  compositionScore: number;
  typographyAnalysis: string;
  colorHarmony: string;
  suggestions: string[];
}

export default function CoStudioWorkspace() {
  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  
  // Active Project Data
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // WebSocket Connection State
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [activeCollaborators, setActiveCollaborators] = useState<number>(1);
  const [collaboratorCursors, setCollaboratorCursors] = useState<Record<string, { x: number; y: number; author: string }>>({});
  const wsRef = useRef<WebSocket | null>(null);

  // Studio Mode: "design" | "pins" | "ai"
  const [sidebarTab, setSidebarTab] = useState<"layers" | "pins" | "ai">("layers");
  
  // Interactive Pin Placement states
  const [pinModeActive, setPinModeActive] = useState<boolean>(false);
  const [newPinCoords, setNewPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [pinAuthorName, setPinAuthorName] = useState<string>("");
  const [pinCommentText, setPinCommentText] = useState<string>("");
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  // Create Project State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProjName, setNewProjName] = useState<string>("");
  const [newProjBg, setNewProjBg] = useState<string>("");
  const [uploadingBg, setUploadingBg] = useState<boolean>(false);

  // AI Style Critique State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState<string>("");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  // Export State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [dualMode, setDualMode] = useState<"editable" | "rasterized">("editable");

  // Canvas Display scaling factor
  // Absolute design coordinates are fixed at 1200 x 1600.
  // Display area inside the editor is 450 x 600.
  const canvasWidth = 450;
  const canvasHeight = 600;
  const scaleX = canvasWidth / 1200;
  const scaleY = canvasHeight / 1600;

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; layerX: number; layerY: number } | null>(null);

  // Load initial projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
        loadProjectDetails(data[0].id);
      }
    } catch (e) {
      console.error("Failed to load cover projects:", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadProjectDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveProject(data);
        // Clear selected layer
        setSelectedLayerId(null);
        setAiAnalysis(null);
        setActivePinId(null);
      }
    } catch (e) {
      console.error("Failed to load project details:", e);
    }
  };

  // Connect WebSockets
  useEffect(() => {
    if (!selectedProjectId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      // Join room for this project
      const author = localStorage.getItem("rm_author") || `Editor_${Math.floor(Math.random() * 90 + 10)}`;
      ws.send(JSON.stringify({
        type: "join",
        projectId: selectedProjectId,
        payload: { author }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const { type, payload } = msg;

        if (type === "presence-sync") {
          setActiveCollaborators(payload.count);
          // Play microbeep feedback on collaborator entering
          playBeepSound(1400, 0.05);
        } else if (type === "layers-sync") {
          // Update active layout canvas in real time!
          setActiveProject(prev => prev ? { ...prev, layers: payload.layers } : null);
        } else if (type === "pin-sync") {
          // Fresh Pin added by someone else
          setActiveProject(prev => {
            if (!prev) return null;
            if (prev.pins.some(p => p.id === payload.pin.id)) return prev;
            return { ...prev, pins: [...prev.pins, payload.pin] };
          });
          playBeepSound(1800, 0.06);
        } else if (type === "comment-sync") {
          // Comment reply added
          setActiveProject(prev => {
            if (!prev) return null;
            return {
              ...prev,
              pins: prev.pins.map(p => {
                if (p.id === payload.pinId) {
                  if (p.comments.some(c => c.id === payload.comment.id)) return p;
                  return { ...p, comments: [...p.comments, payload.comment] };
                }
                return p;
              })
            };
          });
          playBeepSound(1600, 0.05);
        } else if (type === "cursor-sync") {
          // Real-time mouse cursor position updates
          setCollaboratorCursors(prev => ({
            ...prev,
            [payload.author]: { x: payload.x, y: payload.y, author: payload.author }
          }));
        }
      } catch (err) {
        console.error("WS event parse error:", err);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      setActiveCollaborators(1);
    };

    return () => {
      ws.close();
    };
  }, [selectedProjectId]);

  // Sound generator matching parent site aesthetics
  const playBeepSound = (frequency = 1000, duration = 0.03) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    loadProjectDetails(id);
    playBeepSound(1100, 0.04);
  };

  // Drag layers on canvas
  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    if (pinModeActive) return; // ignore clicks during pin mode
    e.stopPropagation();
    setSelectedLayerId(layerId);
    playBeepSound(1500, 0.02);

    const layer = activeProject?.layers.find(l => l.id === layerId);
    if (!layer || layer.locked) return;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      layerX: layer.x,
      layerY: layer.y
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !activeProject) return;

    // Trigger cursor synchronizer message to other connected editors via WS
    if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const rect = canvasRef.current.getBoundingClientRect();
      const author = localStorage.getItem("rm_author") || "Co-Editor";
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      wsRef.current.send(JSON.stringify({
        type: "cursor-sync",
        projectId: activeProject.id,
        payload: { author, x, y }
      }));
    }

    if (!dragStartRef.current || !selectedLayerId) return;

    const layerIdx = activeProject.layers.findIndex(l => l.id === selectedLayerId);
    if (layerIdx === -1) return;

    const layer = activeProject.layers[layerIdx];
    if (layer.locked) return;

    const deltaX = (e.clientX - dragStartRef.current.clientX) / scaleX;
    const deltaY = (e.clientY - dragStartRef.current.clientY) / scaleY;

    const updatedLayers = [...activeProject.layers];
    updatedLayers[layerIdx] = {
      ...layer,
      x: Math.round(dragStartRef.current.layerX + deltaX),
      y: Math.round(dragStartRef.current.layerY + deltaY)
    };

    // Update locally
    setActiveProject(prev => prev ? { ...prev, layers: updatedLayers } : null);

    // Sync via WebSockets real-time
    if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "layers-sync",
        projectId: activeProject.id,
        payload: { layers: updatedLayers }
      }));
    }
  };

  const handleCanvasMouseUp = async () => {
    if (!dragStartRef.current || !activeProject || !selectedLayerId) return;
    dragStartRef.current = null;

    // Save final layer position to Express Backend DB
    try {
      await fetch(`/api/projects/${activeProject.id}/layers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layers: activeProject.layers })
      });
    } catch (e) {
      console.error("Failed to persist dragged layers on database:", e);
    }
  };

  // Edit layer properties from sidebar
  const updateSelectedLayerProperty = async (property: string, value: any) => {
    if (!activeProject || !selectedLayerId) return;

    const updatedLayers = activeProject.layers.map(l => {
      if (l.id === selectedLayerId) {
        return { ...l, [property]: value };
      }
      return l;
    });

    setActiveProject(prev => prev ? { ...prev, layers: updatedLayers } : null);

    // Live update WebSockets
    if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "layers-sync",
        projectId: activeProject.id,
        payload: { layers: updatedLayers }
      }));
    }

    // Save to server
    try {
      await fetch(`/api/projects/${activeProject.id}/layers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layers: updatedLayers })
      });
    } catch (e) {
      console.error("Failed to save layer updates:", e);
    }
  };

  // Add new Text layer
  const handleAddTextLayer = async () => {
    if (!activeProject) return;

    const newText: CanvasLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      name: "New Editorial Headline",
      text: "EDITORIAL STATEMENT",
      x: 150,
      y: 800,
      width: 900,
      height: 80,
      fontSize: 42,
      fontName: "Space Grotesk",
      postScriptName: "SpaceGrotesk-Bold",
      color: "#ffffff",
      opacity: 1,
      locked: false
    };

    const updatedLayers = [...activeProject.layers, newText];
    setActiveProject(prev => prev ? { ...prev, layers: updatedLayers } : null);
    setSelectedLayerId(newText.id);

    // Sync WebSocket
    if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "layers-sync",
        projectId: activeProject.id,
        payload: { layers: updatedLayers }
      }));
    }

    // Save
    await fetch(`/api/projects/${activeProject.id}/layers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layers: updatedLayers })
    });

    playBeepSound(2200, 0.05);
  };

  // Remove Layer
  const handleRemoveLayer = async (layerId: string) => {
    if (!activeProject) return;

    const updatedLayers = activeProject.layers.filter(l => l.id !== layerId);
    setActiveProject(prev => prev ? { ...prev, layers: updatedLayers } : null);
    if (selectedLayerId === layerId) setSelectedLayerId(null);

    // Sync
    if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "layers-sync",
        projectId: activeProject.id,
        payload: { layers: updatedLayers }
      }));
    }

    // Save
    await fetch(`/api/projects/${activeProject.id}/layers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layers: updatedLayers })
    });

    playBeepSound(900, 0.08);
  };

  // Handle placing a pin on the canvas coordinate
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!pinModeActive || !canvasRef.current || !activeProject) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = Math.round((e.clientX - rect.left) / scaleX);
    const clickY = Math.round((e.clientY - rect.top) / scaleY);

    setNewPinCoords({ x: clickX, y: clickY });
    
    // Set default author if not set
    const savedName = localStorage.getItem("rm_author") || "";
    setPinAuthorName(savedName);
  };

  const submitFeedbackPin = async () => {
    if (!activeProject || !newPinCoords || !pinCommentText || !pinAuthorName) return;

    // Save user author name preference
    localStorage.setItem("rm_author", pinAuthorName);

    try {
      const res = await fetch(`/api/projects/${activeProject.id}/pins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: newPinCoords.x,
          y: newPinCoords.y,
          author: pinAuthorName,
          text: pinCommentText
        })
      });

      if (res.ok) {
        const addedPin = await res.json();
        
        // Update local state
        setActiveProject(prev => prev ? { ...prev, pins: [...prev.pins, addedPin] } : null);
        setActivePinId(addedPin.id);

        // Sync pin WebSocket to other editors
        if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "pin-sync",
            projectId: activeProject.id,
            payload: { pin: addedPin }
          }));
        }

        // Clean up inputs
        setPinCommentText("");
        setNewPinCoords(null);
        setPinModeActive(false);
        setSidebarTab("pins");
        playBeepSound(2000, 0.08);
      }
    } catch (e) {
      console.error("Failed to post design pin:", e);
    }
  };

  // Submit reply comment to feedback threads
  const submitReplyComment = async () => {
    if (!activeProject || !activePinId || !replyText) return;

    const author = localStorage.getItem("rm_author") || `Editor_${Math.floor(Math.random() * 90 + 10)}`;

    try {
      const res = await fetch(`/api/projects/${activeProject.id}/pins/${activePinId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text: replyText })
      });

      if (res.ok) {
        const addedComment = await res.json();

        // Update local state
        setActiveProject(prev => {
          if (!prev) return null;
          return {
            ...prev,
            pins: prev.pins.map(p => {
              if (p.id === activePinId) {
                return { ...p, comments: [...p.comments, addedComment] };
              }
              return p;
            })
          };
        });

        // Broadcast comment via WebSocket
        if (wsConnected && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "comment-sync",
            projectId: activeProject.id,
            payload: { pinId: activePinId, comment: addedComment }
          }));
        }

        setReplyText("");
        playBeepSound(1700, 0.04);
      }
    } catch (e) {
      console.error("Failed to post thread comment:", e);
    }
  };

  // Run Vision AI Cover Review (calls Gemini server-side proxy)
  const runAiStyleReview = async () => {
    if (!activeProject) return;

    setIsAiLoading(true);
    setSidebarTab("ai");
    setAiAnalysis(null);

    const messageSequence = [
      "Analyzing editorial layout hierarchy and typography alignment...",
      "Evaluating contrast ratios of text overlays against campaign photos...",
      "Inspecting highlights, midtones, and shadows for tonal balance...",
      "Verifying brand logo placement according to guidelines...",
      "Integrating insights from ROUNDMAG creative direction archives..."
    ];

    let currentMsgIdx = 0;
    setAiLoadingMessage(messageSequence[0]);

    const interval = setInterval(() => {
      currentMsgIdx = (currentMsgIdx + 1) % messageSequence.length;
      setAiLoadingMessage(messageSequence[currentMsgIdx]);
    }, 1800);

    try {
      const res = await fetch("/api/analyze-cover-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bgImage: activeProject.bgImage,
          name: activeProject.name,
          layers: activeProject.layers
        })
      });

      if (res.ok) {
        const critique = await res.json();
        setAiAnalysis(critique);
        playBeepSound(2400, 0.12);
      }
    } catch (error) {
      console.error("Failed to fetch Vision AI feedback:", error);
    } finally {
      clearInterval(interval);
      setIsAiLoading(false);
    }
  };

  // Export & Download Photoshop PSD File
  const handleExportPsd = async () => {
    if (!activeProject) return;

    setIsExporting(true);
    playBeepSound(1200, 0.1);

    try {
      const res = await fetch("/api/export-psd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          width: 1200,
          height: 1600,
          layersData: activeProject.layers,
          dualExportMode: dualMode
        })
      });

      if (res.ok) {
        // Convert to blob and download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_layered.psd`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        playBeepSound(2600, 0.15);
      } else {
        alert("Failed to build PSD on the server. Try again shortly.");
      }
    } catch (e) {
      console.error("PSD binary stream retrieval failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  // Create Project Helper
  const triggerCreateProject = async () => {
    if (!newProjName) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjName,
          bgImage: newProjBg || undefined
        })
      });

      if (res.ok) {
        const created = await res.json();
        setProjects(prev => [...prev, created]);
        setSelectedProjectId(created.id);
        setActiveProject(created);
        setShowCreateModal(false);
        setNewProjName("");
        setNewProjBg("");
        playBeepSound(1900, 0.1);
      }
    } catch (e) {
      console.error("Project creation failed:", e);
    }
  };

  // Base64 file uploader for background image
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      const base64 = readerEvent.target?.result as string;
      try {
        const res = await fetch("/api/upload-base64", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            base64Data: base64,
            adminToken: "1234"
          })
        });

        if (res.ok) {
          const data = await res.json();
          setNewProjBg(data.imageUrl);
          playBeepSound(1600, 0.05);
        }
      } catch (err) {
        console.error("Image base64 upload failed:", err);
      } finally {
        setUploadingBg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-[#0a0a0a] text-zinc-100 min-h-screen flex flex-col font-sans" id="studio-root-container">
      {/* Studio Control Header */}
      <div className="border-b border-white/[0.08] bg-zinc-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
        
        {/* Project Switcher Info */}
        <div className="flex items-center space-x-4">
          <div className="bg-zinc-800 p-2.5 rounded-xl text-white shadow-lg shrink-0">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-full font-bold">CAMPAIGN ROOM</span>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Users className="h-3.5 w-3.5 text-zinc-400" />
                <span>{activeCollaborators} Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={selectedProjectId}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="bg-transparent text-white font-serif font-extrabold text-lg md:text-xl border-none outline-none focus:ring-0 pr-8 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-950 text-white py-2 font-sans font-normal text-sm">
                    {p.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => { playBeepSound(1800, 0.04); setShowCreateModal(true); }}
                className="p-1 rounded-full hover:bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                title="Create New Project"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual Mode Switch */}
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-1 font-mono text-[10px]">
            <button 
              onClick={() => { playBeepSound(1100, 0.02); setDualMode("editable"); }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${dualMode === "editable" ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}
            >
              Editable Texts (Option A)
            </button>
            <button 
              onClick={() => { playBeepSound(1100, 0.02); setDualMode("rasterized"); }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${dualMode === "rasterized" ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}
            >
              Rasterized (Option B)
            </button>
          </div>

          <button
            onClick={handleExportPsd}
            disabled={isExporting || !activeProject}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold font-mono text-xs cursor-pointer select-none transition-all ${
              isExporting 
              ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed" 
              : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg"
            }`}
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Compiling PSD Stream...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                Export PSD Layered
              </>
            )}
          </button>

          <button
            onClick={runAiStyleReview}
            disabled={isAiLoading || !activeProject}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold font-mono text-xs cursor-pointer select-none border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Editorial Review
          </button>
        </div>
      </div>

      {/* Main Studio Arena */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Connection status rail bottom left */}
        <div className="absolute left-6 bottom-6 z-10 hidden md:flex items-center space-x-2 bg-zinc-950 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="font-mono text-[9px] tracking-widest text-zinc-400">
            {wsConnected ? "EDITORIAL CHANNEL ACTIVE" : "LOCAL STANDALONE MODE"}
          </span>
        </div>

        {/* Central design workstation */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-900 relative min-h-[500px]">
          
          {/* Subheader controls */}
          <div className="flex items-center space-x-4 mb-4 bg-zinc-950 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
            <button 
              onClick={() => { setPinModeActive(false); setNewPinCoords(null); playBeepSound(1000, 0.02); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${!pinModeActive ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}
            >
              <MousePointer className="h-3.5 w-3.5" />
              Interactive Drag & Move
            </button>
            <button 
              onClick={() => { setPinModeActive(true); setSelectedLayerId(null); playBeepSound(1100, 0.04); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${pinModeActive ? "bg-pink-500 text-white shadow-lg shadow-pink-500/10" : "text-zinc-400 hover:text-white"}`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Place Feedback Pin
            </button>
          </div>

          {/* Interactive design viewport frame */}
          <div className="relative p-1.5 rounded-3xl bg-zinc-950 border-4 border-white/[0.04] shadow-2xl relative select-none">
            
            {/* The scaled visual canvas */}
            <div 
              ref={canvasRef}
              style={{ width: canvasWidth, height: canvasHeight }}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onClick={handleCanvasClick}
              className={`relative bg-zinc-950 overflow-hidden rounded-2xl select-none transition-all ${pinModeActive ? "cursor-crosshair border-2 border-pink-500/40" : "cursor-default"}`}
              id="magazine-design-canvas"
            >
              {activeProject?.layers.map((layer) => {
                // Background image layer
                if (layer.type === "background") {
                  return (
                    <div 
                      key={layer.id}
                      style={{
                        left: layer.x * scaleX,
                        top: layer.y * scaleY,
                        width: layer.width * scaleX,
                        height: layer.height * scaleY,
                        opacity: layer.opacity ?? 1
                      }}
                      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
                    >
                      <img 
                        src={layer.imageSrc} 
                        alt={layer.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                }

                // Brand typographic Logo layer
                if (layer.type === "logo") {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                      style={{
                        left: layer.x * scaleX,
                        top: layer.y * scaleY,
                        width: layer.width * scaleX,
                        height: layer.height * scaleY,
                        opacity: layer.opacity ?? 1,
                        zIndex: 10
                      }}
                      className={`absolute select-none cursor-grab active:cursor-grabbing transition-shadow ${
                        isSelected 
                        ? "outline-2 outline-white outline-dashed outline-offset-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/5" 
                        : "hover:outline hover:outline-1 hover:outline-white/20"
                      }`}
                    >
                      {layer.imageSrc ? (
                        <img 
                          src={layer.imageSrc} 
                          alt="ROUNDMAG LOGO" 
                          className="w-full h-full object-contain pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/10 font-bold tracking-[0.2em] font-serif text-white text-3xl">
                          ROUNDMAG
                        </div>
                      )}
                      
                      {/* Scale visual bounds identifier */}
                      {isSelected && (
                        <span className="absolute bottom-1 right-2 font-mono text-[8px] text-white bg-zinc-950/80 px-1 py-0.5 rounded uppercase">
                          X:{layer.x} Y:{layer.y}
                        </span>
                      )}
                    </div>
                  );
                }

                // Custom editable text layer
                if (layer.type === "text") {
                  const isSelected = selectedLayerId === layer.id;
                  const displayFontSize = (layer.fontSize ?? 48) * scaleY;
                  
                  return (
                    <div
                      key={layer.id}
                      onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                      style={{
                        left: layer.x * scaleX,
                        top: layer.y * scaleY,
                        width: layer.width * scaleX,
                        height: layer.height * scaleY,
                        opacity: layer.opacity ?? 1,
                        color: layer.color || "#ffffff",
                        fontSize: displayFontSize,
                        fontFamily: layer.fontName || "Georgia",
                        zIndex: 15
                      }}
                      className={`absolute select-none cursor-grab active:cursor-grabbing font-bold flex items-start transition-shadow select-none ${
                        isSelected 
                        ? "outline-2 outline-white outline-dashed outline-offset-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/5" 
                        : "hover:outline hover:outline-1 hover:outline-white/20"
                      }`}
                    >
                      <div className="w-full h-full select-none leading-none overflow-hidden text-center uppercase tracking-wider">
                        {layer.text}
                      </div>

                      {isSelected && (
                        <span className="absolute bottom-1 right-2 font-mono text-[8px] text-white bg-zinc-950/80 px-1 py-0.5 rounded uppercase">
                          X:{layer.x} Y:{layer.y}
                        </span>
                      )}
                    </div>
                  );
                }

                return null;
              })}

              {/* RENDER ACTIVE FEEDBACK PINS */}
              {activeProject?.pins.map((pin) => {
                const isActive = activePinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePinId(pin.id);
                      setSidebarTab("pins");
                      playBeepSound(1400, 0.05);
                    }}
                    style={{
                      left: pin.x * scaleX - 12,
                      top: pin.y * scaleY - 12
                    }}
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-lg transition-transform hover:scale-125 z-30 cursor-pointer ${
                      isActive 
                      ? "bg-pink-500 scale-110 shadow-pink-500/40 ring-4 ring-pink-500/20" 
                      : "bg-zinc-950 border border-pink-500 text-pink-400"
                    }`}
                  >
                    <MessageSquare className="h-3 w-3" />
                  </button>
                );
              })}

              {/* FLOATING CURSOR SIMULATOR FOR OTHER COLLABORATORS */}
              {Object.entries(collaboratorCursors).map(([author, coords]) => {
                const c = coords as { x: number; y: number; author: string };
                return (
                  <div 
                    key={author}
                    style={{
                      left: c.x * canvasWidth,
                      top: c.y * canvasHeight,
                    }}
                    className="absolute pointer-events-none z-40 transition-all duration-75 flex flex-col items-start gap-1"
                  >
                    <MousePointer className="h-4 w-4 text-white fill-zinc-200 drop-shadow-md" />
                    <span className="font-mono text-[8px] px-1.5 py-0.5 bg-zinc-900 text-zinc-200 rounded shadow-lg border border-zinc-700 whitespace-nowrap">
                      {author}
                    </span>
                  </div>
                );
              })}

              {/* UNCONFIRMED DRAFT PIN FOR NEW FEEDBACK */}
              {newPinCoords && (
                <div 
                  style={{
                    left: newPinCoords.x * scaleX - 12,
                    top: newPinCoords.y * scaleY - 12
                  }}
                  className="absolute w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center animate-bounce z-30"
                >
                  <PlusCircle className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          {/* Guidelines note */}
          {pinModeActive && (
            <p className="mt-4 font-mono text-[10px] text-pink-400 tracking-wider text-center animate-pulse">
              [PIN MODE ACTIVE] Click anywhere on the cover canvas above to drop a visual feedback pin coordinate.
            </p>
          )}
        </div>

        {/* Dynamic Sidebar Workspace Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-zinc-950/70 backdrop-blur-md flex flex-col h-full lg:max-h-[92vh] overflow-hidden z-10 shrink-0">
          
          {/* Tabs header */}
          <div className="grid grid-cols-3 border-b border-white/[0.08] text-xs font-mono text-center shrink-0">
            <button 
              onClick={() => { setSidebarTab("layers"); playBeepSound(1100, 0.02); }}
              className={`py-3.5 font-bold cursor-pointer transition ${sidebarTab === "layers" ? "bg-white/5 text-white border-b-2 border-white" : "text-zinc-400 hover:text-white"}`}
            >
              Layers
            </button>
            <button 
              onClick={() => { setSidebarTab("pins"); playBeepSound(1100, 0.02); }}
              className={`py-3.5 font-bold cursor-pointer transition relative ${sidebarTab === "pins" ? "bg-white/5 text-white border-b-2 border-white" : "text-zinc-400 hover:text-white"}`}
            >
              Pins Thread
              {activeProject && activeProject.pins.length > 0 && (
                <span className="absolute right-3 top-2.5 bg-pink-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeProject.pins.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => { setSidebarTab("ai"); playBeepSound(1100, 0.02); }}
              className={`py-3.5 font-bold cursor-pointer transition ${sidebarTab === "ai" ? "bg-white/5 text-white border-b-2 border-white" : "text-zinc-400 hover:text-white"}`}
            >
              Vision Critique
            </button>
          </div>

          {/* Workspace content sections */}
          <div className="flex-1 overflow-y-auto p-5">
            
            {/* TAB: LAYERS EDITOR */}
            {sidebarTab === "layers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Canvas Layers</span>
                  <button 
                    onClick={handleAddTextLayer}
                    className="flex items-center gap-1 text-[11px] font-mono text-white bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-700 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Text Layer
                  </button>
                </div>

                <div className="space-y-2">
                  {activeProject?.layers.map((layer) => {
                    const isSelected = selectedLayerId === layer.id;
                    return (
                      <div 
                        key={layer.id}
                        onClick={() => {
                          setSelectedLayerId(layer.id);
                          playBeepSound(1300, 0.02);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected 
                          ? "bg-white/5 border-zinc-700 text-white" 
                          : "bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {layer.type === "background" && <Layout className="h-4 w-4 text-zinc-500 shrink-0" />}
                          {layer.type === "logo" && <Sparkles className="h-4 w-4 text-pink-400 shrink-0" />}
                          {layer.type === "text" && <Type className="h-4 w-4 text-zinc-300 shrink-0" />}
                          <div>
                            <p className="text-xs font-bold text-zinc-200">{layer.name}</p>
                            <p className="text-[10px] font-mono text-zinc-500">X:{layer.x} Y:{layer.y}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {layer.locked ? (
                            <Lock className="h-3.5 w-3.5 text-zinc-600" />
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveLayer(layer.id); }}
                              className="p-1 rounded hover:bg-white/10 text-zinc-600 hover:text-red-400 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SELECTED LAYER PROPERTIES CONTROL PANEL */}
                {selectedLayerId && (
                  <div className="border border-white/[0.08] bg-white/[0.01] p-4 rounded-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-200 uppercase">Layer Geometry Settings</span>
                      <button 
                        onClick={() => setSelectedLayerId(null)}
                        className="p-1 text-zinc-500 hover:text-white transition cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* If selected layer is editable text */}
                    {activeProject?.layers.find(l => l.id === selectedLayerId)?.type === "text" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Text String Content</label>
                          <input 
                            type="text"
                            value={activeProject.layers.find(l => l.id === selectedLayerId)?.text || ""}
                            onChange={(e) => updateSelectedLayerProperty("text", e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 mb-1">Font Size (px)</label>
                            <input 
                              type="number"
                              value={activeProject.layers.find(l => l.id === selectedLayerId)?.fontSize || 42}
                              onChange={(e) => updateSelectedLayerProperty("fontSize", Number(e.target.value))}
                              className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 mb-1">Text Fill Color</label>
                            <input 
                              type="color"
                              value={activeProject.layers.find(l => l.id === selectedLayerId)?.color || "#ffffff"}
                              onChange={(e) => updateSelectedLayerProperty("color", e.target.value)}
                              className="w-full bg-zinc-900 border border-white/10 p-1.5 h-8 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Font PostScript Name</label>
                          <select
                            value={activeProject.layers.find(l => l.id === selectedLayerId)?.postScriptName || "ArialMT"}
                            onChange={(e) => {
                              const font = e.target.value;
                              let name = "Arial";
                              if (font.includes("Times")) name = "Times New Roman";
                              else if (font.includes("Courier")) name = "Courier New";
                              else if (font.includes("Georgia")) name = "Georgia";
                              else if (font.includes("Space")) name = "Space Grotesk";
                              
                              updateSelectedLayerProperty("postScriptName", font);
                              updateSelectedLayerProperty("fontName", name);
                            }}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                          >
                            <option value="ArialMT">ArialMT (Arial Standard)</option>
                            <option value="Arial-BoldMT">Arial-BoldMT (Arial Bold)</option>
                            <option value="TimesNewRomanPS-BoldMT">TimesNewRomanPS-BoldMT (Times Bold)</option>
                            <option value="Georgia-Bold">Georgia-Bold (Georgia Bold)</option>
                            <option value="SpaceGrotesk-Bold">SpaceGrotesk-Bold (Space Grotesk)</option>
                            <option value="FiraCode-Regular">FiraCode-Regular (Fira Code)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Coordinate modifiers manual input */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Position X</label>
                          <input 
                            type="number"
                            value={activeProject?.layers.find(l => l.id === selectedLayerId)?.x || 0}
                            onChange={(e) => updateSelectedLayerProperty("x", Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Position Y</label>
                          <input 
                            type="number"
                            value={activeProject?.layers.find(l => l.id === selectedLayerId)?.y || 0}
                            onChange={(e) => updateSelectedLayerProperty("y", Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Width (px)</label>
                          <input 
                            type="number"
                            value={activeProject?.layers.find(l => l.id === selectedLayerId)?.width || 100}
                            onChange={(e) => updateSelectedLayerProperty("width", Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-500 mb-1">Height (px)</label>
                          <input 
                            type="number"
                            value={activeProject?.layers.find(l => l.id === selectedLayerId)?.height || 100}
                            onChange={(e) => updateSelectedLayerProperty("height", Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Layer Opacity ({Math.round((activeProject?.layers.find(l => l.id === selectedLayerId)?.opacity ?? 1) * 100)}%)</label>
                        <input 
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={activeProject?.layers.find(l => l.id === selectedLayerId)?.opacity ?? 1}
                          onChange={(e) => updateSelectedLayerProperty("opacity", parseFloat(e.target.value))}
                          className="w-full accent-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FEEDBACK PINS & REAL-TIME COMMENTS */}
            {sidebarTab === "pins" && (
              <div className="space-y-4">
                {/* Draft Pin creation form if coords set */}
                {newPinCoords && (
                  <div className="border border-pink-500/40 bg-pink-500/5 p-4 rounded-2xl space-y-3 animate-fadeIn">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-pink-400 uppercase">[NEW PIN COORDINATE DETECTED]</span>
                    <p className="text-[10px] font-mono text-zinc-500">Coordinate placement: X:{newPinCoords.x} Y:{newPinCoords.y}</p>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Your Professional Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Art Lead Jin"
                        value={pinAuthorName}
                        onChange={(e) => setPinAuthorName(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Feedback/Critique Comment</label>
                      <textarea 
                        rows={3}
                        placeholder="Explain the required design adjustments or overlapping requests..."
                        value={pinCommentText}
                        onChange={(e) => setPinCommentText(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={submitFeedbackPin}
                        disabled={!pinAuthorName || !pinCommentText}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-bold py-2 rounded-xl cursor-pointer"
                      >
                        Drop Feedback Pin
                      </button>
                      <button 
                        onClick={() => { setNewPinCoords(null); playBeepSound(900, 0.05); }}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Pin threads listing */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">Dropped Review Coordinates</span>
                  {(!activeProject || activeProject.pins.length === 0) && !newPinCoords && (
                    <div className="text-center py-10 bg-white/[0.01] rounded-2xl border border-white/[0.04]">
                      <MessageSquare className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400">No review pins placed yet.</p>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px] mx-auto">Toggle pin mode above and click anywhere on the canvas to start review dialogue.</p>
                    </div>
                  )}

                  {activeProject?.pins.map((pin) => {
                    const isThreadActive = activePinId === pin.id;
                    return (
                      <div 
                        key={pin.id}
                        onClick={() => { setActivePinId(pin.id); playBeepSound(1200, 0.02); }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          isThreadActive 
                          ? "bg-pink-500/10 border-pink-500/40" 
                          : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-[9px] font-mono font-bold">P</span>
                            <span className="text-xs font-bold text-zinc-200">{pin.author}</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500">X:{pin.x} Y:{pin.y}</span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">{pin.text}</p>

                        {/* Comment Replies inside pin thread */}
                        {isThreadActive && (
                          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                              {pin.comments.map((comment) => (
                                <div key={comment.id} className="bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400">{comment.author}</span>
                                    <span className="text-[8px] font-mono text-zinc-600">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{comment.text}</p>
                                </div>
                              ))}
                            </div>

                            {/* Reply Input block */}
                            <div className="flex items-center gap-1.5 pt-1">
                              <input 
                                type="text"
                                placeholder="Type response comment..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') submitReplyComment(); }}
                                className="flex-1 bg-zinc-900 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-sans"
                              />
                              <button 
                                onClick={submitReplyComment}
                                disabled={!replyText}
                                className="p-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white rounded-xl shrink-0 cursor-pointer"
                              >
                                <Send className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: VISION AI CRITIQUE */}
            {sidebarTab === "ai" && (
              <div className="space-y-5">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">Vision AI Editorial Review</span>

                {isAiLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-10 h-10 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
                    <div className="space-y-1.5 max-w-[250px]">
                      <p className="font-mono text-xs text-zinc-200 tracking-wider">CREATIVE REVIEW ACTIVE</p>
                      <p className="text-[10px] text-zinc-500 font-mono animate-pulse">{aiLoadingMessage}</p>
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Dial Score Meter */}
                    <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-2">Composition Grade</span>
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                        <div className="text-3xl font-black font-serif text-white">{aiAnalysis.compositionScore}</div>
                        <span className="absolute bottom-2 font-mono text-[8px] text-zinc-500 font-bold">/100</span>
                      </div>
                    </div>

                    {/* Typography Review */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-zinc-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                        <Type className="h-3.5 w-3.5 animate-pulse" />
                        <span>Typographic Architecture</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/[0.04]">
                        {aiAnalysis.typographyAnalysis}
                      </p>
                    </div>

                    {/* Color Harmony Review */}
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-zinc-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                        <Compass className="h-3.5 w-3.5" />
                        <span>Chiaroscuro & Tone balance</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/[0.04]">
                        {aiAnalysis.colorHarmony}
                      </p>
                    </div>

                    {/* Actionable Suggestions Checklist */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Actionable Adjustments</span>
                      <div className="space-y-2">
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-2 bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl">
                            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center text-[10px] shrink-0 font-bold font-mono">
                              0{index + 1}
                            </span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Re-run button */}
                    <button 
                      onClick={runAiStyleReview}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Re-run Design Valuation
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-white/[0.04]">
                    <Sparkles className="h-10 w-10 text-zinc-500 mx-auto mb-3 animate-pulse" />
                    <p className="text-xs text-zinc-300 font-bold">Ready to consult Gemini Art Director?</p>
                    <p className="text-[10px] text-zinc-500 mt-1 max-w-[220px] mx-auto leading-relaxed">
                      Our Vision AI will read the layers, font types, offsets, and evaluate composition grade instantly.
                    </p>
                    <button 
                      onClick={runAiStyleReview}
                      className="mt-5 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                    >
                      Analyze Cover Geometry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE NEW COVER PROJECT MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="font-serif text-lg font-bold text-white">Create Collaboration Studio Project</span>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-500 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Project Name (Issue Cover)</label>
                  <input 
                    type="text"
                    placeholder="e.g. November Cover - MINIMAL GLASS"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-zinc-700 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Upload High-Res Editorial Photo</label>
                  
                  <div className="border border-dashed border-white/20 hover:border-zinc-700 rounded-xl p-6 text-center cursor-pointer transition relative bg-zinc-900 group">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploadingBg ? (
                      <div className="space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-white mx-auto" />
                        <p className="text-xs text-zinc-400 font-mono">Uploading Base64 Buffer...</p>
                      </div>
                    ) : newProjBg ? (
                      <div className="space-y-1">
                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                        <p className="text-xs text-green-400 font-mono font-bold">Image Uploaded Successfully</p>
                        <p className="text-[9px] text-zinc-500 truncate max-w-[250px] mx-auto">{newProjBg}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="h-6 w-6 text-zinc-500 group-hover:text-white mx-auto transition" />
                        <p className="text-xs text-zinc-300 font-bold font-mono">Select image from device</p>
                        <p className="text-[10px] text-zinc-500">JPG, PNG up to 10MB supported</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={triggerCreateProject}
                    disabled={!newProjName || uploadingBg}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-bold rounded-xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Assemble Studio Space
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
