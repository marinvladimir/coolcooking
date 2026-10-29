import { INK, palette } from '../../styles/theme';

/*
 * Retro "item collected" burst: pixel-art sprites fly out on a stepped
 * (12 fps) arc, snap to a 4px grid and flicker before disappearing,
 * like pickups in an 8-bit game.
 */

type Shape = 'heart' | 'star' | 'sparkle';
export type BurstKind = 'hearts' | 'food' | 'party';

const SHAPES: Record<Shape, string[]> = {
  heart: [
    '.kk.kk.',
    'kaakaak',
    'kawaaak',
    'kaaaaak',
    '.kaaak.',
    '..kak..',
    '...k...',
  ],
  star: [
    '...k...',
    '..kak..',
    'kkkwkkk',
    'kaaaaak',
    '.kaaak.',
    '.kakak.',
    'kk...kk',
  ],
  sparkle: ['..k..', '..a..', 'kawak', '..a..', '..k..'],
};

const FOOD = [
  'tomatoes',
  'strawberries',
  'cheese',
  'carrots',
  'eggs',
  'cherries',
  'bananas',
  'mushrooms',
  'lemons',
  'bread',
];

const COLORS = Object.values(palette);
const PIXEL = 4;
const FRAMES = 14;
const FRAME_MS = 70;

const shapeSvg = (shape: Shape, color: string) => {
  const rows = SHAPES[shape];
  const fill: Record<string, string> = { k: INK, a: color, w: '#ffffff' };
  const rects = rows
    .flatMap((row, y) =>
      [...row].map((char, x) =>
        fill[char]
          ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill[char]}"/>`
          : ''
      )
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges">${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const snap = (value: number) => Math.round(value / PIXEL) * PIXEL;

const makeSprite = (kind: BurstKind) => {
  const el = document.createElement('span');
  const useFood = kind === 'food' || (kind === 'party' && Math.random() < 0.5);
  const size = useFood ? 32 : pick([20, 28]);
  el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px;background-size:contain;background-repeat:no-repeat;image-rendering:pixelated;`;

  if (useFood) {
    el.style.backgroundImage = `url("/assets/icons/${pick(FOOD)}.png")`;
  } else {
    const shape: Shape =
      kind === 'hearts'
        ? pick(['heart', 'heart', 'sparkle'])
        : pick(['star', 'sparkle', 'heart']);
    const color =
      kind === 'hearts'
        ? pick([palette.tomato, palette.bubblegum])
        : pick(COLORS);
    el.style.backgroundImage = shapeSvg(shape, color);
  }
  return el;
};

interface BurstOptions {
  kind?: BurstKind;
  count?: number;
  /** Optional pixel-font word that pops up from the origin, e.g. "YUM!". */
  label?: string;
}

export const pixelBurst = (
  origin: HTMLElement | { x: number; y: number },
  { kind = 'party', count = 18, label }: BurstOptions = {}
) => {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  let x: number;
  let y: number;
  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else {
    ({ x, y } = origin);
  }

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;z-index:10000;pointer-events:none;`;
  document.body.appendChild(layer);

  const animations: Animation[] = [];

  for (let i = 0; i < count; i += 1) {
    const sprite = makeSprite(kind);
    layer.appendChild(sprite);

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const speed = 140 + Math.random() * 160;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const gravity = 520;
    const turns = pick([0, 0, 1, -1]);

    const frames: Keyframe[] = Array.from({ length: FRAMES + 1 }, (_, f) => {
      const t = (f / FRAMES) * 1.1;
      const px = snap(vx * t);
      const py = snap(vy * t + 0.5 * gravity * t * t);
      // Rotation in 90° jumps only – no smooth spinning in pixel land.
      const rotation = turns * 90 * Math.floor((f / FRAMES) * 4);
      const flicker = f > FRAMES - 4 ? (f % 2 ? 0 : 1) : 1;
      return {
        transform: `translate(${px}px, ${py}px) rotate(${rotation}deg)`,
        opacity: f === FRAMES ? 0 : flicker,
        easing: 'steps(1, end)',
      };
    });

    animations.push(
      sprite.animate(frames, {
        duration: FRAMES * FRAME_MS,
        delay: Math.random() * 120,
        fill: 'forwards',
      })
    );
  }

  if (label) {
    const word = document.createElement('span');
    word.textContent = label;
    word.style.cssText = `position:absolute;left:0;top:0;transform:translate(-50%,-50%);padding:4px 8px;font:700 16px 'Silkscreen',monospace;white-space:nowrap;color:${INK};background:${palette.mustard};border:3px solid ${INK};box-shadow:3px 3px 0 ${INK};`;
    layer.appendChild(word);
    animations.push(
      word.animate(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => ({
          transform: `translate(-50%, calc(-50% - ${snap(f * 7)}px)) scale(${f === 0 ? 0.6 : 1})`,
          opacity: f > 7 ? (f % 2 ? 0 : 1) : 1,
          easing: 'steps(1, end)',
        })),
        { duration: 11 * FRAME_MS * 1.3, fill: 'forwards' }
      )
    );
  }

  Promise.all(animations.map((animation) => animation.finished))
    .catch(() => undefined)
    .finally(() => layer.remove());
};
