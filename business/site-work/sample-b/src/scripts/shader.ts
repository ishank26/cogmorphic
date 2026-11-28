/**
 * Mounts the Paper Shaders dithering effect behind the hero and the final call to action.
 * - Waits until the page has loaded and the browser is idle, so the headline paints first.
 * - Never runs for visitors who ask for reduced motion, on small screens, or without WebGL.
 * - Paper Shaders pauses itself when the canvas is off screen or the tab is hidden.
 */
const PRESETS = {
  hero: { front: '#b37a00', back: '#0b0b0c', shape: 2, px: 3, speed: 0.25, scale: 0.9 },
  final: { front: '#6b4700', back: '#0b0b0c', shape: 1, px: 3, speed: 0.2, scale: 1.1 },
} as const;

let started = false;

function canRun(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(min-width: 768px)').matches) return false;
  const conn = (navigator as any).connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

async function start() {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>('[data-shader]'));
  if (!hosts.length || !canRun()) return;
  const { ShaderMount, ditheringFragmentShader, getShaderColorFromString, ShaderFitOptions } = await import('@paper-design/shaders');
  for (const host of hosts) {
    const preset = PRESETS[(host.dataset.shader as keyof typeof PRESETS) || 'hero'] ?? PRESETS.hero;
    const target = host.querySelector<HTMLElement>('.fx-canvas') ?? host;
    if (!target.getClientRects().length) continue; // hidden on this screen size
    try {
      const m = new ShaderMount(
        target,
        ditheringFragmentShader,
        {
          u_colorBack: getShaderColorFromString(preset.back),
          u_colorFront: getShaderColorFromString(preset.front),
          u_shape: preset.shape,
          u_type: 3, // 4x4 Bayer
          u_pxSize: preset.px,
          u_fit: ShaderFitOptions.cover,
          u_scale: preset.scale,
          u_rotation: 0,
          u_originX: 0.5,
          u_originY: 0.5,
          u_offsetX: 0.25,
          u_offsetY: 0,
          u_worldWidth: 0,
          u_worldHeight: 0,
        },
        { powerPreference: 'low-power' },
        preset.speed,
        0,
        1, // render at device pixels only, keeps the GPU cost low
        1920 * 1080,
      );
      m.canvasElement.addEventListener('webglcontextlost', () => host.classList.remove('is-live'));
      requestAnimationFrame(() => host.classList.add('is-live'));
    } catch {
      /* the still image stays */
    }
  }
}

export function mountShaders() {
  if (started) return;
  started = true;
  const go = () => {
    const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 300));
    idle(() => start(), { timeout: 2000 });
  };
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}
