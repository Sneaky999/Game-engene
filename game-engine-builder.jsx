import { useState, useRef, useEffect, useCallback, useReducer } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TILE LIBRARY  (emoji open-source, unicode — no external assets needed)
// ─────────────────────────────────────────────────────────────────────────────
const TILE_CATEGORIES = {
  "🌍 Nature": [
    { id:"grass",     icon:"🌿", label:"Grass",      color:"#1a3a1a", code:"GRASS" },
    { id:"dirt",      icon:"🟫", label:"Dirt",       color:"#3b2614", code:"DIRT" },
    { id:"sand",      icon:"🏖️", label:"Sand",       color:"#4a3c1a", code:"SAND" },
    { id:"snow",      icon:"❄️", label:"Snow",        color:"#2a3040", code:"SNOW" },
    { id:"mud",       icon:"🫧", label:"Mud",         color:"#2e1f0e", code:"MUD" },
    { id:"rock",      icon:"🪨", label:"Rock",        color:"#2e2e2e", code:"ROCK" },
    { id:"mountain",  icon:"⛰️", label:"Mountain",   color:"#3a3a3a", code:"MOUNTAIN" },
    { id:"volcano",   icon:"🌋", label:"Volcano",    color:"#4a1a00", code:"VOLCANO" },
    { id:"desert",    icon:"🏜️", label:"Desert",     color:"#4a3010", code:"DESERT" },
    { id:"swamp",     icon:"🪸", label:"Swamp",      color:"#1a2e14", code:"SWAMP" },
    { id:"cave",      icon:"🕳️", label:"Cave",        color:"#1a1a1a", code:"CAVE" },
    { id:"crater",    icon:"🌑", label:"Crater",     color:"#252525", code:"CRATER" },
  ],
  "💧 Water": [
    { id:"ocean",     icon:"🌊", label:"Ocean",      color:"#0a2040", code:"OCEAN" },
    { id:"river",     icon:"🏞️", label:"River",      color:"#0d2a3a", code:"RIVER" },
    { id:"lake",      icon:"💧", label:"Lake",       color:"#0a1e30", code:"LAKE" },
    { id:"ice",       icon:"🧊", label:"Ice",        color:"#1a2a40", code:"ICE" },
    { id:"waterfall", icon:"💦", label:"Waterfall",  color:"#0d2233", code:"WATERFALL" },
    { id:"lava",      icon:"🔥", label:"Lava",       color:"#4a1400", code:"LAVA" },
    { id:"poison",    icon:"☠️", label:"Poison",     color:"#1a2a0a", code:"POISON_POOL" },
    { id:"quicksand", icon:"⏳", label:"Quicksand",  color:"#3a2a10", code:"QUICKSAND" },
  ],
  "🌲 Flora": [
    { id:"pine",      icon:"🌲", label:"Pine",       color:"#0f2e0f", code:"TREE_PINE" },
    { id:"oak",       icon:"🌳", label:"Oak",        color:"#1a3312", code:"TREE_OAK" },
    { id:"palm",      icon:"🌴", label:"Palm",       color:"#1a3318", code:"TREE_PALM" },
    { id:"dead_tree", icon:"🪵", label:"Dead Tree",  color:"#2a1a0a", code:"TREE_DEAD" },
    { id:"cactus",    icon:"🌵", label:"Cactus",     color:"#1a3010", code:"CACTUS" },
    { id:"mushroom",  icon:"🍄", label:"Mushroom",   color:"#3a1a10", code:"MUSHROOM" },
    { id:"flower",    icon:"🌸", label:"Flower",     color:"#3a1a2e", code:"FLOWER" },
    { id:"wheat",     icon:"🌾", label:"Wheat",      color:"#3a3010", code:"WHEAT" },
    { id:"bush",      icon:"🫐", label:"Bush",       color:"#1a2e10", code:"BUSH" },
    { id:"vine",      icon:"🍃", label:"Vine",       color:"#163010", code:"VINE" },
    { id:"seaweed",   icon:"🪴", label:"Seaweed",    color:"#0a2a10", code:"SEAWEED" },
  ],
  "🏗️ Structures": [
    { id:"wall",      icon:"🧱", label:"Wall",       color:"#2e2416", code:"WALL" },
    { id:"castle",    icon:"🏰", label:"Castle",     color:"#2e2a20", code:"CASTLE" },
    { id:"house",     icon:"🏠", label:"House",      color:"#2e2010", code:"HOUSE" },
    { id:"tower",     icon:"🗼", label:"Tower",      color:"#2a2a2a", code:"TOWER" },
    { id:"bridge",    icon:"🌉", label:"Bridge",     color:"#2a2014", code:"BRIDGE" },
    { id:"dungeon",   icon:"🏚️", label:"Dungeon",    color:"#1e1a14", code:"DUNGEON" },
    { id:"temple",    icon:"🛕", label:"Temple",     color:"#2e2414", code:"TEMPLE" },
    { id:"ruin",      icon:"🏛️", label:"Ruin",       color:"#2a2010", code:"RUIN" },
    { id:"fence",     icon:"🚧", label:"Fence",      color:"#2e2010", code:"FENCE" },
    { id:"door",      icon:"🚪", label:"Door",       color:"#2e1e0e", code:"DOOR" },
    { id:"chest_str", icon:"🗄️", label:"Cabinet",    color:"#2e2010", code:"CABINET" },
    { id:"barn",      icon:"🏚️", label:"Barn",       color:"#3a2010", code:"BARN" },
    { id:"lighthouse",icon:"🗽", label:"Lighthouse", color:"#2a2a20", code:"LIGHTHOUSE" },
    { id:"pyramid",   icon:"🔺", label:"Pyramid",    color:"#3a3010", code:"PYRAMID" },
  ],
  "⚡ Game Logic": [
    { id:"spawn",      icon:"⚡", label:"Spawn",      color:"#2a2600", code:"SPAWN_POINT" },
    { id:"checkpoint", icon:"🚩", label:"Checkpoint", color:"#2a0a0a", code:"CHECKPOINT" },
    { id:"trigger",    icon:"🔘", label:"Trigger",    color:"#0a1a2a", code:"TRIGGER_ZONE" },
    { id:"portal",     icon:"🌀", label:"Portal",     color:"#1a0a2a", code:"PORTAL" },
    { id:"chest",      icon:"📦", label:"Chest",      color:"#2e2010", code:"CHEST" },
    { id:"key_item",   icon:"🗝️", label:"Key",        color:"#2e2600", code:"KEY_ITEM" },
    { id:"enemy",      icon:"👾", label:"Enemy",      color:"#2a0a00", code:"ENEMY_SPAWN" },
    { id:"boss",       icon:"🐉", label:"Boss",       color:"#2e0000", code:"BOSS_SPAWN" },
    { id:"npc",        icon:"🧙", label:"NPC",        color:"#0a1a0a", code:"NPC_SPAWN" },
    { id:"shop",       icon:"🏪", label:"Shop",       color:"#1a1a2a", code:"SHOP" },
    { id:"save_point", icon:"💾", label:"Save",       color:"#0a1a2a", code:"SAVE_POINT" },
    { id:"exit",       icon:"🚀", label:"Exit",       color:"#2a2a00", code:"LEVEL_EXIT" },
    { id:"secret",     icon:"❓", label:"Secret",     color:"#1a0a2a", code:"SECRET_AREA" },
    { id:"destructible",icon:"💥",label:"Breakable",  color:"#2e1000", code:"DESTRUCTIBLE" },
  ],
  "💡 Environment": [
    { id:"light",      icon:"💡", label:"Light",      color:"#2a2a00", code:"LIGHT_SOURCE" },
    { id:"torch",      icon:"🔦", label:"Torch",      color:"#2a1800", code:"TORCH" },
    { id:"campfire",   icon:"🔥", label:"Campfire",   color:"#2e1400", code:"CAMPFIRE" },
    { id:"fog",        icon:"🌫️", label:"Fog",        color:"#1e2030", code:"FOG_ZONE" },
    { id:"wind",       icon:"💨", label:"Wind",       color:"#102030", code:"WIND_ZONE" },
    { id:"trap",       icon:"⚠️", label:"Trap",       color:"#2e1000", code:"TRAP" },
    { id:"rain",       icon:"🌧️", label:"Rain Zone",  color:"#101a2a", code:"RAIN_ZONE" },
    { id:"thunder",    icon:"⛈️", label:"Thunder",    color:"#1a1a2a", code:"THUNDER_ZONE" },
    { id:"darkness",   icon:"🌑", label:"Darkness",   color:"#0a0a0a", code:"DARKNESS_ZONE" },
    { id:"gravity",    icon:"🌐", label:"Gravity",    color:"#0a1a2a", code:"GRAVITY_ZONE" },
  ],
  "🛣️ Paths": [
    { id:"road",       icon:"🛣️", label:"Road",       color:"#1e1e1e", code:"ROAD" },
    { id:"path_dirt",  icon:"🚶", label:"Dirt Path",  color:"#2a2010", code:"PATH_DIRT" },
    { id:"stairs_up",  icon:"⬆️", label:"Stairs Up",  color:"#2a2010", code:"STAIRS_UP" },
    { id:"stairs_dn",  icon:"⬇️", label:"Stairs Dn",  color:"#2a2010", code:"STAIRS_DOWN" },
    { id:"rail",       icon:"🛤️", label:"Rail",       color:"#1a1a1a", code:"RAIL" },
    { id:"telepad",    icon:"🔵", label:"Telepad",    color:"#0a1a3a", code:"TELEPAD" },
    { id:"conveyor",   icon:"➡️", label:"Conveyor",   color:"#1e2a1e", code:"CONVEYOR" },
  ],
  "🎭 Characters": [
    { id:"hero",       icon:"🦸", label:"Hero",       color:"#0a1a2a", code:"HERO_START" },
    { id:"villain",    icon:"🦹", label:"Villain",    color:"#2a0a1a", code:"VILLAIN" },
    { id:"knight",     icon:"⚔️", label:"Knight",     color:"#2a2a2a", code:"KNIGHT_NPC" },
    { id:"merchant",   icon:"💰", label:"Merchant",   color:"#2a2010", code:"MERCHANT" },
    { id:"guard",      icon:"🛡️", label:"Guard",      color:"#1a2a1a", code:"GUARD" },
    { id:"animal",     icon:"🐺", label:"Animal",     color:"#1a1a10", code:"ANIMAL_SPAWN" },
    { id:"dragon_npc", icon:"🐲", label:"Dragon",     color:"#2a1010", code:"DRAGON_NPC" },
    { id:"ghost",      icon:"👻", label:"Ghost",      color:"#2a2a3a", code:"GHOST_NPC" },
  ],
};

const ALL_TILES = Object.values(TILE_CATEGORIES).flat();
const TILE_SIZE = 36;
const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;

// ─────────────────────────────────────────────────────────────────────────────
// LAYER DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_LAYERS = [
  { id:"ground",      name:"Ground",      visible:true, locked:false, opacity:1,    color:"#3d5a3e" },
  { id:"decoration",  name:"Decoration",  visible:true, locked:false, opacity:1,    color:"#5a3d5a" },
  { id:"objects",     name:"Objects",     visible:true, locked:false, opacity:1,    color:"#3d4a5a" },
  { id:"logic",       name:"Game Logic",  visible:true, locked:false, opacity:0.85, color:"#5a4a00" },
];

const LAYER_COLORS = ["#3d5a3e","#5a3d5a","#3d4a5a","#5a4a00","#5a3d3d","#3d5a5a","#4a5a3d","#5a4a3d"];

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────
function worldReducer(state, action) {
  switch (action.type) {
    case "PAINT": {
      const { layerId, x, y, tileId } = action;
      const key = `${x},${y}`;
      const lyr = state.layers[layerId] || {};
      const updated = tileId === null ? (({ [key]: _, ...rest }) => rest)(lyr) : { ...lyr, [key]: tileId };
      return { ...state, layers: { ...state.layers, [layerId]: updated } };
    }
    case "ADD_LAYER": {
      const id = `layer_${Date.now()}`;
      return {
        ...state,
        layerDefs: [...state.layerDefs, { id, name:action.name, visible:true, locked:false, opacity:1, color:action.color }],
        layers: { ...state.layers, [id]: {} },
      };
    }
    case "REMOVE_LAYER": {
      const defs = state.layerDefs.filter(l => l.id !== action.id);
      const { [action.id]: _, ...layers } = state.layers;
      return { ...state, layerDefs: defs, layers };
    }
    case "TOGGLE_VISIBLE": return { ...state, layerDefs: state.layerDefs.map(l => l.id === action.id ? { ...l, visible: !l.visible } : l) };
    case "TOGGLE_LOCK":    return { ...state, layerDefs: state.layerDefs.map(l => l.id === action.id ? { ...l, locked:  !l.locked  } : l) };
    case "SET_OPACITY":    return { ...state, layerDefs: state.layerDefs.map(l => l.id === action.id ? { ...l, opacity: action.val } : l) };
    case "RENAME_LAYER":   return { ...state, layerDefs: state.layerDefs.map(l => l.id === action.id ? { ...l, name: action.name } : l) };
    case "REORDER_LAYERS": {
      const defs = [...state.layerDefs];
      const [m] = defs.splice(action.from, 1);
      defs.splice(action.to, 0, m);
      return { ...state, layerDefs: defs };
    }
    case "CLEAR_LAYER": return { ...state, layers: { ...state.layers, [action.id]: {} } };
    case "SET_GRID":    return { ...state, gridW: action.w, gridH: action.h };
    case "ADD_CUSTOM":  return { ...state, customTiles: [...state.customTiles, action.tile] };
    case "DEL_CUSTOM":  return { ...state, customTiles: state.customTiles.filter(t => t.id !== action.id) };
    case "PUSH_HISTORY":return { ...state, history: [...state.history.slice(-39), action.snap] };
    case "UNDO": {
      if (!state.history.length) return state;
      return { ...state, layers: state.history[state.history.length-1], history: state.history.slice(0,-1) };
    }
    default: return state;
  }
}

function initState() {
  const layers = {};
  DEFAULT_LAYERS.forEach(l => { layers[l.id] = {}; });
  return { layerDefs: DEFAULT_LAYERS, layers, gridW: 40, gridH: 30, customTiles: [], history: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
function genCode(state, worldName, lang, allTiles) {
  const findTile = id => allTiles.find(t => t.id === id) || { code: id.toUpperCase(), icon:"?" };
  const total = Object.values(state.layers).reduce((s,l) => s + Object.keys(l).length, 0);
  const wName = worldName.replace(/\s+/g,"_");

  if (lang === "json") {
    return JSON.stringify({
      world: worldName,
      grid: { w: state.gridW, h: state.gridH, tileSize: 32 },
      layers: state.layerDefs.map(layer => ({
        id: layer.id, name: layer.name,
        opacity: layer.opacity ?? 1, visible: layer.visible,
        tiles: Object.entries(state.layers[layer.id]||{}).map(([k,tid]) => {
          const [x,y] = k.split(",").map(Number);
          return { x, y, tile: findTile(tid).code };
        }),
      })),
    }, null, 2);
  }

  if (lang === "py") {
    const lines = [
      `# ${"═".repeat(52)}`,
      `# WORLD : ${worldName}   ${state.gridW}×${state.gridH}`,
      `# Layers: ${state.layerDefs.length}   Objects: ${total}`,
      `# ${"═".repeat(52)}`,``,
      `from engine import GameWorld, Tile, Layer`,``,
      `class World_${wName}(GameWorld):`,
      `    metadata = {"name":"${worldName}","grid_w":${state.gridW},"grid_h":${state.gridH},"tile_size":32}`,``,
      `    def build(self):`,
    ];
    state.layerDefs.forEach(layer => {
      const objs = Object.entries(state.layers[layer.id]||{});
      if (!objs.length) return;
      lines.push(`        # ── ${layer.name} (${objs.length} tiles)`);
      lines.push(`        ${layer.id} = self.create_layer("${layer.name}", opacity=${layer.opacity??1})`);
      objs.forEach(([k,tid]) => {
        const [x,y] = k.split(",").map(Number);
        lines.push(`        ${layer.id}.place(Tile.${findTile(tid).code}, ${x}, ${y})`);
      });
      lines.push(``);
    });
    return lines.join("\n");
  }

  // JS default
  const lines = [
    `// ${"═".repeat(52)}`,
    `// WORLD : ${worldName}   ${state.gridW}×${state.gridH}`,
    `// Layers: ${state.layerDefs.length}   Objects: ${total}`,
    `// ${"═".repeat(52)}`,``,
    `import { GameWorld, Tile, Layer } from './engine';`,``,
    `export class World_${wName} extends GameWorld {`,
    `  static meta = {`,
    `    name: "${worldName}", gridW: ${state.gridW}, gridH: ${state.gridH}, tileSize: 32,`,
    `  };`,``,
    `  build() {`,
  ];
  state.layerDefs.forEach(layer => {
    const objs = Object.entries(state.layers[layer.id]||{});
    if (!objs.length) return;
    lines.push(`    // ── ${layer.name} (${objs.length} tiles)`);
    lines.push(`    const ${layer.id} = this.createLayer("${layer.name}", { opacity: ${layer.opacity??1} });`);
    objs.forEach(([k,tid]) => {
      const [x,y] = k.split(",").map(Number);
      lines.push(`    ${layer.id}.place(Tile.${findTile(tid).code}, ${x}, ${y});`);
    });
    lines.push(``);
  });
  lines.push(`  }`);
  lines.push(`}`);
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNTAX HIGHLIGHT
// ─────────────────────────────────────────────────────────────────────────────
function highlight(line, lang) {
  if (lang === "json") {
    if (line.trim().startsWith('"') && line.includes(":")) return "#79c0ff";
    if (/:\s*\d/.test(line)) return "#a5d6ff";
    if (/:\s*"/.test(line)) return "#a5d6ff";
    return "#e6edf3";
  }
  if (line.trim().startsWith("//") || line.trim().startsWith("#")) return "#8b949e";
  if (/\b(class|export|import|from|def|return|self)\b/.test(line)) return "#ff7b72";
  if (/\b(const|let|static|meta|build)\b/.test(line)) return "#d2a8ff";
  if (/\.(place|createLayer|create_layer)\(/.test(line)) return "#79c0ff";
  if (/"[^"]+"/.test(line)) return "#a5d6ff";
  return "#e6edf3";
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function GameEngineBuilder() {
  const [state, dispatch] = useReducer(worldReducer, null, initState);
  const [activeLayer, setActiveLayer] = useState("ground");
  const [activeTile, setActiveTile]   = useState("grass");
  const [tool, setTool]               = useState("paint");
  const [zoom, setZoom]               = useState(1);
  const [pan, setPan]                 = useState({ x: 32, y: 32 });
  const [isPainting, setIsPainting]   = useState(false);
  const [isPanning, setIsPanning]     = useState(false);
  const [panStart, setPanStart]       = useState(null);
  const [worldName, setWorldName]     = useState("MyWorld");
  const [leftPanel, setLeftPanel]     = useState("tiles");
  const [codelang, setCodelang]       = useState("js");
  const [copied, setCopied]           = useState(false);
  const [tileSearch, setTileSearch]   = useState("");
  const [activeCategory, setActiveCategory] = useState("🌍 Nature");
  const [showAddLayer, setShowAddLayer]     = useState(false);
  const [newLayerName, setNewLayerName]     = useState("");
  const [showCustom, setShowCustom]         = useState(false);
  const [customIcon, setCustomIcon]         = useState("🎯");
  const [customLabel, setCustomLabel]       = useState("");
  const [customCode, setCustomCode]         = useState("");
  const [gridW, setGridW] = useState(40);
  const [gridH, setGridH] = useState(30);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showCode, setShowCode] = useState(true);
  const canvasRef = useRef(null);
  const lastPainted = useRef(null);

  const allTiles = [...ALL_TILES, ...state.customTiles];

  const filteredTiles = tileSearch
    ? allTiles.filter(t => t.label.toLowerCase().includes(tileSearch.toLowerCase()))
    : (TILE_CATEGORIES[activeCategory] || []);

  // ── cell from mouse event ──
  const getCell = useCallback((clientX, clientY) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.floor((clientX - rect.left - pan.x) / (zoom * TILE_SIZE));
    const y = Math.floor((clientY - rect.top  - pan.y) / (zoom * TILE_SIZE));
    return { x, y };
  }, [pan, zoom]);

  // ── paint ──
  const doPaint = useCallback((x, y) => {
    const key = `${x},${y}`;
    if (lastPainted.current === key) return;
    lastPainted.current = key;
    const layer = state.layerDefs.find(l => l.id === activeLayer);
    if (!layer || layer.locked) return;
    dispatch({ type:"PUSH_HISTORY", snap: state.layers });
    dispatch({ type:"PAINT", layerId: activeLayer, x, y, tileId: tool === "erase" ? null : activeTile });
  }, [activeLayer, activeTile, tool, state]);

  // ── mouse handlers ──
  const onMouseDown = useCallback((e) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    if (e.button !== 0) return;
    setIsPainting(true);
    lastPainted.current = null;
    const cell = getCell(e.clientX, e.clientY);
    if (cell) doPaint(cell.x, cell.y);
  }, [pan, getCell, doPaint]);

  const onMouseMove = useCallback((e) => {
    if (isPanning && panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    const cell = getCell(e.clientX, e.clientY);
    setHoveredCell(cell);
    if (isPainting && cell) doPaint(cell.x, cell.y);
  }, [isPanning, panStart, isPainting, getCell, doPaint]);

  const onMouseUp = useCallback(() => {
    setIsPainting(false);
    setIsPanning(false);
    setPanStart(null);
    lastPainted.current = null;
  }, []);

  // ── wheel zoom ──
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor));
    const scale = nz / zoom;
    setPan(p => ({ x: mx - scale*(mx - p.x), y: my - scale*(my - p.y) }));
    setZoom(nz);
  }, [zoom]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // ── keyboard undo ──
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") dispatch({ type:"UNDO" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const totalObjects = Object.values(state.layers).reduce((s,l) => s + Object.keys(l).length, 0);
  const activeLayerDef = state.layerDefs.find(l => l.id === activeLayer);
  const activeTileDef  = allTiles.find(t => t.id === activeTile);
  const code = genCode(state, worldName, codelang, allTiles);

  // ─── RENDERED TILES (only visible layers, bottom→top) ───
  const visibleLayers = state.layerDefs.filter(l => l.visible);

  // ─── TILE CELLS to render ───
  const tileEntries = [];
  visibleLayers.forEach(layer => {
    const data = state.layers[layer.id] || {};
    Object.entries(data).forEach(([key, tileId]) => {
      const [x, y] = key.split(",").map(Number);
      const tile = allTiles.find(t => t.id === tileId);
      if (tile) tileEntries.push({ x, y, tile, layer, key: `${layer.id}_${key}` });
    });
  });

  return (
    <div
      style={{ height:"100vh", background:"#060a0f", color:"#c9d1d9",
        fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",
        display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}
    >
      {/* ══════════ TOP BAR ══════════ */}
      <div style={{ height:46, borderBottom:"1px solid #21262d", background:"#0d1117",
        display:"flex", alignItems:"center", padding:"0 14px", gap:10, flexShrink:0, zIndex:20 }}>

        <span style={{ color:"#388bfd", fontWeight:900, fontSize:16, letterSpacing:3 }}>⬡</span>
        <span style={{ color:"#58a6ff", fontWeight:700, fontSize:13, letterSpacing:1 }}>GAMEFORGE</span>
        <span style={{ color:"#21262d", fontSize:12, margin:"0 2px" }}>|</span>

        <input value={worldName} onChange={e => setWorldName(e.target.value)}
          style={{ background:"#161b22", border:"1px solid #30363d", borderRadius:4,
            color:"#e6edf3", padding:"3px 10px", fontFamily:"inherit", fontSize:12, width:150, outline:"none" }} />

        <div style={{ width:1, height:20, background:"#21262d", margin:"0 4px" }} />

        {/* Tools */}
        {[
          { id:"paint", icon:"✏️", tip:"Paint (click & drag)" },
          { id:"erase", icon:"🗑️", tip:"Erase tiles" },
        ].map(t => (
          <button key={t.id} onClick={() => setTool(t.id)} title={t.tip}
            style={{ background: tool===t.id ? "#21262d":"transparent",
              border:"1px solid "+(tool===t.id?"#388bfd":"transparent"),
              borderRadius:5, color:tool===t.id?"#58a6ff":"#8b949e",
              padding:"4px 11px", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
            {t.icon} {t.tip.split(" ")[0]}
          </button>
        ))}

        <div style={{ width:1, height:20, background:"#21262d", margin:"0 2px" }} />
        <button onClick={() => dispatch({ type:"UNDO" })} title="Undo (Ctrl+Z)"
          style={{ background:"transparent", border:"1px solid transparent", borderRadius:4,
            color:"#8b949e", padding:"4px 10px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          ↩ Undo
        </button>

        <div style={{ flex:1 }} />

        <span style={{ fontSize:11, color:"#3d444d" }}>Zoom {Math.round(zoom*100)}%</span>
        <button onClick={() => { setZoom(1); setPan({x:32,y:32}); }}
          style={{ background:"transparent", border:"1px solid #30363d", borderRadius:4,
            color:"#8b949e", padding:"3px 9px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          Reset
        </button>
        <button onClick={() => setShowCode(s => !s)}
          style={{ background: showCode ? "#161b22":"transparent",
            border:"1px solid "+(showCode?"#388bfd":"#30363d"),
            borderRadius:4, color:showCode?"#58a6ff":"#8b949e",
            padding:"3px 12px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          {showCode ? "◀ Code" : "Code ▶"}
        </button>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ══ LEFT SIDEBAR ══ */}
        <div style={{ width:230, background:"#0d1117", borderRight:"1px solid #21262d",
          display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

          {/* Tab strip */}
          <div style={{ display:"flex", borderBottom:"1px solid #21262d", flexShrink:0 }}>
            {[
              { id:"tiles",   icon:"🧩", label:"Tiles" },
              { id:"layers",  icon:"📚", label:"Layers" },
              { id:"world",   icon:"⚙️",  label:"World" },
            ].map(p => (
              <button key={p.id} onClick={() => setLeftPanel(p.id)}
                style={{ flex:1, background: leftPanel===p.id?"#161b22":"transparent",
                  border:"none", borderBottom:"2px solid "+(leftPanel===p.id?"#388bfd":"transparent"),
                  color:leftPanel===p.id?"#58a6ff":"#8b949e",
                  padding:"8px 0 6px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* ── TILES ── */}
          {leftPanel === "tiles" && (
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"8px 8px 4px", flexShrink:0 }}>
                <input value={tileSearch} onChange={e => setTileSearch(e.target.value)}
                  placeholder="🔍 Search tiles…"
                  style={{ width:"100%", background:"#161b22", border:"1px solid #30363d",
                    borderRadius:5, color:"#e6edf3", padding:"5px 8px",
                    fontFamily:"inherit", fontSize:11, outline:"none", boxSizing:"border-box" }} />
              </div>

              {/* Category chips */}
              {!tileSearch && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:3, padding:"4px 8px 6px",
                  borderBottom:"1px solid #21262d", flexShrink:0 }}>
                  {Object.keys(TILE_CATEGORIES).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      style={{ background: activeCategory===cat?"#21262d":"transparent",
                        border:"1px solid "+(activeCategory===cat?"#388bfd":"#21262d"),
                        borderRadius:4, color:activeCategory===cat?"#58a6ff":"#8b949e",
                        padding:"2px 6px", cursor:"pointer", fontSize:9, fontFamily:"inherit",
                        lineHeight:1.5 }}>
                      {cat.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}

              {/* Tile grid */}
              <div style={{ flex:1, overflowY:"auto", padding:"6px 8px",
                display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
                {filteredTiles.map(tile => (
                  <button key={tile.id} onClick={() => { setActiveTile(tile.id); setTool("paint"); }} title={tile.label}
                    style={{ background: activeTile===tile.id?"#21262d":"#161b22",
                      border:"1px solid "+(activeTile===tile.id?"#388bfd":"#21262d"),
                      borderRadius:7, padding:"7px 2px 5px", cursor:"pointer",
                      display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                      transition:"border-color 0.1s" }}>
                    <span style={{ fontSize:20, lineHeight:1 }}>{tile.icon}</span>
                    <span style={{ fontSize:8, color:activeTile===tile.id?"#58a6ff":"#8b949e",
                      textAlign:"center", lineHeight:1.2, overflow:"hidden",
                      width:"100%", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {tile.label}
                    </span>
                  </button>
                ))}
                {/* Custom tiles */}
                {!tileSearch && state.customTiles.map(tile => (
                  <button key={tile.id} onClick={() => { setActiveTile(tile.id); setTool("paint"); }} title={tile.label}
                    style={{ background: activeTile===tile.id?"#21262d":"#161b22",
                      border:"1px solid "+(activeTile===tile.id?"#f78166":"#30363d"),
                      borderRadius:7, padding:"7px 2px 5px", cursor:"pointer",
                      display:"flex", flexDirection:"column", alignItems:"center", gap:2, position:"relative" }}>
                    <span style={{ fontSize:20, lineHeight:1 }}>{tile.icon}</span>
                    <span style={{ fontSize:8, color:"#f78166", textAlign:"center", lineHeight:1.2 }}>{tile.label}</span>
                    <span onMouseDown={e => { e.stopPropagation(); dispatch({ type:"DEL_CUSTOM", id:tile.id }); }}
                      style={{ position:"absolute", top:2, right:4, fontSize:9, color:"#8b949e", cursor:"pointer", zIndex:2 }}>✕</span>
                  </button>
                ))}
              </div>

              {/* Custom tile adder */}
              <div style={{ borderTop:"1px solid #21262d", padding:"8px", flexShrink:0 }}>
                {!showCustom ? (
                  <button onClick={() => setShowCustom(true)}
                    style={{ width:"100%", background:"#161b22", border:"1px dashed #30363d",
                      borderRadius:6, color:"#8b949e", padding:"6px", cursor:"pointer",
                      fontSize:11, fontFamily:"inherit" }}>
                    + Custom Tile
                  </button>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    <div style={{ display:"flex", gap:4 }}>
                      <input value={customIcon} onChange={e => setCustomIcon(e.target.value)}
                        style={{ width:34, background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                          color:"#e6edf3", padding:"4px 2px", fontFamily:"inherit", fontSize:18,
                          textAlign:"center", outline:"none" }} />
                      <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="Label"
                        style={{ flex:1, background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                          color:"#e6edf3", padding:"4px 6px", fontFamily:"inherit", fontSize:11, outline:"none" }} />
                    </div>
                    <input value={customCode} onChange={e => setCustomCode(e.target.value)} placeholder="CODE_NAME"
                      style={{ width:"100%", background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                        color:"#e6edf3", padding:"4px 6px", fontFamily:"inherit", fontSize:11, outline:"none",
                        boxSizing:"border-box" }} />
                    <div style={{ display:"flex", gap:4 }}>
                      <button onClick={() => {
                        if (!customLabel.trim() || !customCode.trim()) return;
                        dispatch({ type:"ADD_CUSTOM", tile:{ id:`c_${Date.now()}`, icon:customIcon, label:customLabel.trim(), code:customCode.trim().toUpperCase(), color:"#2a1a2a" } });
                        setCustomIcon("🎯"); setCustomLabel(""); setCustomCode(""); setShowCustom(false);
                      }} style={{ flex:1, background:"#196c2e", border:"none", borderRadius:4, color:"#3fb950", padding:"5px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                        ✓ Add
                      </button>
                      <button onClick={() => setShowCustom(false)}
                        style={{ background:"#21262d", border:"none", borderRadius:4, color:"#8b949e", padding:"5px 8px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LAYERS ── */}
          {leftPanel === "layers" && (
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <div style={{ flex:1, overflowY:"auto", padding:"8px 8px 0" }}>
                {[...state.layerDefs].reverse().map((layer, ri) => {
                  const realIdx = state.layerDefs.length - 1 - ri;
                  const isActive = activeLayer === layer.id;
                  return (
                    <div key={layer.id} onClick={() => setActiveLayer(layer.id)}
                      style={{ background:isActive?"#161b22":"transparent",
                        border:"1px solid "+(isActive?"#388bfd":"#21262d"),
                        borderRadius:7, padding:"8px 10px", marginBottom:6, cursor:"pointer" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ width:10, height:10, borderRadius:2, background:layer.color, flexShrink:0 }} />
                        <span style={{ flex:1, fontSize:12, color:isActive?"#e6edf3":"#8b949e",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {layer.name}
                        </span>
                        <span style={{ fontSize:10, color:"#3d444d" }}>
                          {Object.keys(state.layers[layer.id]||{}).length}
                        </span>
                      </div>

                      {isActive && (
                        <div style={{ marginTop:9, display:"flex", flexDirection:"column", gap:6 }}>
                          <div style={{ display:"flex", gap:4 }}>
                            <button onClick={e => { e.stopPropagation(); dispatch({ type:"TOGGLE_VISIBLE", id:layer.id }); }}
                              style={{ flex:1, background:"#21262d", border:"none", borderRadius:3,
                                color:layer.visible?"#3fb950":"#8b949e", padding:"4px 2px",
                                cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                              {layer.visible ? "👁 Visible" : "🙈 Hidden"}
                            </button>
                            <button onClick={e => { e.stopPropagation(); dispatch({ type:"TOGGLE_LOCK", id:layer.id }); }}
                              style={{ flex:1, background:"#21262d", border:"none", borderRadius:3,
                                color:layer.locked?"#f78166":"#8b949e", padding:"4px 2px",
                                cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                              {layer.locked ? "🔒 Locked" : "🔓 Free"}
                            </button>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:10, color:"#3d444d", flexShrink:0 }}>Opacity</span>
                            <input type="range" min={0} max={1} step={0.05} value={layer.opacity??1}
                              onClick={e=>e.stopPropagation()}
                              onChange={e => dispatch({ type:"SET_OPACITY", id:layer.id, val:+e.target.value })}
                              style={{ flex:1, accentColor:"#388bfd" }} />
                            <span style={{ fontSize:10, color:"#8b949e", width:28, textAlign:"right" }}>
                              {Math.round((layer.opacity??1)*100)}%
                            </span>
                          </div>
                          <div style={{ display:"flex", gap:3 }}>
                            <button onClick={e => { e.stopPropagation(); dispatch({ type:"REORDER_LAYERS", from:realIdx, to:Math.max(0,realIdx-1) }); }}
                              style={{ background:"#21262d", border:"none", borderRadius:3, color:"#8b949e", padding:"3px 7px", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>↑</button>
                            <button onClick={e => { e.stopPropagation(); dispatch({ type:"REORDER_LAYERS", from:realIdx, to:Math.min(state.layerDefs.length-1,realIdx+1) }); }}
                              style={{ background:"#21262d", border:"none", borderRadius:3, color:"#8b949e", padding:"3px 7px", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>↓</button>
                            <button onClick={e => { e.stopPropagation(); if(window.confirm(`Clear "${layer.name}"?`)) dispatch({ type:"CLEAR_LAYER", id:layer.id }); }}
                              style={{ flex:1, background:"#21262d", border:"none", borderRadius:3, color:"#8b949e", padding:"3px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                              Clear
                            </button>
                            {state.layerDefs.length > 1 && (
                              <button onClick={e => { e.stopPropagation(); if(window.confirm(`Delete "${layer.name}"?`)) { dispatch({ type:"REMOVE_LAYER", id:layer.id }); setActiveLayer(state.layerDefs.find(l=>l.id!==layer.id)?.id||""); } }}
                                style={{ background:"#3d1a1a", border:"none", borderRadius:3, color:"#f78166", padding:"3px 7px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>🗑</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding:"8px", borderTop:"1px solid #21262d", flexShrink:0 }}>
                {!showAddLayer ? (
                  <button onClick={() => setShowAddLayer(true)}
                    style={{ width:"100%", background:"#161b22", border:"1px dashed #30363d",
                      borderRadius:6, color:"#8b949e", padding:"7px", cursor:"pointer",
                      fontSize:11, fontFamily:"inherit" }}>
                    + Add Layer
                  </button>
                ) : (
                  <div style={{ display:"flex", gap:5 }}>
                    <input value={newLayerName} onChange={e=>setNewLayerName(e.target.value)}
                      placeholder="Layer name" autoFocus
                      style={{ flex:1, background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                        color:"#e6edf3", padding:"5px 8px", fontFamily:"inherit", fontSize:11, outline:"none" }} />
                    <button onClick={() => {
                      if (!newLayerName.trim()) return;
                      dispatch({ type:"ADD_LAYER", name:newLayerName.trim(), color:LAYER_COLORS[state.layerDefs.length % LAYER_COLORS.length] });
                      setNewLayerName(""); setShowAddLayer(false);
                    }} style={{ background:"#196c2e", border:"none", borderRadius:4, color:"#3fb950", padding:"5px 10px", cursor:"pointer", fontFamily:"inherit", fontSize:11 }}>✓</button>
                    <button onClick={() => setShowAddLayer(false)}
                      style={{ background:"#21262d", border:"none", borderRadius:4, color:"#8b949e", padding:"5px 8px", cursor:"pointer", fontFamily:"inherit", fontSize:11 }}>✕</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── WORLD ── */}
          {leftPanel === "world" && (
            <div style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
              <div style={{ fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>GRID SIZE</div>
              <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#8b949e", marginBottom:3 }}>Width</div>
                  <input type="number" value={gridW} min={4} max={999} onChange={e=>setGridW(+e.target.value)}
                    style={{ width:"100%", background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                      color:"#e6edf3", padding:"5px 7px", fontFamily:"inherit", fontSize:12, outline:"none", boxSizing:"border-box" }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#8b949e", marginBottom:3 }}>Height</div>
                  <input type="number" value={gridH} min={4} max={999} onChange={e=>setGridH(+e.target.value)}
                    style={{ width:"100%", background:"#161b22", border:"1px solid #30363d", borderRadius:4,
                      color:"#e6edf3", padding:"5px 7px", fontFamily:"inherit", fontSize:12, outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>
              <button onClick={() => dispatch({ type:"SET_GRID", w:gridW, h:gridH })}
                style={{ width:"100%", background:"#1f6feb", border:"none", borderRadius:5,
                  color:"#fff", padding:"7px", cursor:"pointer", fontSize:12, fontFamily:"inherit", marginBottom:18 }}>
                Apply {gridW} × {gridH}
              </button>

              <div style={{ fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>STATS</div>
              {[
                ["Grid",    `${state.gridW} × ${state.gridH}`],
                ["Layers",  state.layerDefs.length],
                ["Objects", totalObjects],
                ["Custom",  state.customTiles.length],
                ["History", state.history.length],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between",
                  padding:"5px 0", borderBottom:"1px solid #21262d", fontSize:12 }}>
                  <span style={{ color:"#8b949e" }}>{k}</span>
                  <span style={{ color:"#e6edf3" }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop:18, fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>CONTROLS</div>
              <div style={{ fontSize:11, color:"#8b949e", lineHeight:2 }}>
                <div>✏️ Left drag — Paint</div>
                <div>🖱 Middle / Alt+drag — Pan</div>
                <div>🔍 Scroll — Zoom</div>
                <div>⌨️ Ctrl+Z — Undo</div>
              </div>
            </div>
          )}
        </div>

        {/* ══ CANVAS ══ */}
        <div
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ flex:1, overflow:"hidden", position:"relative",
            cursor: isPanning ? "grabbing" : tool==="erase" ? "cell" : "crosshair",
            background:"#060a0f" }}
        >
          {/* World container */}
          <div style={{ position:"absolute", left:pan.x, top:pan.y,
            width: state.gridW * TILE_SIZE * zoom,
            height: state.gridH * TILE_SIZE * zoom,
            transformOrigin:"0 0" }}>

            {/* SVG grid */}
            <svg
              style={{ position:"absolute", top:0, left:0, pointerEvents:"none" }}
              width={state.gridW * TILE_SIZE * zoom}
              height={state.gridH * TILE_SIZE * zoom}>
              <defs>
                <pattern id="grid" width={TILE_SIZE*zoom} height={TILE_SIZE*zoom} patternUnits="userSpaceOnUse">
                  <path d={`M ${TILE_SIZE*zoom} 0 L 0 0 0 ${TILE_SIZE*zoom}`}
                    fill="none" stroke="#161b22" strokeWidth={zoom > 1 ? 0.7 : 0.4} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="none" stroke="#388bfd" strokeWidth={1.5} opacity={0.25} />
            </svg>

            {/* Tiles */}
            {tileEntries.map(({ x, y, tile, layer, key }) => (
              <div key={key} style={{
                position:"absolute",
                left: x * TILE_SIZE * zoom,
                top:  y * TILE_SIZE * zoom,
                width:  TILE_SIZE * zoom,
                height: TILE_SIZE * zoom,
                background: tile.color,
                opacity: layer.opacity ?? 1,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: Math.max(10, TILE_SIZE * zoom * 0.58),
                lineHeight:1, pointerEvents:"none",
              }}>
                {tile.icon}
              </div>
            ))}

            {/* Hover preview */}
            {hoveredCell && hoveredCell.x >= 0 && hoveredCell.x < state.gridW && hoveredCell.y >= 0 && hoveredCell.y < state.gridH && (
              <div style={{
                position:"absolute",
                left: hoveredCell.x * TILE_SIZE * zoom,
                top:  hoveredCell.y * TILE_SIZE * zoom,
                width:  TILE_SIZE * zoom,
                height: TILE_SIZE * zoom,
                background: tool==="erase" ? "rgba(247,129,102,0.18)" : "rgba(56,139,253,0.14)",
                border:`${Math.max(1, zoom)}px solid ${tool==="erase"?"#f78166":"#388bfd"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: Math.max(10, TILE_SIZE * zoom * 0.58),
                opacity:0.65, pointerEvents:"none", boxSizing:"border-box",
              }}>
                {tool !== "erase" && activeTileDef?.icon}
              </div>
            )}
          </div>

          {/* ── Status bar ── */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:26,
            background:"rgba(13,17,23,0.9)", borderTop:"1px solid #21262d",
            display:"flex", alignItems:"center", gap:20, padding:"0 14px",
            fontSize:11, color:"#3d444d", backdropFilter:"blur(4px)" }}>
            <span>Grid <span style={{ color:"#8b949e" }}>{state.gridW}×{state.gridH}</span></span>
            {hoveredCell && <span>Cell <span style={{ color:"#58a6ff" }}>[{hoveredCell.x},{hoveredCell.y}]</span></span>}
            <span>Layer <span style={{ color:activeLayerDef?.color||"#58a6ff" }}>{activeLayerDef?.name}</span></span>
            {activeTileDef && <span>Tile <span style={{ color:"#e6edf3" }}>{activeTileDef.icon} {activeTileDef.label}</span></span>}
            <span style={{ marginLeft:"auto" }}>
              Objects <span style={{ color:"#3fb950", fontWeight:"bold" }}>{totalObjects}</span>
            </span>
          </div>
        </div>

        {/* ══ CODE PANEL ══ */}
        {showCode && (
          <div style={{ width:300, borderLeft:"1px solid #21262d", background:"#0d1117",
            display:"flex", flexDirection:"column", flexShrink:0 }}>
            {/* Code header */}
            <div style={{ padding:"7px 10px", borderBottom:"1px solid #21262d",
              display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
              <span style={{ fontSize:11, color:"#58a6ff", flex:1 }}>{"{ }"} Code</span>
              {["js","py","json"].map(l => (
                <button key={l} onClick={() => setCodelang(l)}
                  style={{ background:codelang===l?"#21262d":"transparent",
                    border:"1px solid "+(codelang===l?"#388bfd":"#21262d"),
                    borderRadius:3, color:codelang===l?"#58a6ff":"#8b949e",
                    padding:"2px 8px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                  {l}
                </button>
              ))}
              <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                style={{ background:copied?"#196c2e":"#21262d",
                  border:"1px solid "+(copied?"#2ea043":"#30363d"),
                  borderRadius:3, color:copied?"#3fb950":"#8b949e",
                  padding:"2px 8px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                {copied ? "✓" : "Copy"}
              </button>
            </div>
            {/* Code body */}
            <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
              <pre style={{ margin:0, fontSize:11, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-all" }}>
                {code.split("\n").map((line, i) => (
                  <div key={i} style={{ display:"flex", gap:10 }}>
                    <span style={{ color:"#3d444d", minWidth:20, textAlign:"right", flexShrink:0, fontSize:9, paddingTop:1 }}>
                      {i+1}
                    </span>
                    <span style={{ color: highlight(line, codelang) }}>{line || " "}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
