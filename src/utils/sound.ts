import { definePatch, ensureReady, type PlayOptions } from "@web-kits/audio";
import { _patch as minimal } from "../sounds/minimal";

const patch = definePatch(minimal);

const ENABLED_KEY = "sound-enabled";

let enabled = read();
let ctx: AudioContext | null = null;

function read(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(ENABLED_KEY) !== "false";
}

function supported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function unlock(): Promise<AudioContext | null> {
  return ensureReady()
    .then((audio) => {
      ctx = audio;
      return audio;
    })
    .catch(() => null);
}

const jitter = (cents = 10) => (Math.random() - 0.5) * 2 * cents;

export function prime() {
  if (enabled && supported()) unlock();
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
  if (enabled) {
    play("toggle-off");
    setEnabled(false);
  } else {
    setEnabled(true);
    unlock().then(() => play("toggle-on"));
  }
  return enabled;
}

export function play(sound: string, opts: PlayOptions = {}) {
  if (!enabled || !supported()) return;
  if (typeof document !== "undefined" && document.hidden) return;
  if (!patch.sounds.includes(sound)) return;
  if (!ctx || ctx.state !== "running") {
    unlock();
    return;
  }
  patch.play(sound, { detune: jitter(), ...opts });
}
