import React, { useCallback, useEffect, useRef, useState } from 'react';

type TopLook = {
  id: string;
  name: string;
  detail: string;
  image: string;
  mask: string;
  color: string;
};

const TOPS: TopLook[] = [
  {
    id: 'TOP-01',
    name: 'Oversized poplin shirt',
    detail: 'Oversized / cotton poplin',
    image: '/tryon/top-01.jpg',
    mask: '/tryon/top-01-mask.png',
    color: '#F1E8D8',
  },
  {
    id: 'TOP-02',
    name: 'Fitted ribbed tank',
    detail: 'Fitted / ribbed jersey',
    image: '/tryon/top-02.jpg',
    mask: '/tryon/top-02-mask.png',
    color: '#171717',
  },
  {
    id: 'TOP-03',
    name: 'Boxy heavyweight tee',
    detail: 'Boxy / cotton jersey',
    image: '/tryon/top-03.jpg',
    mask: '/tryon/top-03-mask.png',
    color: '#F7F7F5',
  },
  {
    id: 'TOP-04',
    name: 'Relaxed satin blouse',
    detail: 'Relaxed / satin',
    image: '/tryon/top-04.jpg',
    mask: '/tryon/top-04-mask.png',
    color: '#D8C3A5',
  },
  {
    id: 'TOP-05',
    name: 'Fine-gauge merino top',
    detail: 'Slim / merino knit',
    image: '/tryon/top-05.jpg',
    mask: '/tryon/top-05-mask.png',
    color: '#B08A62',
  },
];

const COLORS = [
  { name: 'Ivory', hex: '#F1E8D8' },
  { name: 'Black', hex: '#171717' },
  { name: 'White', hex: '#F7F7F5' },
  { name: 'Champagne', hex: '#D8C3A5' },
  { name: 'Camel', hex: '#B08A62' },
  { name: 'Burgundy', hex: '#6E2A32' },
  { name: 'Cobalt', hex: '#2F4F7A' },
  { name: 'Olive', hex: '#5F6B4F' },
  { name: 'Slate', hex: '#6B7280' },
  { name: 'Chocolate', hex: '#4A3428' },
];

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

export const TryOnDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseDataRef = useRef<ImageData | null>(null);
  const maskDataRef = useRef<ImageData | null>(null);
  const savedTimer = useRef<number | undefined>(undefined);
  const [selectedTop, setSelectedTop] = useState(0);
  const [mainColor, setMainColor] = useState(TOPS[0].color);
  const [original, setOriginal] = useState(true);
  const [showMask, setShowMask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedLooks, setSavedLooks] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  const top = TOPS[selectedTop];

  const paintColor = useCallback((color: string) => {
    const canvas = canvasRef.current;
    const base = baseDataRef.current;
    const mask = maskDataRef.current;
    if (!canvas || !base || !mask) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const output = new ImageData(
      new Uint8ClampedArray(base.data),
      base.width,
      base.height
    );
    const data = output.data;
    const maskData = mask.data;
    const [targetR, targetG, targetB] = hexToRgb(color);
    for (let index = 0; index < data.length; index += 4) {
      const alpha = maskData[index] / 255;
      if (alpha < 0.02) continue;
      const luminance =
        (0.2126 * data[index] +
          0.7152 * data[index + 1] +
          0.0722 * data[index + 2]) /
        255;
      const shade = 0.35 + 0.8 * luminance;
      const blend = alpha * 0.9;
      data[index] = data[index] * (1 - blend) + targetR * shade * blend;
      data[index + 1] =
        data[index + 1] * (1 - blend) + targetG * shade * blend;
      data[index + 2] =
        data[index + 2] * (1 - blend) + targetB * shade * blend;
    }
    context.putImageData(output, 0, 0);
  }, []);

  const paintMask = useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseDataRef.current;
    const mask = maskDataRef.current;
    if (!canvas || !base || !mask) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const output = new ImageData(
      new Uint8ClampedArray(base.data),
      base.width,
      base.height
    );
    const data = output.data;
    const maskData = mask.data;
    for (let index = 0; index < data.length; index += 4) {
      const alpha = maskData[index] / 255;
      if (alpha < 0.02) continue;
      data[index] = data[index] * (1 - alpha) + 185 * alpha;
      data[index + 1] = data[index + 1] * (1 - alpha) + 83 * alpha;
      data[index + 2] = data[index + 2] * (1 - alpha) + 79 * alpha;
    }
    context.putImageData(output, 0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      baseDataRef.current = null;
      maskDataRef.current = null;
      try {
        const [image, mask] = await Promise.all([
          loadImage(top.image),
          loadImage(top.mask),
        ]);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0);
        const baseData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskContext = maskCanvas.getContext('2d');
        if (!maskContext) return;
        maskContext.drawImage(mask, 0, 0, canvas.width, canvas.height);
        const maskData = maskContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        baseDataRef.current = baseData;
        maskDataRef.current = maskData;
        context.putImageData(baseData, 0, 0);
        setMainColor(top.color);
        setOriginal(true);
        setShowMask(false);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [top]);

  useEffect(() => {
    if (!baseDataRef.current || !maskDataRef.current) return;
    if (showMask) {
      paintMask();
    } else if (original) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) context.putImageData(baseDataRef.current, 0, 0);
    } else {
      paintColor(mainColor);
    }
  }, [mainColor, original, paintColor, paintMask, showMask, selectedTop]);

  useEffect(
    () => () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    },
    []
  );

  const selectTop = (index: number) => {
    if (index === selectedTop) return;
    baseDataRef.current = null;
    maskDataRef.current = null;
    setSelectedTop(index);
  };

  const chooseColor = (color: string) => {
    setMainColor(color);
    setOriginal(false);
    setShowMask(false);
  };

  const saveLook = () => {
    setSavedLooks((count) => count + 1);
    setSaveMessage('Look saved on this device');
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaveMessage(''), 2200);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#F4F1EA]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-5">
            <a
              href="/"
              className="font-['Inter_Tight',sans-serif] text-[24px] font-medium tracking-[-0.02em]"
            >
              MUSE
            </a>
            <span className="hidden h-4 w-px bg-white/20 sm:block" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              Colour try-on / Studio demo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/35 sm:block">
              Tops / front view / live recolour
            </span>
            <a
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 transition hover:border-white/35 hover:text-white"
            >
              Back to site
            </a>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-5 py-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)]">
          <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#191716] bg-[radial-gradient(circle_at_50%_18%,rgba(185,83,79,0.13),transparent_55%)] p-5 sm:min-h-[680px] sm:p-8">
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9534F]" />
              Front view
            </div>
            <div className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 backdrop-blur">
              Layer demo
            </div>

            <canvas
              ref={canvasRef}
              aria-label={`${top.name} on the model`}
              className="max-h-[68vh] w-auto max-w-full rounded-[16px] object-contain shadow-[0_30px_90px_rgba(0,0,0,0.48)]"
            />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#191716]/75 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 backdrop-blur-sm">
                Loading garment layer
              </div>
            )}

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                Base model
                <span className="text-white/20">/</span>
                <span className="text-white/85">{top.id} top layer</span>
                <span className="text-white/20">/</span>
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: original ? '#B9BCC2' : mainColor }}
                />
                <span>{original ? 'Original colour' : mainColor}</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
                Drag-free / colour only
              </span>
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rounded-[28px] border border-white/10 bg-[#191716] p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                    Garment
                  </p>
                  <h1 className="mt-2 font-['Tinos',serif] text-[30px] leading-[1.05] sm:text-[36px]">
                    {top.name}
                  </h1>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.13em] text-white/45">
                    {top.id} / {top.detail}
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-full border border-[#B9534F]/40 bg-[#B9534F]/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#E19B95] sm:block">
                  Tops
                </div>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {TOPS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTop(index)}
                    aria-pressed={selectedTop === index}
                    className={`group relative overflow-hidden rounded-xl border bg-[#211E1C] transition ${
                      selectedTop === index
                        ? 'border-[#B9534F]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-[3/4] w-full object-cover opacity-80 transition group-hover:opacity-100"
                      style={{ objectPosition: '50% 34%' }}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1.5 pt-4 font-mono text-[8px] uppercase tracking-[0.08em] text-white/80">
                      {item.id}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#191716] p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                    Colour
                  </p>
                  <h2 className="mt-1 font-['Tinos',serif] text-[24px]">
                    Main fabric
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOriginal(true);
                    setShowMask(false);
                  }}
                  className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55 transition hover:border-white/35 hover:text-white"
                >
                  Reset
                </button>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOriginal(true);
                    setShowMask(false);
                  }}
                  aria-pressed={original}
                  className={`flex aspect-square items-center justify-center rounded-full border transition ${
                    original
                      ? 'border-[#B9534F] ring-2 ring-[#B9534F]/25'
                      : 'border-white/15 hover:border-white/35'
                  } bg-[linear-gradient(135deg,#F1E8D8_0%,#B08A62_50%,#171717_100%)]`}
                  aria-label="Original colour"
                  title="Original colour"
                />
                {COLORS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => chooseColor(color.hex)}
                    aria-pressed={!original && mainColor === color.hex}
                    title={`${color.name} ${color.hex}`}
                    className={`aspect-square rounded-full border transition ${
                      !original && mainColor === color.hex
                        ? 'border-[#B9534F] ring-2 ring-[#B9534F]/25'
                        : 'border-white/15 hover:scale-105 hover:border-white/35'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{
                      backgroundColor: original ? '#B9BCC2' : mainColor,
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/60">
                    {original ? 'Original render' : mainColor}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMask((value) => !value)}
                  className={`rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition ${
                    showMask
                      ? 'border-[#B9534F] bg-[#B9534F]/15 text-[#E19B95]'
                      : 'border-white/15 text-white/45 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {showMask ? 'Hide mask' : 'Show mask'}
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[#191716] p-5 sm:p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                Layer stack
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                    Base model
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
                    Locked
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#B9534F]/35 bg-[#B9534F]/[0.08] px-3 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/80">
                    {top.id} / top
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#E19B95]">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                    Colour overlay
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
                    {original ? 'Original' : mainColor}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={saveLook}
                  className="flex-1 rounded-xl bg-[#F4F1EA] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#171414] transition hover:bg-white"
                >
                  Save look
                </button>
                <div className="rounded-xl border border-white/10 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
                  {savedLooks} saved
                </div>
              </div>
              {saveMessage && (
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#E19B95]">
                  {saveMessage}
                </p>
              )}
            </section>

            <p className="px-2 font-mono text-[9px] leading-5 tracking-[0.04em] text-white/30">
              Demo note: masks are built from the front renders. Production assets
              will use tighter per-garment masks, separate trim and button zones,
              and front plus three-quarter layers.
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
};
