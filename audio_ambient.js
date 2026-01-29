import { state } from './state.js';
import { showNotification } from './helpers.js';

// const btn = document.getElementById('btnAudio');
// const slider = document.getElementById('audioVol');

let ctx = null;
let gain = null;
let hum1 = null;
let hum2 = null;
let vuTimer = null;

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  if (!gain) {
    gain = ctx.createGain();
    gain.gain.value = (state.ui && state.ui.ambient ? state.ui.ambient.volume : 0.2) || 0.2;
    gain.connect(ctx.destination);
  }
}

function startAmbient() {
  ensureCtx();
  if (hum1 || hum2) return;
  hum1 = ctx.createOscillator();
  hum2 = ctx.createOscillator();
  hum1.type = 'sine';
  hum2.type = 'sine';
  hum1.frequency.value = 60;
  hum2.frequency.value = 120;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.18;
  hum1.connect(humGain); hum2.connect(humGain); humGain.connect(gain);
  hum1.start(); hum2.start();
  startVuTicks();
}

function stopAmbient() {
  if (hum1) { hum1.stop(); hum1.disconnect(); hum1 = null; }
  if (hum2) { hum2.stop(); hum2.disconnect(); hum2 = null; }
  stopVuTicks();
}

function setVolume(v) {
  const vol = Math.max(0, Math.min(1, Number(v)));
  state.ui = state.ui || {};
  state.ui.ambient = state.ui.ambient || { enabled: false, volume: 0.2 };
  state.ui.ambient.volume = vol;
  if (gain) gain.gain.value = vol;
}

function updateUI() {
  // if (!btn) return;
  // const enabled = !!(state.ui && state.ui.ambient && state.ui.ambient.enabled);
  // btn.textContent = enabled ? 'Audio: ON' : 'Audio: OFF';
  // if (slider) slider.value = String(Math.round(((state.ui && state.ui.ambient && state.ui.ambient.volume) || 0.2) * 100));
}

function toggleAmbient() {
  state.ui = state.ui || {};
  state.ui.ambient = state.ui.ambient || { enabled: false, volume: 0.2 };
  state.ui.ambient.enabled = !state.ui.ambient.enabled;
  if (state.ui.ambient.enabled) startAmbient();
  else stopAmbient();
  updateUI();
  try { if (typeof window.saveState === 'function') window.saveState(); } catch (e) {}
  if (typeof showNotification === 'function') showNotification(state.ui.ambient.enabled ? '🎧 Audio ON' : '🔇 Audio OFF');
}

export function playClick(volume = 0.03) {
  try {
    ensureCtx();
    const osc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    clickGain.gain.setValueAtTime(0.001, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(clickGain); clickGain.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function startVuTicks() {
  if (vuTimer) return;
  vuTimer = setInterval(() => {
    if (state.ui && state.ui.ambient && state.ui.ambient.enabled) {
      playClick(0.015);
    }
  }, 1400);
}

function stopVuTicks() {
  if (vuTimer) clearInterval(vuTimer);
  vuTimer = null;
}

// if (btn) btn.addEventListener('click', toggleAmbient);
// if (slider) slider.addEventListener('input', () => {
//   const v = Number(slider.value) / 100;
//   setVolume(v);
//   updateUI();
//   try { if (typeof window.saveState === 'function') window.saveState(); } catch (e) {}
// });

if (typeof window !== 'undefined') {
  window.playClick = playClick;
  updateUI();
}
