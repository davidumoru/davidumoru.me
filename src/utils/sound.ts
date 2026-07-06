import {
  definePatch,
  ensureReady,
  type PlayOptions,
  type SoundPatch,
} from "@web-kits/audio";
import minimalData from "../sounds/minimal.json";

const patch = definePatch(minimalData as SoundPatch);

const ENABLED_KEY = "sound-enabled";

let enabled = read();
let ctx: AudioContext | null = null;

function read(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(ENABLED_KEY) === "true";
}

function unlock() {
  ensureReady()
    .then((audio) => {
      ctx = audio;
    })
    .catch(() => {});
}

const jitter = (cents = 10) => (Math.random() - 0.5) * 2 * cents;

export function prime() {
  if (enabled) unlock();
}

export function isEnabled() {
  return enabled;
}

export function setEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(ENABLED_KEY, String(next));
  } catch {}
  if (next) unlock();
}

export function toggle() {
  setEnabled(!enabled);
  return enabled;
}

export function play(sound: string, opts: PlayOptions = {}) {
  if (!enabled) return;
  if (typeof document !== "undefined" && document.hidden) return;
  if (!ctx || ctx.state !== "running") return;
  if (!patch.sounds.includes(sound)) return;
  patch.play(sound, { detune: jitter(), ...opts });
}
