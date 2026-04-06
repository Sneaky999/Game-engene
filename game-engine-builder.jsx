import { useState, useRef, useEffect, useCallback, useReducer } from "react";

// ─── HIGH QUALITY SVG TILE RENDERER ───────────────────────────────────────
function TileSVG({ id, size = 36 }) {
  const s = size;
  const tiles = {
    // NATURE
    grass: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a4a1a"/><rect x={0} y={22} width={36} height={14} fill="#2d6e2d"/><rect x={2} y={18} width={3} height={8} fill="#3a8a2a" rx={1}/><rect x={8} y={15} width={3} height={11} fill="#44a030" rx={1}/><rect x={14} y={17} width={3} height={9} fill="#3a8a2a" rx={1}/><rect x={20} y={14} width={3} height={12} fill="#50b83c" rx={1}/><rect x={27} y={16} width={3} height={10} fill="#3a8a2a" rx={1}/><rect x={31} y={18} width={3} height={8} fill="#44a030" rx={1}/></svg>,

    dirt: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#5c3d1a"/><rect x={3} y={5} width={6} height={4} fill="#6e4a22" rx={1}/><rect x={15} y={10} width={8} height={3} fill="#4a2e10" rx={1}/><rect x={25} y={6} width={5} height={5} fill="#6e4a22" rx={1}/><rect x={8} y={20} width={7} height={4} fill="#4a2e10" rx={1}/><rect x={22} y={22} width={9} height={3} fill="#6e4a22" rx={1}/><circle cx={6} cy={28} r={3} fill="#4a2e10"/><circle cx={20} cy={14} r={2} fill="#7a5530"/></svg>,

    sand: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#c4a44a"/><rect x={0} y={0} width={36} height={36} fill="url(#sandGrad)"/><defs><linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4b85a"/><stop offset="100%" stopColor="#a8882a"/></linearGradient></defs><circle cx={8} cy={10} r={1.5} fill="#b89830" opacity={0.6}/><circle cx={22} cy={7} r={1} fill="#b89830" opacity={0.5}/><circle cx={30} cy={20} r={2} fill="#c4aa40" opacity={0.4}/><circle cx={14} cy={26} r={1.5} fill="#b89830" opacity={0.6}/><circle cx={5} cy={30} r={1} fill="#c4aa40" opacity={0.5}/></svg>,

    rock: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#2a2a2a"/><polygon points="6,30 2,30 8,8 14,6 20,10 18,30" fill="#3d3d3d"/><polygon points="18,30 16,12 24,6 32,10 34,30" fill="#4a4a4a"/><polygon points="6,30 18,30 16,12 8,8" fill="#333"/><line x1={10} y1={15} x2={8} y2={25} stroke="#555" strokeWidth={1}/><line x1={22} y1={12} x2={20} y2={22} stroke="#555" strokeWidth={1}/></svg>,

    snow: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#b8cfe8"/><rect x={0} y={20} width={36} height={16} fill="#d8eaf8"/><ellipse cx={10} cy={20} rx={8} ry={5} fill="#e8f4ff"/><ellipse cx={24} cy={18} rx={10} ry={6} fill="#f0f8ff"/><ellipse cx={32} cy={22} rx={6} ry={4} fill="#e0f0ff"/><circle cx={5} cy={8} r={1} fill="white" opacity={0.8}/><circle cx={15} cy={5} r={1.5} fill="white" opacity={0.7}/><circle cx={28} cy={9} r={1} fill="white" opacity={0.8}/></svg>,

    mountain: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a2a"/><polygon points="18,2 2,34 34,34" fill="#3d3d4d"/><polygon points="18,2 10,20 26,20" fill="#d8e8f0"/><polygon points="26,8 14,34 36,34" fill="#4a4a5a"/><polygon points="26,8 20,20 32,20" fill="#e0eef8"/><line x1={10} y1={22} x2={16} y2={30} stroke="#555" strokeWidth={0.8}/><line x1={24} y1={24} x2={28} y2={32} stroke="#555" strokeWidth={0.8}/></svg>,

    volcano: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a0800"/><polygon points="18,4 4,34 32,34" fill="#4a2010"/><polygon points="18,4 12,18 24,18" fill="#2a1408"/><ellipse cx={18} cy={14} rx={5} ry={3} fill="#ff4400" opacity={0.9}/><rect x={16} y={4} width={4} height={10} fill="#ff6600"/><circle cx={18} cy={4} r={4} fill="#ff8800"/><rect x={0} y={30} width={36} height={6} fill="#cc2200" opacity={0.7}/><ellipse cx={12} cy={30} rx={5} ry={2} fill="#ff4400"/><ellipse cx={25} cy={32} rx={4} ry={2} fill="#ff4400"/></svg>,

    swamp: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0f2010"/><rect x={0} y={22} width={36} height={14} fill="#1a3820" opacity={0.8}/><ellipse cx={18} cy={26} rx={14} ry={5} fill="#0a2a0a" opacity={0.7}/><rect x={4} y={12} width={2} height={14} fill="#2a4a10"/><rect x={3} y={10} width={5} height={3} fill="#3a6010" rx={2}/><rect x={24} y={8} width={2} height={18} fill="#2a4a10"/><rect x={22} y={6} width={6} height={3} fill="#3a6010" rx={2}/><circle cx={10} cy={28} r={2} fill="#1a4a10" opacity={0.6}/><circle cx={26} cy={30} r={3} fill="#0a2a0a" opacity={0.5}/></svg>,

    // WATER
    ocean: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1e40"/><rect x={0} y={10} width={36} height={6} fill="#0d2a5a" opacity={0.6}/><path d="M 0 14 Q 9 10 18 14 Q 27 18 36 14" stroke="#1a4a8a" strokeWidth={2} fill="none"/><path d="M 0 22 Q 9 18 18 22 Q 27 26 36 22" stroke="#1a4a8a" strokeWidth={2} fill="none"/><path d="M 0 30 Q 9 26 18 30 Q 27 34 36 30" stroke="#1a4a8a" strokeWidth={1.5} fill="none"/><rect x={0} y={0} width={36} height={10} fill="#081830" opacity={0.5}/></svg>,

    river: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a3a2a"/><path d="M 4 0 Q 18 10 4 20 Q -4 30 18 36" stroke="#1a6aaa" strokeWidth={12} fill="none" opacity={0.9}/><path d="M 4 0 Q 18 10 4 20 Q -4 30 18 36" stroke="#2a8acc" strokeWidth={8} fill="none" opacity={0.7}/><path d="M 4 0 Q 18 10 4 20 Q -4 30 18 36" stroke="#4aaae0" strokeWidth={3} fill="none" opacity={0.5}/></svg>,

    lava: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#3a0800"/><rect x={0} y={0} width={36} height={36} fill="#cc3300" opacity={0.3}/><path d="M 0 18 Q 9 12 18 18 Q 27 24 36 18" stroke="#ff6600" strokeWidth={3} fill="none"/><path d="M 0 26 Q 9 20 18 26 Q 27 32 36 26" stroke="#ff4400" strokeWidth={3} fill="none"/><circle cx={8} cy={10} r={3} fill="#ff8800"/><circle cx={22} cy={14} r={4} fill="#ff6600"/><circle cx={30} cy={8} r={2} fill="#ffaa00"/><rect x={0} y={30} width={36} height={6} fill="#ff2200" opacity={0.6}/></svg>,

    ice: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#9ab8d8"/><rect x={0} y={0} width={36} height={36} fill="#c8e0f8" opacity={0.5}/><polygon points="18,4 20,14 18,16 16,14" fill="white" opacity={0.7}/><polygon points="18,20 20,30 18,32 16,30" fill="white" opacity={0.7}/><polygon points="4,18 14,16 16,18 14,20" fill="white" opacity={0.7}/><polygon points="20,18 30,16 32,18 30,20" fill="white" opacity={0.7}/><circle cx={18} cy={18} r={3} fill="white" opacity={0.9}/><polygon points="18,8 19,12 18,13 17,12" fill="white" opacity={0.5}/></svg>,

    // FLORA
    pine: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1a0a"/><rect x={16} y={26} width={4} height={10} fill="#5c3a1a"/><polygon points="18,2 6,18 30,18" fill="#1a5a1a"/><polygon points="18,8 8,22 28,22" fill="#228822"/><polygon points="18,14 9,26 27,26" fill="#2aaa2a"/><polygon points="18,2 22,10 18,12 14,10" fill="#1a6a1a"/></svg>,

    oak: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1a0a"/><rect x={15} y={20} width={6} height={16} fill="#6e4a22"/><rect x={13} y={22} width={4} height={3} fill="#5a3a18"/><ellipse cx={18} cy={14} rx={12} ry={10} fill="#2a6a1a"/><ellipse cx={12} cy={16} rx={7} ry={6} fill="#338822"/><ellipse cx={24} cy={15} rx={7} ry={7} fill="#2d7a1d"/><ellipse cx={18} cy={10} rx={8} ry={6} fill="#3a9a2a"/></svg>,

    cactus: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a2a0a"/><rect x={15} y={8} width={6} height={28} fill="#2a7a1a"/><rect x={8} y={16} width={7} height={4} fill="#2a7a1a"/><rect x={5} y={12} width={4} height={8} fill="#2a7a1a"/><rect x={21} y={20} width={7} height={4} fill="#2a7a1a"/><rect x={24} y={16} width={4} height={8} fill="#2a7a1a"/><rect x={14} y={6} width={8} height={4} rx={2} fill="#3a9a2a"/><line x1={10} y1={15} x2={8} y2={13} stroke="#1a5a1a" strokeWidth={1}/><line x1={26} y1={19} x2={28} y2={17} stroke="#1a5a1a" strokeWidth={1}/></svg>,

    mushroom: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a0a0a"/><rect x={14} y={20} width={8} height={16} fill="#d4c0a0"/><ellipse cx={18} cy={20} rx={14} ry={8} fill="#cc2222"/><circle cx={10} cy={18} r={3} fill="white" opacity={0.8}/><circle cx={18} cy={14} r={2.5} fill="white" opacity={0.8}/><circle cx={26} cy={17} r={3} fill="white" opacity={0.8}/><ellipse cx={18} cy={27} rx={6} ry={2} fill="#b8a888" opacity={0.5}/></svg>,

    flower: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a1a0a"/><rect x={17} y={18} width={2} height={18} fill="#2a7a1a"/><ellipse cx={18} cy={12} rx={4} ry={6} fill="#ff88cc" transform="rotate(-30,18,12)"/><ellipse cx={18} cy={12} rx={4} ry={6} fill="#ff99dd" transform="rotate(30,18,12)"/><ellipse cx={18} cy={12} rx={4} ry={6} fill="#ff88cc" transform="rotate(90,18,12)"/><ellipse cx={18} cy={12} rx={4} ry={6} fill="#ff99dd" transform="rotate(150,18,12)"/><circle cx={18} cy={12} r={4} fill="#ffdd44"/><circle cx={14} cy={28} r={2} fill="#3aaa2a" opacity={0.6}/></svg>,

    // STRUCTURES
    wall: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#3a2e20"/><rect x={0} y={0} width={18} height={9} fill="#5a4830" rx={1}/><rect x={18} y={0} width={18} height={9} fill="#4a3820" rx={1}/><rect x={0} y={9} width={9} height={9} fill="#4a3820" rx={1}/><rect x={9} y={9} width={18} height={9} fill="#5a4830" rx={1}/><rect x={27} y={9} width={9} height={9} fill="#4a3820" rx={1}/><rect x={0} y={18} width={18} height={9} fill="#5a4830" rx={1}/><rect x={18} y={18} width={18} height={9} fill="#4a3820" rx={1}/><rect x={0} y={27} width={9} height={9} fill="#4a3820" rx={1}/><rect x={9} y={27} width={18} height={9} fill="#5a4830" rx={1}/><rect x={27} y={27} width={9} height={9} fill="#4a3820" rx={1}/><line x1={0} y1={9} x2={36} y2={9} stroke="#2a1e10" strokeWidth={1}/><line x1={0} y1={18} x2={36} y2={18} stroke="#2a1e10" strokeWidth={1}/><line x1={0} y1={27} x2={36} y2={27} stroke="#2a1e10" strokeWidth={1}/></svg>,

    castle: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a2a"/><rect x={4} y={16} width={28} height={20} fill="#3a3a4a"/><rect x={4} y={10} width={6} height={8} fill="#3a3a4a"/><rect x={14} y={10} width={8} height={8} fill="#3a3a4a"/><rect x={26} y={10} width={6} height={8} fill="#3a3a4a"/><rect x={4} y={8} width={6} height={4} fill="#4a4a5a"/><rect x={26} y={8} width={6} height={4} fill="#4a4a5a"/><rect x={14} y={6} width={8} height={6} fill="#4a4a5a"/><rect x={5} y={9} width={4} height={2} fill="#1a1a2a"/><rect x={27} y={9} width={4} height={2} fill="#1a1a2a"/><rect x={15} y={7} width={6} height={2} fill="#1a1a2a"/><rect x={15} y={22} width={6} height={14} fill="#2a2a3a"/><rect x={14} y={21} width={8} height={2} fill="#1a1a2a" rx={1}/></svg>,

    house: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1008"/><rect x={4} y={18} width={28} height={18} fill="#8b5e3c"/><polygon points="2,20 18,4 34,20" fill="#cc4422"/><polygon points="2,20 18,4 34,20" fill="none" stroke="#aa3310" strokeWidth={1}/><rect x={14} y={24} width={8} height={12} fill="#5a3820"/><rect x={7} y={22} width={7} height={7} fill="#88ccff" opacity={0.8}/><rect x={22} y={22} width={7} height={7} fill="#88ccff" opacity={0.8}/><line x1={10.5} y1={22} x2={10.5} y2={29} stroke="#666" strokeWidth={0.8}/><line x1={7} y1={25.5} x2={14} y2={25.5} stroke="#666" strokeWidth={0.8}/></svg>,

    tower: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a1a"/><rect x={10} y={6} width={16} height={30} fill="#3a3a4a"/><rect x={8} y={4} width={20} height={6} fill="#4a4a5a"/><rect x={8} y={4} width={5} height={3} fill="#2a2a3a"/><rect x={15} y={4} width={6} height={3} fill="#2a2a3a"/><rect x={23} y={4} width={5} height={3} fill="#2a2a3a"/><rect x={14} y={14} width={8} height={6} fill="#88aacc" opacity={0.7}/><rect x={14} y={13} width={8} height={1} fill="#2a2a3a"/><line x1={18} y1={13} x2={18} y2={20} stroke="#2a2a3a" strokeWidth={0.8}/><rect x={14} y={26} width={8} height={10} fill="#2a2a3a"/></svg>,

    dungeon: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a0808"/><rect x={0} y={14} width={36} height={22} fill="#1e1818"/><rect x={14} y={14} width={8} height={22} fill="#0a0808"/><ellipse cx={18} cy={14} rx={4} ry={3} fill="#0a0808"/><rect x={2} y={16} width={8} height={8} fill="#2a2020" rx={1}/><rect x={26} y={16} width={8} height={8} fill="#2a2020" rx={1}/><circle cx={6} cy={20} r={1.5} fill="#554444" opacity={0.8}/><circle cx={30} cy={20} r={1.5} fill="#554444" opacity={0.8}/><rect x={3} y={28} width={6} height={8} fill="#1a1414"/><rect x={27} y={28} width={6} height={8} fill="#1a1414"/><line x1={0} y1={22} x2={12} y2={22} stroke="#2a2020" strokeWidth={0.7}/><line x1={24} y1={22} x2={36} y2={22} stroke="#2a2020" strokeWidth={0.7}/></svg>,

    // GAME LOGIC
    spawn: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1a00"/><circle cx={18} cy={18} r={14} fill="#2a2a00" stroke="#aaaa00" strokeWidth={1.5}/><polygon points="18,6 21,16 32,16 23,22 26,32 18,26 10,32 13,22 4,16 15,16" fill="#ffff00" opacity={0.9}/></svg>,

    portal: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a0018"/><ellipse cx={18} cy={18} rx={13} ry={14} fill="#1a0030"/><ellipse cx={18} cy={18} rx={13} ry={14} fill="none" stroke="#aa44ff" strokeWidth={2}/><ellipse cx={18} cy={18} rx={9} ry={10} fill="none" stroke="#cc66ff" strokeWidth={1.5}/><ellipse cx={18} cy={18} rx={5} ry={6} fill="#dd88ff" opacity={0.5}/><circle cx={18} cy={18} r={3} fill="#ffffff" opacity={0.8}/><ellipse cx={18} cy={18} rx={13} ry={14} fill="none" stroke="#ff88ff" strokeWidth={0.8} strokeDasharray="4 4"/></svg>,

    chest: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a1000"/><rect x={4} y={16} width={28} height={18} fill="#8b5a10" rx={2}/><rect x={4} y={14} width={28} height={6} fill="#aa7020" rx={2}/><rect x={4} y={14} width={28} height={3} fill="#cc8830"/><rect x={14} y={20} width={8} height={8} fill="#8b5a10"/><rect x={14} y={20} width={8} height={8} fill="none" stroke="#cc9930" strokeWidth={1}/><circle cx={18} cy={24} r={2} fill="#ffcc00"/><rect x={4} y={14} width={28} height={2} fill="none" stroke="#663300" strokeWidth={0.8}/></svg>,

    enemy: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a0000"/><rect x={8} y={10} width={20} height={16} fill="#cc0000" rx={3}/><rect x={6} y={6} width={5} height={6} fill="#cc0000"/><rect x={25} y={6} width={5} height={6} fill="#cc0000"/><circle cx={13} cy={17} r={3} fill="white"/><circle cx={23} cy={17} r={3} fill="white"/><circle cx={14} cy={17} r={1.5} fill="#330000"/><circle cx={24} cy={17} r={1.5} fill="#330000"/><rect x={11} y={22} width={5} height={3} fill="#aa0000"/><rect x={20} y={22} width={5} height={3} fill="#aa0000"/><rect x={8} y={26} width={20} height={10} fill="#aa0000" rx={2}/><rect x={12} y={25} width={4} height={3} fill="#880000"/><rect x={20} y={25} width={4} height={3} fill="#880000"/></svg>,

    boss: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a0000"/><polygon points="18,2 22,12 32,8 26,18 34,22 22,22 22,34 18,28 14,34 14,22 2,22 10,18 4,8 14,12" fill="#cc0000"/><polygon points="18,2 22,12 32,8 26,18 34,22 22,22 22,34 18,28 14,34 14,22 2,22 10,18 4,8 14,12" fill="none" stroke="#ff4444" strokeWidth={1}/><circle cx={18} cy={18} r={5} fill="#ff0000"/><circle cx={18} cy={18} r={3} fill="#ffaa00"/></svg>,

    npc: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#001800"/><circle cx={18} cy={11} r={7} fill="#dda060"/><rect x={10} y={18} width={16} height={18} fill="#224488" rx={3}/><rect x={6} y={18} width={6} height={14} fill="#224488" rx={3}/><rect x={24} y={18} width={6} height={14} fill="#224488" rx={3}/><rect x={10} y={32} width={5} height={4} fill="#334455"/><rect x={21} y={32} width={5} height={4} fill="#334455"/><polygon points="12,4 18,2 24,4 22,8 18,7 14,8" fill="#886622"/></svg>,

    save_point: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#001020"/><rect x={6} y={6} width={24} height={24} fill="#1a3a5a" rx={3}/><rect x={6} y={6} width={24} height={24} fill="none" stroke="#4488cc" strokeWidth={1.5} rx={3}/><rect x={10} y={6} width={12} height={10} fill="#2a4a6a" rx={2}/><rect x={12} y={8} width={8} height={8} fill="#3a5a7a"/><rect x={10} y={18} width={16} height={10} fill="#2a4a6a" rx={1}/><circle cx={18} cy={23} r={3} fill="#4488cc"/><circle cx={18} cy={23} r={1.5} fill="#88ccff"/></svg>,

    // ENVIRONMENT
    torch: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#100800"/><rect x={15} y={18} width={6} height={18} fill="#8b5a1a"/><rect x={13} y={15} width={10} height={6} fill="#6a4010" rx={1}/><ellipse cx={18} cy={12} rx={5} ry={7} fill="#ff8800" opacity={0.9}/><ellipse cx={18} cy={10} rx={3} ry={5} fill="#ffcc00" opacity={0.8}/><ellipse cx={18} cy={8} rx={2} ry={3} fill="#ffffff" opacity={0.6}/><ellipse cx={14} cy={18} rx={6} ry={3} fill="#ff6600" opacity={0.15}/></svg>,

    light: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#101000"/><circle cx={18} cy={14} r={8} fill="#ffee88" opacity={0.95}/><circle cx={18} cy={14} r={5} fill="#ffffff"/><rect x={15} y={22} width={6} height={4} fill="#aaa" rx={1}/><rect x={14} y={26} width={8} height={2} fill="#888"/><line x1={18} y1={2} x2={18} y2={5} stroke="#ffee88" strokeWidth={2}/><line x1={5} y1={7} x2={8} y2={10} stroke="#ffee88" strokeWidth={2}/><line x1={31} y1={7} x2={28} y2={10} stroke="#ffee88" strokeWidth={2}/><line x1={2} y1={14} x2={5} y2={14} stroke="#ffee88" strokeWidth={2}/><line x1={34} y1={14} x2={31} y2={14} stroke="#ffee88" strokeWidth={2}/></svg>,

    campfire: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#0a0800"/><line x1={12} y1={36} x2={18} y2={22} stroke="#6e4010" strokeWidth={3}/><line x1={24} y1={36} x2={18} y2={22} stroke="#6e4010" strokeWidth={3}/><line x1={8} y1={34} x2={18} y2={22} stroke="#5a3008" strokeWidth={2}/><line x1={28} y1={34} x2={18} y2={22} stroke="#5a3008" strokeWidth={2}/><ellipse cx={18} cy={18} rx={8} ry={10} fill="#ff6600" opacity={0.9}/><ellipse cx={18} cy={16} rx={5} ry={7} fill="#ffaa00" opacity={0.9}/><ellipse cx={18} cy={14} rx={3} ry={5} fill="#ffee44" opacity={0.8}/><ellipse cx={18} cy={24} rx={10} ry={3} fill="#cc4400" opacity={0.4}/></svg>,

    fog: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#101820"/><ellipse cx={18} cy={14} rx={16} ry={8} fill="#aabbcc" opacity={0.3}/><ellipse cx={10} cy={20} rx={12} ry={6} fill="#c0ccdd" opacity={0.35}/><ellipse cx={24} cy={24} rx={14} ry={6} fill="#aabbcc" opacity={0.3}/><ellipse cx={14} cy={30} rx={10} ry={5} fill="#c0ccdd" opacity={0.35}/></svg>,

    trap: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1a0000"/><rect x={4} y={20} width={28} height={16} fill="#3a1a1a" rx={2}/><polygon points="18,4 22,20 14,20" fill="#cc0000"/><polygon points="4,8 14,20 8,20" fill="#aa0000"/><polygon points="32,8 22,20 28,20" fill="#aa0000"/><circle cx={18} cy={22} r={4} fill="#ff2200"/><rect x={16} y={26} width={4} height={10} fill="#cc1100"/></svg>,

    // PATHS
    road: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#1e1e1e"/><rect x={12} y={0} width={12} height={36} fill="#2a2a2a"/><line x1={18} y1={0} x2={18} y2={36} stroke="#888" strokeWidth={1} strokeDasharray="6 4"/><rect x={0} y={0} width={12} height={36} fill="#1a1a1a"/><rect x={24} y={0} width={12} height={36} fill="#1a1a1a"/></svg>,

    // CHARACTERS
    hero: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#000818"/><circle cx={18} cy={9} r={6} fill="#dda060"/><rect x={11} y={15} width={14} height={14} fill="#2244aa" rx={2}/><rect x={5} y={15} width={7} height={12} fill="#2244aa" rx={2}/><rect x={24} y={15} width={7} height={12} fill="#2244aa" rx={2}/><rect x={12} y={29} width={5} height={7} fill="#334455"/><rect x={19} y={29} width={5} height={7} fill="#334455"/><polygon points="26,12 34,8 32,18 24,16" fill="#cccccc"/><rect x={25} y={10} width={8} height={2} fill="#aaaaaa" rx={1}/></svg>,

    merchant: <svg width={s} height={s} viewBox="0 0 36 36"><rect width={36} height={36} fill="#080800"/><circle cx={18} cy={9} r={6} fill="#cc9050"/><rect x={11} y={15} width={14} height={14} fill="#884400" rx={2}/><rect x={5} y={15} width={7} height={12} fill="#884400" rx={2}/><rect x={24} y={15} width={7} height={12} fill="#884400" rx={2}/><rect x={12} y={29} width={5} height={7} fill="#553300"/><rect x={19} y={29} width={5} height={7} fill="#553300"/><circle cx={18} cy={22} r={5} fill="#996600"/><circle cx={18} cy={22} r={4} fill="#ccaa00"/><polygon points="18,19 19,22 22,22 20,24 21,27 18,25 15,27 16,24 14,22 17,22" fill="#ffdd00"/></svg>,
  };
  return tiles[id] || (
    <svg width={s} height={s} viewBox="0 0 36 36">
      <rect width={36} height={36} fill="#1a1a2a" rx={3}/>
      <text x={18} y={23} textAnchor="middle" fontSize={18} fill="#888">?</text>
    </svg>
  );
}

// ─── TILE DEFINITIONS ─────────────────────────────────────────────────────
const TILE_CATEGORIES = {
  "Nature": [
    { id:"grass",    label:"Grass",    color:"#1a3a1a", code:"GRASS" },
    { id:"dirt",     label:"Dirt",     color:"#3b2614", code:"DIRT" },
    { id:"sand",     label:"Sand",     color:"#4a3c1a", code:"SAND" },
    { id:"rock",     label:"Rock",     color:"#2e2e2e", code:"ROCK" },
    { id:"snow",     label:"Snow",     color:"#2a3040", code:"SNOW" },
    { id:"mountain", label:"Mountain", color:"#3a3a3a", code:"MOUNTAIN" },
    { id:"volcano",  label:"Volcano",  color:"#4a1a00", code:"VOLCANO" },
    { id:"swamp",    label:"Swamp",    color:"#1a2e14", code:"SWAMP" },
  ],
  "Water": [
    { id:"ocean",     label:"Ocean",    color:"#0a2040", code:"OCEAN" },
    { id:"river",     label:"River",    color:"#0d2a3a", code:"RIVER" },
    { id:"lava",      label:"Lava",     color:"#4a1400", code:"LAVA" },
    { id:"ice",       label:"Ice",      color:"#1a2a40", code:"ICE" },
  ],
  "Flora": [
    { id:"pine",     label:"Pine",     color:"#0f2e0f", code:"TREE_PINE" },
    { id:"oak",      label:"Oak",      color:"#1a3312", code:"TREE_OAK" },
    { id:"cactus",   label:"Cactus",   color:"#1a3010", code:"CACTUS" },
    { id:"mushroom", label:"Mushroom", color:"#3a1a10", code:"MUSHROOM" },
    { id:"flower",   label:"Flower",   color:"#3a1a2e", code:"FLOWER" },
  ],
  "Structures": [
    { id:"wall",    label:"Wall",    color:"#2e2416", code:"WALL" },
    { id:"castle",  label:"Castle",  color:"#2e2a20", code:"CASTLE" },
    { id:"house",   label:"House",   color:"#2e2010", code:"HOUSE" },
    { id:"tower",   label:"Tower",   color:"#2a2a2a", code:"TOWER" },
    { id:"dungeon", label:"Dungeon", color:"#1e1a14", code:"DUNGEON" },
  ],
  "Game Logic": [
    { id:"spawn",      label:"Spawn",      color:"#2a2600", code:"SPAWN_POINT" },
    { id:"portal",     label:"Portal",     color:"#1a0a2a", code:"PORTAL" },
    { id:"chest",      label:"Chest",      color:"#2e2010", code:"CHEST" },
    { id:"enemy",      label:"Enemy",      color:"#2a0a00", code:"ENEMY_SPAWN" },
    { id:"boss",       label:"Boss",       color:"#2e0000", code:"BOSS_SPAWN" },
    { id:"npc",        label:"NPC",        color:"#0a1a0a", code:"NPC_SPAWN" },
    { id:"save_point", label:"Save",       color:"#0a1a2a", code:"SAVE_POINT" },
  ],
  "Environment": [
    { id:"torch",    label:"Torch",    color:"#2a1800", code:"TORCH" },
    { id:"light",    label:"Light",    color:"#2a2a00", code:"LIGHT_SOURCE" },
    { id:"campfire", label:"Campfire", color:"#2e1400", code:"CAMPFIRE" },
    { id:"fog",      label:"Fog",      color:"#1e2030", code:"FOG_ZONE" },
    { id:"trap",     label:"Trap",     color:"#2e1000", code:"TRAP" },
  ],
  "Paths": [
    { id:"road", label:"Road", color:"#1e1e1e", code:"ROAD" },
  ],
  "Characters": [
    { id:"hero",     label:"Hero",     color:"#0a1a2a", code:"HERO_START" },
    { id:"merchant", label:"Merchant", color:"#2a2010", code:"MERCHANT" },
  ],
};

const ALL_PRESET_TILES = Object.values(TILE_CATEGORIES).flat();
const CAT_ICONS = { "Nature":"🌍","Water":"💧","Flora":"🌲","Structures":"🏗️","Game Logic":"⚡","Environment":"💡","Paths":"🛣️","Characters":"🎭" };
const TILE_SIZE = 40;
const MIN_ZOOM = 0.15, MAX_ZOOM = 4;
const LAYER_COLORS = ["#3d8a4a","#8a4a9a","#4a6a9a","#9a8a20","#9a4a40","#3a8a8a","#6a8a3a","#9a6a40"];

const DEFAULT_LAYERS = [
  { id:"ground",     name:"Ground",     visible:true, locked:false, opacity:1,    color:"#3d8a4a" },
  { id:"decoration", name:"Decoration", visible:true, locked:false, opacity:1,    color:"#8a4a9a" },
  { id:"objects",    name:"Objects",    visible:true, locked:false, opacity:1,    color:"#4a6a9a" },
  { id:"logic",      name:"Game Logic", visible:true, locked:false, opacity:0.9,  color:"#9a8a20" },
];

// ─── REDUCER ──────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "PAINT": {
      const { layerId, x, y, tileId } = action;
      const key = `${x},${y}`;
      const lyr = { ...(state.layers[layerId] || {}) };
      if (tileId === null) delete lyr[key]; else lyr[key] = tileId;
      return { ...state, layers: { ...state.layers, [layerId]: lyr } };
    }
    case "ADD_LAYER": {
      const id = `lyr_${Date.now()}`;
      return {
        ...state,
        layerDefs: [...state.layerDefs, { id, name:action.name, visible:true, locked:false, opacity:1, color:action.color }],
        layers: { ...state.layers, [id]: {} },
      };
    }
    case "REMOVE_LAYER": {
      const layerDefs = state.layerDefs.filter(l => l.id !== action.id);
      const layers = { ...state.layers }; delete layers[action.id];
      return { ...state, layerDefs, layers };
    }
    case "TOGGLE_VISIBLE": return { ...state, layerDefs: state.layerDefs.map(l => l.id===action.id ? {...l,visible:!l.visible} : l) };
    case "TOGGLE_LOCK":    return { ...state, layerDefs: state.layerDefs.map(l => l.id===action.id ? {...l,locked:!l.locked} : l) };
    case "SET_OPACITY":    return { ...state, layerDefs: state.layerDefs.map(l => l.id===action.id ? {...l,opacity:action.val} : l) };
    case "REORDER": {
      const defs = [...state.layerDefs];
      const [m] = defs.splice(action.from,1); defs.splice(action.to,0,m);
      return { ...state, layerDefs: defs };
    }
    case "CLEAR_LAYER": return { ...state, layers: { ...state.layers, [action.id]: {} } };
    case "SET_GRID":    return { ...state, gridW:action.w, gridH:action.h };
    case "ADD_CUSTOM":  return { ...state, customTiles:[...state.customTiles, action.tile] };
    case "DEL_CUSTOM":  return { ...state, customTiles:state.customTiles.filter(t=>t.id!==action.id) };
    case "PUSH_HISTORY":return { ...state, history:[...state.history.slice(-39), action.snap] };
    case "UNDO":        return state.history.length ? {...state, layers:state.history[state.history.length-1], history:state.history.slice(0,-1)} : state;
    default: return state;
  }
}

function initState() {
  const layers = {}; DEFAULT_LAYERS.forEach(l => { layers[l.id] = {}; });
  return { layerDefs: DEFAULT_LAYERS, layers, gridW:36, gridH:24, customTiles:[], history:[] };
}

// ─── CODE GEN ─────────────────────────────────────────────────────────────
function genCode(state, worldName, lang, allTiles) {
  const find = id => allTiles.find(t=>t.id===id) || { code:id.toUpperCase() };
  const total = Object.values(state.layers).reduce((s,l)=>s+Object.keys(l).length,0);
  const wName = worldName.replace(/\s+/g,"_");
  if (lang==="json") {
    return JSON.stringify({ world:worldName, grid:{w:state.gridW,h:state.gridH,tileSize:32},
      layers: state.layerDefs.map(layer=>({ id:layer.id, name:layer.name, opacity:layer.opacity??1, visible:layer.visible,
        tiles: Object.entries(state.layers[layer.id]||{}).map(([k,tid])=>{ const [x,y]=k.split(",").map(Number); return {x,y,tile:find(tid).code}; })
      }))}, null, 2);
  }
  if (lang==="py") {
    const L = [`# World: ${worldName}  ${state.gridW}x${state.gridH}  Objects:${total}`,``,`class World_${wName}:`,`    def build(self):`];
    state.layerDefs.forEach(layer=>{
      const objs=Object.entries(state.layers[layer.id]||{});
      if(!objs.length) return;
      L.push(`        # ${layer.name}`);
      objs.forEach(([k,tid])=>{ const [x,y]=k.split(",").map(Number); L.push(`        self.place("${find(tid).code}",${x},${y},layer="${layer.id}")`); });
      L.push(``);
    });
    return L.join("\n");
  }
  const L = [`// World: ${worldName}  ${state.gridW}x${state.gridH}  Objects:${total}`,``,`class World_${wName} {`,`  static meta={name:"${worldName}",gridW:${state.gridW},gridH:${state.gridH}};`,``,`  build(engine){`];
  state.layerDefs.forEach(layer=>{
    const objs=Object.entries(state.layers[layer.id]||{});
    if(!objs.length) return;
    L.push(`    // ${layer.name}`);
    L.push(`    const ${layer.id}=engine.createLayer("${layer.name}",{opacity:${layer.opacity??1}});`);
    objs.forEach(([k,tid])=>{ const [x,y]=k.split(",").map(Number); L.push(`    ${layer.id}.place("${find(tid).code}",${x},${y});`); });
    L.push(``);
  });
  L.push(`  }`); L.push(`}`);
  return L.join("\n");
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initState);
  const [activeLayer, setActiveLayer]   = useState("ground");
  const [activeTile, setActiveTile]     = useState("grass");
  const [tool, setTool]                 = useState("paint");
  const [zoom, setZoom]                 = useState(1);
  const [pan, setPan]                   = useState({ x:20, y:20 });
  const [isPainting, setIsPainting]     = useState(false);
  const [isPanning, setIsPanning]       = useState(false);
  const [panStart, setPanStart]         = useState(null);
  const [worldName, setWorldName]       = useState("MyWorld");
  const [leftTab, setLeftTab]           = useState("tiles");
  const [codelang, setCodelang]         = useState("js");
  const [copied, setCopied]             = useState(false);
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("Nature");
  const [showAddLayer, setShowAddLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [showCustom, setShowCustom]     = useState(false);
  const [cIcon, setCIcon]               = useState("🎯");
  const [cLabel, setCLabel]             = useState("");
  const [cCode, setCCode]               = useState("");
  const [gridWI, setGridWI]             = useState(36);
  const [gridHI, setGridHI]             = useState(24);
  const [hovered, setHovered]           = useState(null);
  const [showCode, setShowCode]         = useState(true);
  const canvasRef = useRef(null);
  const lastCell  = useRef(null);

  const allTiles = [...ALL_PRESET_TILES, ...state.customTiles];

  const filteredTiles = search
    ? allTiles.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : (TILE_CATEGORIES[category] || []);

  const getCell = useCallback((cx,cy) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.floor((cx - rect.left - pan.x) / (zoom * TILE_SIZE)),
      y: Math.floor((cy - rect.top  - pan.y) / (zoom * TILE_SIZE)),
    };
  }, [pan, zoom]);

  const doPaint = useCallback((x, y) => {
    const key = `${x},${y}`;
    if (lastCell.current === key) return;
    lastCell.current = key;
    const layer = state.layerDefs.find(l => l.id === activeLayer);
    if (!layer || layer.locked) return;
    dispatch({ type:"PUSH_HISTORY", snap: { ...state.layers } });
    dispatch({ type:"PAINT", layerId:activeLayer, x, y, tileId: tool==="erase" ? null : activeTile });
  }, [activeLayer, activeTile, tool, state.layerDefs, state.layers]);

  const onMouseDown = useCallback((e) => {
    if (e.button===1 || e.altKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    if (e.button !== 0) return;
    setIsPainting(true);
    lastCell.current = null;
    const c = getCell(e.clientX, e.clientY);
    if (c) doPaint(c.x, c.y);
  }, [pan, getCell, doPaint]);

  const onMouseMove = useCallback((e) => {
    if (isPanning && panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    const c = getCell(e.clientX, e.clientY);
    setHovered(c);
    if (isPainting && c) doPaint(c.x, c.y);
  }, [isPanning, panStart, isPainting, getCell, doPaint]);

  const onMouseUp = useCallback(() => {
    setIsPainting(false); setIsPanning(false);
    setPanStart(null); lastCell.current = null;
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
    const sc = nz/zoom;
    setPan(p => ({ x: mx - sc*(mx-p.x), y: my - sc*(my-p.y) }));
    setZoom(nz);
  }, [zoom]);

  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    el.addEventListener("wheel", onWheel, { passive:false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey||e.metaKey) && e.key==="z") dispatch({type:"UNDO"}); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const totalObjects = Object.values(state.layers).reduce((s,l)=>s+Object.keys(l).length,0);
  const activeLayerDef = state.layerDefs.find(l=>l.id===activeLayer);
  const activeTileDef  = allTiles.find(t=>t.id===activeTile);
  const code = genCode(state, worldName, codelang, allTiles);

  // Build render list — bottom layers first
  const renderTiles = [];
  state.layerDefs.forEach(layer => {
    if (!layer.visible) return;
    Object.entries(state.layers[layer.id]||{}).forEach(([key, tileId]) => {
      const [x,y] = key.split(",").map(Number);
      const tile = allTiles.find(t=>t.id===tileId);
      if (tile) renderTiles.push({ x, y, tile, layer, uid:`${layer.id}_${key}` });
    });
  });

  // ── styles ──
  const inp = { background:"#0d1117", border:"1px solid #30363d", borderRadius:5,
    color:"#e6edf3", padding:"5px 8px", fontFamily:"inherit", fontSize:11,
    outline:"none", boxSizing:"border-box", width:"100%" };

  const activeLayerColor = activeLayerDef?.color || "#388bfd";

  return (
    <div style={{ height:"100vh", background:"#060a0f", color:"#c9d1d9",
      fontFamily:"'JetBrains Mono','Fira Code','Courier New',monospace",
      display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none" }}>

      {/* ═══════════ TOP BAR ═══════════ */}
      <div style={{ height:46, background:"#0d1117", borderBottom:"1px solid #21262d",
        display:"flex", alignItems:"center", padding:"0 14px", gap:10, flexShrink:0 }}>

        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#388bfd", boxShadow:"0 0 8px #388bfd" }}/>
          <span style={{ color:"#e6edf3", fontWeight:700, fontSize:13, letterSpacing:1 }}>GAMEFORGE</span>
        </div>

        <div style={{ width:1, height:20, background:"#21262d" }}/>

        <input value={worldName} onChange={e=>setWorldName(e.target.value)}
          style={{ ...inp, width:150, padding:"3px 8px", fontSize:12 }}/>

        <div style={{ width:1, height:20, background:"#21262d" }}/>

        {[{id:"paint",icon:"✏",label:"Paint"},{id:"erase",icon:"◻",label:"Erase"}].map(t=>(
          <button key={t.id} onClick={()=>setTool(t.id)}
            style={{ display:"flex", alignItems:"center", gap:5, background:tool===t.id?"#161b22":"transparent",
              border:`1px solid ${tool===t.id?(t.id==="erase"?"#f78166":"#388bfd"):"transparent"}`,
              borderRadius:5, color:tool===t.id?(t.id==="erase"?"#f78166":"#58a6ff"):"#6e7681",
              padding:"4px 12px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}

        <button onClick={()=>dispatch({type:"UNDO"})}
          style={{ background:"transparent", border:"1px solid transparent", borderRadius:5,
            color:"#6e7681", padding:"4px 10px", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          ↩ Undo
        </button>

        <div style={{ flex:1 }}/>
        <span style={{ fontSize:10, color:"#3d444d" }}>zoom {Math.round(zoom*100)}%</span>
        <button onClick={()=>{ setZoom(1); setPan({x:20,y:20}); }}
          style={{ background:"transparent", border:"1px solid #30363d", borderRadius:4,
            color:"#6e7681", padding:"3px 10px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
          Reset
        </button>
        <button onClick={()=>setShowCode(s=>!s)}
          style={{ background:showCode?"#161b22":"transparent",
            border:`1px solid ${showCode?"#388bfd":"#30363d"}`,
            borderRadius:4, color:showCode?"#58a6ff":"#6e7681",
            padding:"3px 12px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
          {"{}"} Code
        </button>
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* ═══════════ LEFT SIDEBAR ═══════════ */}
        <div style={{ width:228, background:"#0d1117", borderRight:"1px solid #21262d",
          display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

          {/* Tabs */}
          <div style={{ display:"flex", background:"#080c10", borderBottom:"1px solid #21262d", flexShrink:0 }}>
            {[["tiles","Tiles"],["layers","Layers"],["world","World"]].map(([id,lb])=>(
              <button key={id} onClick={()=>setLeftTab(id)}
                style={{ flex:1, background:"transparent", border:"none",
                  borderBottom:`2px solid ${leftTab===id?"#388bfd":"transparent"}`,
                  color:leftTab===id?"#58a6ff":"#6e7681",
                  padding:"9px 0 7px", cursor:"pointer", fontSize:11, fontFamily:"inherit",
                  transition:"color 0.15s" }}>
                {lb}
              </button>
            ))}
          </div>

          {/* ── TILES TAB ── */}
          {leftTab==="tiles" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"8px 8px 5px", flexShrink:0 }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tiles…"
                  style={inp}/>
              </div>

              {!search && (
                <div style={{ padding:"0 8px 6px", flexShrink:0, display:"flex", flexWrap:"wrap", gap:3,
                  borderBottom:"1px solid #21262d" }}>
                  {Object.keys(TILE_CATEGORIES).map(cat=>(
                    <button key={cat} onClick={()=>setCategory(cat)}
                      style={{ background:category===cat?"#161b22":"transparent",
                        border:`1px solid ${category===cat?"#388bfd":"#21262d"}`,
                        borderRadius:4, color:category===cat?"#58a6ff":"#6e7681",
                        padding:"2px 7px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                      {CAT_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ flex:1, overflowY:"auto", padding:"8px",
                display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
                {filteredTiles.map(tile => {
                  const isActive = activeTile===tile.id;
                  return (
                    <button key={tile.id} title={tile.label}
                      onClick={()=>{ setActiveTile(tile.id); setTool("paint"); }}
                      style={{ background: isActive?"#1c2128":"#0d1117",
                        border:`2px solid ${isActive?"#388bfd":"#21262d"}`,
                        borderRadius:8, padding:"6px 4px 4px", cursor:"pointer",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                        transition:"border-color 0.1s, background 0.1s",
                        boxShadow: isActive?"0 0 10px rgba(56,139,253,0.25)":"none" }}>
                      <TileSVG id={tile.id} size={48}/>
                      <span style={{ fontSize:9, color:isActive?"#58a6ff":"#8b949e",
                        textAlign:"center", lineHeight:1.3, fontWeight:isActive?600:400 }}>
                        {tile.label}
                      </span>
                    </button>
                  );
                })}
                {!search && state.customTiles.map(tile=>{
                  const isActive = activeTile===tile.id;
                  return (
                    <button key={tile.id} title={tile.label}
                      onClick={()=>{ setActiveTile(tile.id); setTool("paint"); }}
                      style={{ background:isActive?"#1c2128":"#0d1117",
                        border:`2px solid ${isActive?"#f78166":"#30363d"}`,
                        borderRadius:8, padding:"6px 4px 4px", cursor:"pointer",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                        position:"relative" }}>
                      <div style={{ width:48, height:48, background:"#1a1a2a", borderRadius:4,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                        {tile.icon}
                      </div>
                      <span style={{ fontSize:9, color:"#f78166", textAlign:"center" }}>{tile.label}</span>
                      <span onMouseDown={e=>{ e.stopPropagation(); dispatch({type:"DEL_CUSTOM",id:tile.id}); }}
                        style={{ position:"absolute",top:3,right:5,fontSize:10,color:"#6e7681",cursor:"pointer",fontWeight:"bold" }}>×</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ borderTop:"1px solid #21262d", padding:"8px", flexShrink:0 }}>
                {!showCustom ? (
                  <button onClick={()=>setShowCustom(true)}
                    style={{ width:"100%", background:"transparent", border:"1px dashed #30363d",
                      borderRadius:6, color:"#6e7681", padding:"7px", cursor:"pointer",
                      fontSize:11, fontFamily:"inherit" }}>+ Custom Tile</button>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <input value={cIcon} onChange={e=>setCIcon(e.target.value)}
                        style={{ ...inp, width:36, padding:"3px 2px", fontSize:18, textAlign:"center" }}/>
                      <input value={cLabel} onChange={e=>setCLabel(e.target.value)} placeholder="Label"
                        style={{ ...inp, flex:1, width:"auto" }}/>
                    </div>
                    <input value={cCode} onChange={e=>setCCode(e.target.value)} placeholder="CODE_NAME" style={inp}/>
                    <div style={{ display:"flex", gap:5 }}>
                      <button onClick={()=>{
                        if(!cLabel.trim()||!cCode.trim()) return;
                        dispatch({type:"ADD_CUSTOM",tile:{id:`c_${Date.now()}`,icon:cIcon,label:cLabel.trim(),code:cCode.trim().toUpperCase(),color:"#2a1a2a"}});
                        setCIcon("🎯"); setCLabel(""); setCCode(""); setShowCustom(false);
                      }} style={{ flex:1,background:"#196c2e",border:"none",borderRadius:4,color:"#3fb950",padding:"5px",cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>
                        ✓ Add
                      </button>
                      <button onClick={()=>setShowCustom(false)}
                        style={{ background:"#161b22",border:"none",borderRadius:4,color:"#6e7681",padding:"5px 9px",cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>✕</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LAYERS TAB ── */}
          {leftTab==="layers" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ flex:1, overflowY:"auto", padding:"8px" }}>
                {[...state.layerDefs].reverse().map((layer, ri) => {
                  const realIdx = state.layerDefs.length-1-ri;
                  const isActive = activeLayer===layer.id;
                  return (
                    <div key={layer.id}
                      onClick={()=>{ setActiveLayer(layer.id); }}
                      style={{ background:isActive?"#161b22":"#0d1117",
                        border:`1.5px solid ${isActive?layer.color:"#21262d"}`,
                        borderRadius:8, padding:"10px", marginBottom:6, cursor:"pointer",
                        transition:"border-color 0.15s, background 0.1s",
                        boxShadow:isActive?`0 0 12px ${layer.color}33`:"none" }}>

                      {/* Layer header */}
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:12, height:12, borderRadius:3,
                          background:layer.visible?layer.color:"#3d444d", flexShrink:0,
                          boxShadow:layer.visible?`0 0 6px ${layer.color}88`:"none" }}/>
                        <span style={{ flex:1, fontSize:12, fontWeight:isActive?600:400,
                          color:isActive?"#e6edf3":"#8b949e",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {layer.name}
                        </span>
                        <span style={{ fontSize:10, color:"#3d444d", background:"#161b22",
                          padding:"1px 5px", borderRadius:3 }}>
                          {Object.keys(state.layers[layer.id]||{}).length}
                        </span>
                      </div>

                      {/* Expanded controls — only for active layer */}
                      {isActive && (
                        <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:7 }}
                          onClick={e=>e.stopPropagation()}>

                          <div style={{ display:"flex", gap:5 }}>
                            <button onClick={()=>dispatch({type:"TOGGLE_VISIBLE",id:layer.id})}
                              style={{ flex:1, background:layer.visible?"#0f2a1a":"#1c2128",
                                border:`1px solid ${layer.visible?"#2ea043":"#30363d"}`,
                                borderRadius:4, color:layer.visible?"#3fb950":"#6e7681",
                                padding:"4px 2px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                              {layer.visible?"👁 Visible":"🙈 Hidden"}
                            </button>
                            <button onClick={()=>dispatch({type:"TOGGLE_LOCK",id:layer.id})}
                              style={{ flex:1, background:layer.locked?"#2a1010":"#1c2128",
                                border:`1px solid ${layer.locked?"#f78166":"#30363d"}`,
                                borderRadius:4, color:layer.locked?"#f78166":"#6e7681",
                                padding:"4px 2px", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>
                              {layer.locked?"🔒 Locked":"🔓 Free"}
                            </button>
                          </div>

                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:9, color:"#3d444d", flexShrink:0 }}>Opacity</span>
                            <input type="range" min={0} max={1} step={0.05} value={layer.opacity??1}
                              onChange={e=>dispatch({type:"SET_OPACITY",id:layer.id,val:+e.target.value})}
                              style={{ flex:1, accentColor:layer.color, cursor:"pointer" }}/>
                            <span style={{ fontSize:10, color:"#8b949e", width:30, textAlign:"right" }}>
                              {Math.round((layer.opacity??1)*100)}%
                            </span>
                          </div>

                          <div style={{ display:"flex", gap:4 }}>
                            <button onClick={()=>dispatch({type:"REORDER",from:realIdx,to:Math.max(0,realIdx-1)})}
                              style={{ background:"#161b22",border:"1px solid #30363d",borderRadius:4,color:"#8b949e",padding:"3px 8px",cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>↑</button>
                            <button onClick={()=>dispatch({type:"REORDER",from:realIdx,to:Math.min(state.layerDefs.length-1,realIdx+1)})}
                              style={{ background:"#161b22",border:"1px solid #30363d",borderRadius:4,color:"#8b949e",padding:"3px 8px",cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>↓</button>
                            <button onClick={()=>{ if(window.confirm(`Clear all tiles on "${layer.name}"?`)) dispatch({type:"CLEAR_LAYER",id:layer.id}); }}
                              style={{ flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:4,color:"#8b949e",padding:"3px",cursor:"pointer",fontSize:10,fontFamily:"inherit" }}>
                              Clear
                            </button>
                            {state.layerDefs.length>1 && (
                              <button onClick={()=>{ if(window.confirm(`Delete "${layer.name}"?`)){ dispatch({type:"REMOVE_LAYER",id:layer.id}); setActiveLayer(state.layerDefs.find(l=>l.id!==layer.id)?.id||""); } }}
                                style={{ background:"#3d1a1a",border:"1px solid #f78166",borderRadius:4,color:"#f78166",padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit" }}>
                                🗑
                              </button>
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
                  <button onClick={()=>setShowAddLayer(true)}
                    style={{ width:"100%", background:"transparent", border:"1px dashed #30363d",
                      borderRadius:6, color:"#6e7681", padding:"7px", cursor:"pointer",
                      fontSize:11, fontFamily:"inherit" }}>+ Add Layer</button>
                ) : (
                  <div style={{ display:"flex", gap:5 }}>
                    <input value={newLayerName} onChange={e=>setNewLayerName(e.target.value)}
                      placeholder="Layer name" autoFocus style={{ ...inp, flex:1, width:"auto" }}/>
                    <button onClick={()=>{
                      if(!newLayerName.trim()) return;
                      dispatch({type:"ADD_LAYER",name:newLayerName.trim(),color:LAYER_COLORS[state.layerDefs.length%LAYER_COLORS.length]});
                      setNewLayerName(""); setShowAddLayer(false);
                    }} style={{ background:"#196c2e",border:"none",borderRadius:4,color:"#3fb950",padding:"5px 10px",cursor:"pointer",fontFamily:"inherit",fontSize:12 }}>✓</button>
                    <button onClick={()=>setShowAddLayer(false)}
                      style={{ background:"#161b22",border:"none",borderRadius:4,color:"#6e7681",padding:"5px 9px",cursor:"pointer",fontFamily:"inherit",fontSize:12 }}>✕</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── WORLD TAB ── */}
          {leftTab==="world" && (
            <div style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
              <div style={{ fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>GRID SIZE</div>
              <div style={{ display:"flex", gap:7, marginBottom:7 }}>
                {[["W",gridWI,setGridWI],["H",gridHI,setGridHI]].map(([label,val,set])=>(
                  <div key={label} style={{ flex:1 }}>
                    <div style={{ fontSize:10,color:"#6e7681",marginBottom:3 }}>{label}</div>
                    <input type="number" value={val} min={4} max={999} onChange={e=>set(+e.target.value)}
                      style={{ ...inp, fontSize:12 }}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>dispatch({type:"SET_GRID",w:gridWI,h:gridHI})}
                style={{ width:"100%", background:"#1f6feb", border:"none", borderRadius:5,
                  color:"white", padding:"7px", cursor:"pointer", fontSize:12, fontFamily:"inherit", marginBottom:20 }}>
                Apply {gridWI}×{gridHI}
              </button>

              <div style={{ fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>STATS</div>
              {[["Grid",`${state.gridW}×${state.gridH}`],["Layers",state.layerDefs.length],
                ["Objects",totalObjects],["Custom",state.customTiles.length]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",
                  padding:"6px 0",borderBottom:"1px solid #21262d",fontSize:12 }}>
                  <span style={{ color:"#6e7681" }}>{k}</span>
                  <span style={{ color:"#e6edf3", fontWeight:600 }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop:20, fontSize:10, color:"#3d444d", letterSpacing:2, marginBottom:8 }}>CONTROLS</div>
              {[["✏️ Left drag","Paint"],["🖱 Middle / Alt","Pan camera"],["⚙ Scroll","Zoom in/out"],["⌨️ Ctrl+Z","Undo"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:11 }}>
                  <span style={{ color:"#8b949e" }}>{k}</span>
                  <span style={{ color:"#6e7681" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ CANVAS ═══════════ */}
        <div ref={canvasRef}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          style={{ flex:1, overflow:"hidden", position:"relative",
            cursor: isPanning?"grabbing" : tool==="erase"?"cell":"crosshair",
            background:"#060a0f" }}>

          {/* Active layer indicator strip */}
          <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)",
            background:"#0d1117dd", border:`1px solid ${activeLayerColor}`,
            borderRadius:20, padding:"4px 14px", fontSize:11, zIndex:10,
            display:"flex", alignItems:"center", gap:7, backdropFilter:"blur(8px)" }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:activeLayerColor,
              boxShadow:`0 0 8px ${activeLayerColor}` }}/>
            <span style={{ color:activeLayerColor, fontWeight:600 }}>
              {activeLayerDef?.name || "No layer"}
            </span>
            <span style={{ color:"#3d444d" }}>·</span>
            <span style={{ color:"#6e7681" }}>{tool}</span>
          </div>

          {/* World viewport */}
          <div style={{ position:"absolute", left:pan.x, top:pan.y }}>
            {/* Grid lines via SVG */}
            <svg style={{ position:"absolute",top:0,left:0,pointerEvents:"none" }}
              width={state.gridW*TILE_SIZE*zoom} height={state.gridH*TILE_SIZE*zoom}>
              <defs>
                <pattern id="g" width={TILE_SIZE*zoom} height={TILE_SIZE*zoom} patternUnits="userSpaceOnUse">
                  <path d={`M${TILE_SIZE*zoom} 0L0 0 0 ${TILE_SIZE*zoom}`}
                    fill="none" stroke="#141c24" strokeWidth={zoom>1.5?0.8:0.5}/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#060a0f"/>
              <rect width="100%" height="100%" fill="url(#g)"/>
              <rect width="100%" height="100%" fill="none"
                stroke={activeLayerColor} strokeWidth={2} opacity={0.3}/>
            </svg>

            {/* Rendered tiles */}
            {renderTiles.map(({ x, y, tile, layer, uid }) => (
              <div key={uid} style={{
                position:"absolute",
                left:x*TILE_SIZE*zoom, top:y*TILE_SIZE*zoom,
                width:TILE_SIZE*zoom, height:TILE_SIZE*zoom,
                opacity:layer.opacity??1, pointerEvents:"none",
                overflow:"hidden",
              }}>
                <div style={{ width:TILE_SIZE, height:TILE_SIZE,
                  transform:`scale(${zoom})`, transformOrigin:"0 0" }}>
                  {tile.svgEl ? tile.svgEl : <TileSVG id={tile.id} size={TILE_SIZE}/>}
                </div>
              </div>
            ))}

            {/* Hover preview */}
            {hovered && hovered.x>=0 && hovered.x<state.gridW && hovered.y>=0 && hovered.y<state.gridH && (
              <div style={{
                position:"absolute",
                left:hovered.x*TILE_SIZE*zoom, top:hovered.y*TILE_SIZE*zoom,
                width:TILE_SIZE*zoom, height:TILE_SIZE*zoom,
                border:`${Math.max(1.5,zoom)}px solid ${tool==="erase"?"#f78166":activeLayerColor}`,
                background:tool==="erase"?"rgba(247,129,102,0.15)":"rgba(56,139,253,0.08)",
                boxShadow:`inset 0 0 ${6*zoom}px ${tool==="erase"?"rgba(247,129,102,0.2)":`${activeLayerColor}22`}`,
                pointerEvents:"none", boxSizing:"border-box", overflow:"hidden",
              }}>
                {tool!=="erase" && activeTileDef && (
                  <div style={{ width:TILE_SIZE, height:TILE_SIZE, opacity:0.6,
                    transform:`scale(${zoom})`, transformOrigin:"0 0" }}>
                    <TileSVG id={activeTile} size={TILE_SIZE}/>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:27,
            background:"rgba(6,10,15,0.92)", borderTop:"1px solid #21262d",
            display:"flex", alignItems:"center", gap:20, padding:"0 14px", fontSize:11 }}>
            <span style={{ color:"#3d444d" }}>Grid <span style={{ color:"#6e7681" }}>{state.gridW}×{state.gridH}</span></span>
            {hovered && <span style={{ color:"#3d444d" }}>Cell <span style={{ color:"#58a6ff" }}>[{hovered.x},{hovered.y}]</span></span>}
            {activeTileDef && <span style={{ color:"#3d444d" }}>Tile <span style={{ color:"#e6edf3" }}>{activeTileDef.label}</span></span>}
            <span style={{ marginLeft:"auto", color:"#3d444d" }}>
              Objects <span style={{ color:"#3fb950", fontWeight:700 }}>{totalObjects}</span>
            </span>
          </div>
        </div>

        {/* ═══════════ CODE PANEL ═══════════ */}
        {showCode && (
          <div style={{ width:280, borderLeft:"1px solid #21262d", background:"#0d1117",
            display:"flex", flexDirection:"column", flexShrink:0 }}>
            <div style={{ padding:"8px 10px", borderBottom:"1px solid #21262d",
              display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
              <span style={{ fontSize:11,color:"#58a6ff",flex:1,fontWeight:600 }}>Generated Code</span>
              {["js","py","json"].map(l=>(
                <button key={l} onClick={()=>setCodelang(l)}
                  style={{ background:codelang===l?"#161b22":"transparent",
                    border:`1px solid ${codelang===l?"#388bfd":"#21262d"}`,
                    borderRadius:3,color:codelang===l?"#58a6ff":"#6e7681",
                    padding:"2px 8px",cursor:"pointer",fontSize:10,fontFamily:"inherit" }}>{l}</button>
              ))}
              <button onClick={()=>{ navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                style={{ background:copied?"#0f2a1a":"#161b22",
                  border:`1px solid ${copied?"#2ea043":"#30363d"}`,
                  borderRadius:3,color:copied?"#3fb950":"#6e7681",
                  padding:"2px 9px",cursor:"pointer",fontSize:10,fontFamily:"inherit" }}>
                {copied?"✓":"Copy"}
              </button>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
              <pre style={{ margin:0,fontSize:11,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-all" }}>
                {code.split("\n").map((line,i)=>{
                  let c="#e6edf3";
                  if(/^(#|\/\/)/.test(line.trim())) c="#6e7681";
                  else if(/\b(class|def|const|let|static)\b/.test(line)) c="#ff7b72";
                  else if(/\.(place|createLayer)\(/.test(line)) c="#79c0ff";
                  else if(/"[^"]+"/.test(line)) c="#a5d6ff";
                  return (
                    <div key={i} style={{ display:"flex",gap:10 }}>
                      <span style={{ color:"#3d444d",minWidth:18,textAlign:"right",flexShrink:0,fontSize:9,paddingTop:2 }}>{i+1}</span>
                      <span style={{ color:c }}>{line||" "}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
