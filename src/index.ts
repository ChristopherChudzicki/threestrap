/* eslint-disable @typescript-eslint/ban-ts-comment */
import './globals.js';
import './binder.js';
import './api.js';
import './bootstrap.js';
import './pluginOld.js';
import './aliases.js';
import './core/fallback.js';
import './core/renderer.js';
import './core/bind.js';
import Size from './core/size';
import './core/fill.js';
import './core/loop.js';
import './core/time.js';
import './core/scene.js';
import './core/camera.js';
import './core/render.js';
import './core/warmup.js';

import './vendor/stats.min.js';
import './vendor/controls/DeviceOrientationControls.js';
import './vendor/controls/FirstPersonControls.js';
import './vendor/controls/OrbitControls.js';
import './vendor/controls/TrackballControls.js';
import './vendor/controls/VRControls.js';

import './extra/stats.js';
import './extra/controls.js';
import './extra/cursor.js';
import './extra/fullscreen.js';
import './extra/vr.js';
import './extra/ui.js';

// @ts-ignore
THREE.Bootstrap.registerPlugin('size', Size);
