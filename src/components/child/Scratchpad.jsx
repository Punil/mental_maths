import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, Trash2, Maximize2, Minimize2, Palette } from 'lucide-react';

export default function Scratchpad({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isOpen]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setLastPos(pos);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scroll while drawing on touch devices

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 18 : lineWidth;
    ctx.stroke();

    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#2563eb', '#10b981', '#dc2626', '#1e293b', '#9333ea'];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-dashed border-indigo-200 overflow-hidden shadow-sm">
      {/* Top Bar / Tools */}
      <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 border-b border-indigo-100 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
            ✏️ Rough Work Scratchpad
          </span>
        </div>

        {/* Color & Tool options */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEraser(false)}
            className={`p-1.5 rounded-lg text-sm font-semibold transition ${
              !isEraser ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-indigo-100'
            }`}
            title="Pen"
          >
            <Pen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`p-1.5 rounded-lg text-sm font-semibold transition ${
              isEraser ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-indigo-100'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Color picks */}
          {!isEraser && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-indigo-200">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-indigo-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition"
            title="Clear Scratchpad"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Drawing Area */}
      <div className="relative flex-1 bg-amber-50/20 cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
        <div className="absolute bottom-2 right-2 pointer-events-none text-[11px] text-slate-400 bg-white/80 px-2 py-0.5 rounded-md">
          Doodle or carry numbers here
        </div>
      </div>
    </div>
  );
}
