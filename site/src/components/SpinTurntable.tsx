import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface SpinTurntableHandle {
  spinTo: (turns: number) => void;
  getAngle: () => number;
  getVelocity: () => number;
  isDragging: () => boolean;
  isTweening: () => boolean;
  getFrameCount: () => number;
  getFrameBlob: (index: number) => Blob | undefined;
  stop: () => void;
}

interface SpinTurntableProps {
  videoSrc?: string;
  poster?: string;
  frames?: string[];
  fallbackSrc?: string;
  renderFrame?: (angle: number) => React.ReactNode;
  fit?: 'cover' | 'contain';
  defaultAngle?: number;
  autoSpinDelay?: number;
  autoSpinSpeed?: number;
  dragPixelsPerTurn?: number;
  className?: string;
  style?: React.CSSProperties;
  onAngleChange?: (angle: number) => void;
  onBackdropColor?: (color: string) => void;
  onCacheReady?: () => void;
  showProgress?: boolean;
  ariaLabel?: string;
}

const wrap = (value: number) => ((value % 1) + 1) % 1;

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

const seekVideo = (video: HTMLVideoElement, time: number) =>
  new Promise<void>((resolve) => {
    let timer = 0;
    const done = () => {
      video.removeEventListener('seeked', done);
      window.clearTimeout(timer);
      resolve();
    };
    video.addEventListener('seeked', done);
    timer = window.setTimeout(done, 300);
    video.currentTime = time;
  });

type FrameCallbackVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: { mediaTime: number }) => void
  ) => number;
};

export const SpinTurntable = forwardRef<SpinTurntableHandle, SpinTurntableProps>(
  (
    {
      videoSrc,
      poster,
      frames,
      fallbackSrc,
      renderFrame,
      fit = 'contain',
      defaultAngle = 0,
      autoSpinDelay = 3,
      autoSpinSpeed = 0.045,
      dragPixelsPerTurn = 900,
      className = '',
      style,
      onAngleChange,
      onBackdropColor,
      onCacheReady,
      showProgress = true,
      ariaLabel = 'Drag to rotate the model',
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleRef = useRef(defaultAngle);
    const velocityRef = useRef(0);
    const draggingRef = useRef(false);
    const idleRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const frameRef = useRef<number | undefined>(undefined);
    const tweenRef = useRef<{
      from: number;
      delta: number;
      start: number;
      duration: number;
    } | null>(null);
    const onAngleChangeRef = useRef(onAngleChange);
    const onBackdropColorRef = useRef(onBackdropColor);
    const onCacheReadyRef = useRef(onCacheReady);
    const backdropSentRef = useRef(false);
    const blobsRef = useRef<Blob[]>([]);
    const bitmapsRef = useRef<Map<number, ImageBitmap>>(new Map());
    const wantedRef = useRef(0);
    const lastNotifyRef = useRef(0);
    const lastFrameIndexRef = useRef(-1);
    const cacheStartedRef = useRef(false);
    const [renderAngle, setRenderAngle] = useState(wrap(defaultAngle));
    const [videoReady, setVideoReady] = useState(false);
    const [cacheReady, setCacheReady] = useState(false);
    const [cacheProgress, setCacheProgress] = useState(0);

    const useCachedVideo = Boolean(videoSrc) && !renderFrame && !(frames && frames.length > 0);

    useEffect(() => {
      onAngleChangeRef.current = onAngleChange;
      onBackdropColorRef.current = onBackdropColor;
      onCacheReadyRef.current = onCacheReady;
    }, [onAngleChange, onBackdropColor, onCacheReady]);

    const stop = useCallback(() => {
      tweenRef.current = null;
      velocityRef.current = 0;
    }, []);

    const spinTo = useCallback((turns: number) => {
      const from = angleRef.current;
      let delta = turns - from;
      delta = ((((delta + 0.5) % 1) + 1) % 1) - 0.5;
      velocityRef.current = 0;
      idleRef.current = 0;
      tweenRef.current = {
        from,
        delta,
        start: performance.now(),
        duration: 900 + Math.abs(delta) * 900,
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        spinTo,
        getAngle: () => angleRef.current,
        getVelocity: () => velocityRef.current,
        isDragging: () => draggingRef.current,
        isTweening: () => tweenRef.current !== null,
        getFrameCount: () => blobsRef.current.length,
        getFrameBlob: (index: number) => blobsRef.current[index],
        stop,
      }),
      [spinTo, stop]
    );

    const drawFrame = useCallback(() => {
      const canvas = canvasRef.current;
      const blobs = blobsRef.current;
      if (!canvas || blobs.length === 0) return;

      const index = Math.floor(wrap(angleRef.current) * blobs.length) % blobs.length;
      wantedRef.current = index;

      let bitmap = bitmapsRef.current.get(index);
      if (!bitmap) {
        const blob = blobs[index];
        if (!blob) return;
        void createImageBitmap(blob)
          .then((decoded) => {
            bitmapsRef.current.set(index, decoded);
            if (bitmapsRef.current.size > 18) {
              const oldest = bitmapsRef.current.keys().next().value;
              if (oldest !== undefined && oldest !== index) {
                bitmapsRef.current.get(oldest)?.close();
                bitmapsRef.current.delete(oldest);
              }
            }
            if (wantedRef.current === index) drawFrame();
          })
          .catch(() => undefined);
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) return;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      const scale =
        fit === 'cover'
          ? Math.max(canvasWidth / bitmap.width, canvasHeight / bitmap.height)
          : Math.min(canvasWidth / bitmap.width, canvasHeight / bitmap.height);
      const drawWidth = bitmap.width * scale;
      const drawHeight = bitmap.height * scale;
      context.drawImage(
        bitmap,
        (canvasWidth - drawWidth) / 2,
        (canvasHeight - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
    }, [fit]);

    useEffect(() => {
      let last = performance.now();

      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        const tween = tweenRef.current;
        if (tween) {
          const progress = Math.min(1, (now - tween.start) / tween.duration);
          angleRef.current = tween.from + tween.delta * easeInOutCubic(progress);
          if (progress >= 1) tweenRef.current = null;
        } else if (!draggingRef.current) {
          idleRef.current += dt;
          const target = idleRef.current > autoSpinDelay ? autoSpinSpeed : 0;
          const rate = target !== 0 ? 0.8 : 2.2;
          velocityRef.current += (target - velocityRef.current) * Math.min(1, dt * rate);
          angleRef.current += velocityRef.current * dt;
        }

        const normalized = wrap(angleRef.current);
        if (cacheReady) {
          drawFrame();
        } else if (frames && frames.length > 0) {
          const frameIndex =
            Math.floor(normalized * frames.length) % frames.length;
          if (frameIndex !== lastFrameIndexRef.current) {
            lastFrameIndexRef.current = frameIndex;
            setRenderAngle(normalized);
          }
        } else {
          setRenderAngle(normalized);
        }
        if (now - lastNotifyRef.current >= 50) {
          onAngleChangeRef.current?.(normalized);
          lastNotifyRef.current = now;
        }
        frameRef.current = requestAnimationFrame(tick);
      };

      frameRef.current = requestAnimationFrame(tick);
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }, [autoSpinDelay, autoSpinSpeed, cacheReady, drawFrame, frames]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const resize = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.round(root.clientWidth * dpr));
        canvas.height = Math.max(1, Math.round(root.clientHeight * dpr));
        drawFrame();
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(root);
      return () => observer.disconnect();
    }, [drawFrame, cacheReady]);

    useEffect(() => {
      blobsRef.current = [];
      bitmapsRef.current.forEach((bitmap) => bitmap.close());
      bitmapsRef.current.clear();
      cacheStartedRef.current = false;
      backdropSentRef.current = false;
      setCacheReady(false);
      setCacheProgress(0);
      setVideoReady(false);
    }, [videoSrc]);

    useEffect(() => {
      if (!useCachedVideo || !videoReady || cacheStartedRef.current) return;
      const video = videoRef.current as FrameCallbackVideo | null;
      if (!video || !video.duration || !video.videoWidth || !video.videoHeight) return;

      cacheStartedRef.current = true;
      let cancelled = false;
      const frameCount = Math.max(1, Math.round(video.duration * 24));
      const width = Math.min(720, video.videoWidth);
      const height = Math.round((width * video.videoHeight) / video.videoWidth);
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const context = offscreen.getContext('2d');
      if (!context) return;

      const blobs: (Blob | null)[] = new Array(frameCount).fill(null);
      const grab = () =>
        new Promise<Blob | null>((resolve) => {
          try {
            context.drawImage(video, 0, 0, width, height);
          } catch {
            resolve(null);
            return;
          }
          if (!backdropSentRef.current) {
            backdropSentRef.current = true;
            try {
              const pixel = context.getImageData(6, 6, 1, 1).data;
              onBackdropColorRef.current?.(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
            } catch {
              onBackdropColorRef.current?.('rgb(226, 228, 232)');
            }
          }
          offscreen.toBlob((blob) => resolve(blob), 'image/jpeg', 0.88);
        });

      const fillGaps = () => {
        for (let index = 0; index < blobs.length; index += 1) {
          if (blobs[index]) continue;
          let next = index + 1;
          while (next < blobs.length && !blobs[next]) next += 1;
          if (next < blobs.length) {
            for (let fill = index; fill < next; fill += 1) blobs[fill] = blobs[next];
            continue;
          }
          let previous = index - 1;
          while (previous >= 0 && !blobs[previous]) previous -= 1;
          if (previous >= 0) {
            for (let fill = previous + 1; fill <= index; fill += 1) blobs[fill] = blobs[previous];
          }
        }
      };

      const finish = () => {
        if (cancelled) return;
        fillGaps();
        if (blobs.length > 1) blobs.pop();
        blobsRef.current = blobs.filter((blob): blob is Blob => blob !== null);
        setCacheProgress(100);
        setCacheReady(true);
        video.pause();
        drawFrame();
        onCacheReadyRef.current?.();
      };

      const captureAll = async () => {
        for (let index = 0; index < frameCount; index += 1) {
          if (cancelled) return;
          await seekVideo(video, index / 24);
          const blob = await grab();
          if (blob) blobs[index] = blob;
          setCacheProgress(Math.round(((index + 1) / frameCount) * 100));
        }
        finish();
      };

      if (typeof video.requestVideoFrameCallback === 'function') {
        video.loop = false;
        video.currentTime = 0;
        const step = async (_now: number, metadata: { mediaTime: number }) => {
          if (cancelled) return;
          const index = Math.min(frameCount - 1, Math.max(0, Math.round(metadata.mediaTime * 24)));
          if (!blobs[index]) blobs[index] = await grab();
          setCacheProgress(Math.round(((index + 1) / frameCount) * 100));
          if (index < frameCount - 1) {
            video.requestVideoFrameCallback?.(step);
          } else {
            window.setTimeout(finish, 150);
          }
        };
        void video
          .play()
          .then(() => video.requestVideoFrameCallback?.(step))
          .catch(() => void captureAll());
      } else {
        video.pause();
        void captureAll();
      }

      return () => {
        cancelled = true;
      };
    }, [drawFrame, useCachedVideo, videoReady]);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      rootRef.current?.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      tweenRef.current = null;
      velocityRef.current = 0;
      idleRef.current = 0;
      lastXRef.current = event.clientX;
      lastTimeRef.current = performance.now();
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      idleRef.current = 0;
      if (!draggingRef.current) return;
      const now = performance.now();
      const deltaX = event.clientX - lastXRef.current;
      const deltaTime = Math.max(8, now - lastTimeRef.current);
      const delta = -deltaX / dragPixelsPerTurn;
      angleRef.current += delta;
      velocityRef.current = (delta / deltaTime) * 1000 * 0.6 + velocityRef.current * 0.4;
      lastXRef.current = event.clientX;
      lastTimeRef.current = now;
      if (!cacheReady) setRenderAngle(wrap(angleRef.current));
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      velocityRef.current = Math.max(-2.5, Math.min(2.5, velocityRef.current));
      idleRef.current = 0;
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      stop();
      angleRef.current += event.key === 'ArrowRight' ? 1 / 24 : -1 / 24;
      idleRef.current = 0;
      if (!cacheReady) setRenderAngle(wrap(angleRef.current));
    };

    const objectFitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
    let frame: React.ReactNode;
    if (renderFrame) {
      frame = renderFrame(renderAngle);
    } else if (useCachedVideo) {
      frame = (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            poster={poster}
            muted
            playsInline
            crossOrigin="anonymous"
            preload="auto"
            className={`absolute inset-0 h-full w-full ${objectFitClass} ${cacheReady ? 'opacity-0' : 'opacity-100'}`}
            onLoadedMetadata={() => setVideoReady(true)}
          />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 h-full w-full ${cacheReady ? 'opacity-100' : 'opacity-0'}`}
          />
          {!cacheReady && showProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#171414]/95 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
              Building frames {cacheProgress}%
            </div>
          )}
        </>
      );
    } else if (frames && frames.length > 0) {
      const index = Math.floor(renderAngle * frames.length) % frames.length;
      frame = <img src={frames[index]} alt="" className={`h-full w-full ${objectFitClass}`} />;
    } else if (fallbackSrc) {
      frame = <img src={fallbackSrc} alt="" className={`h-full w-full ${objectFitClass}`} />;
    }

    return (
      <div
        ref={rootRef}
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onKeyDown={onKeyDown}
        style={style}
        className={`relative touch-pan-y select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      >
        {frame}
      </div>
    );
  }
);

SpinTurntable.displayName = 'SpinTurntable';
