"use client";

/**
 * Web Audio API Sound Synthesizer for Cart Actions
 * Creates a subtle whoosh on launch and a soft pluck on landing without external audio assets.
 */
function playCartSound(type: "whoosh" | "pluck") {
  try {
    const windowAudio = window as unknown as { webkitAudioContext?: typeof AudioContext };
    const AudioCtx = window.AudioContext || windowAudio.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "whoosh") {
      // Launch whoosh: Noise / Filter sweep
      const bufferSize = ctx.sampleRate * 0.18; // 180ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.18);
    } else if (type === "pluck") {
      // Landing pluck: Soft sine frequency slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext might be blocked before first user gesture; ignore gracefully
  }
}

export interface FlyOptions {
  sourceEl?: HTMLElement | null;
  cartSelector?: string;
  imageUrl?: string;
}

/**
 * Triggers the 2D flying image thumbnail animation toward the header cart icon (#cart-fly-target-header)
 */
export function flyImageToCart(
  sourceOrOptions: HTMLElement | null | FlyOptions,
  extraOptions?: { cartSelector?: string }
): void {
  if (typeof window === "undefined") return;

  let sourceEl: HTMLElement | null = null;
  let cartSelector = "#cart-fly-target-header";

  if (sourceOrOptions && "nodeType" in sourceOrOptions) {
    sourceEl = sourceOrOptions as HTMLElement;
    if (extraOptions?.cartSelector) {
      cartSelector = extraOptions.cartSelector;
    }
  } else if (sourceOrOptions && typeof sourceOrOptions === "object") {
    const opts = sourceOrOptions as FlyOptions;
    sourceEl = opts.sourceEl || null;
    if (opts.cartSelector) {
      cartSelector = opts.cartSelector;
    }
  }

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Locate target header cart element
  let targetEl: HTMLElement | null = document.querySelector(cartSelector) as HTMLElement | null;

  if (!targetEl) {
    targetEl =
      document.getElementById("cart-fly-target-header") ||
      document.querySelector('[aria-label="Shopping Cart"]') ||
      (document.querySelector('[href="/cart"]') as HTMLElement | null);
  }

  // Trigger pulse feedback function
  const triggerPulse = () => {
    playCartSound("pluck");
    if (targetEl) {
      targetEl.classList.remove("cart-fly-pulse");
      // Force reflow
      void targetEl.offsetWidth;
      targetEl.classList.add("cart-fly-pulse");
      setTimeout(() => {
        targetEl?.classList.remove("cart-fly-pulse");
      }, 500);
    }
  };

  // If user prefers reduced motion or source element missing, skip trajectory flight
  if (prefersReducedMotion || !sourceEl) {
    triggerPulse();
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();
  if (sourceRect.width === 0 || sourceRect.height === 0) {
    triggerPulse();
    return;
  }

  // Calculate start center coordinates
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;

  // Calculate end center coordinates (header cart icon next to avatar)
  let endX = window.innerWidth - 50;
  let endY = 28;

  if (targetEl) {
    const targetRect = targetEl.getBoundingClientRect();
    if (targetRect.width > 0 && targetRect.height > 0) {
      endX = targetRect.left + targetRect.width / 2;
      endY = targetRect.top + targetRect.height / 2;
    }
  }

  // Play launch sound at tap moment
  playCartSound("whoosh");

  // Create flyer clone element
  const flyer = document.createElement("div");
  flyer.style.position = "fixed";
  flyer.style.zIndex = "99999";
  flyer.style.pointerEvents = "none";
  flyer.style.top = "0px";
  flyer.style.left = "0px";
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;
  flyer.style.borderRadius = "16px";
  flyer.style.overflow = "hidden";
  flyer.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.25)";
  flyer.style.willChange = "transform, opacity";

  // Copy image node or background style
  const imgNode =
    sourceEl.tagName.toLowerCase() === "img"
      ? (sourceEl as HTMLImageElement)
      : sourceEl.querySelector("img");

  if (imgNode && imgNode.src) {
    const cloneImg = document.createElement("img");
    cloneImg.src = imgNode.src;
    cloneImg.style.width = "100%";
    cloneImg.style.height = "100%";
    cloneImg.style.objectFit = "cover";
    flyer.appendChild(cloneImg);
  } else {
    const clonedInner = sourceEl.cloneNode(true) as HTMLElement;
    clonedInner.style.width = "100%";
    clonedInner.style.height = "100%";
    flyer.appendChild(clonedInner);
  }

  document.body.appendChild(flyer);

  // Arc path control point calculation (raise arc upward toward top header)
  const controlX = (startX + endX) / 2;
  const controlY = Math.min(startY, endY) - 100;

  const duration = 650; // ms
  const startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);

    // Quadratic Bezier interpolation formula
    const currentX =
      (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    const currentY =
      (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

    // Scale from 1.0 down to 0.2
    const scale = 1 - t * 0.8;

    // Opacity remains 1 until t > 0.85
    const opacity = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;

    const translateX = currentX - sourceRect.width / 2;
    const translateY = currentY - sourceRect.height / 2;

    flyer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    flyer.style.opacity = `${opacity}`;

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      if (flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }
      triggerPulse();
    }
  }

  requestAnimationFrame(animate);
}
