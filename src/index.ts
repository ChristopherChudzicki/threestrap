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
import Fill from './core/fill';
import Loop from './core/loop';
import Time from './core/time';
import Scene from './core/scene';
import Camera from './core/camera';
import './core/render.js';
import Warmup from './core/warmup';

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
// @ts-ignore
THREE.Bootstrap.registerPlugin('loop', Loop);
// @ts-ignore
THREE.Bootstrap.registerPlugin('camera', Camera);
// @ts-ignore
THREE.Bootstrap.registerPlugin('time', Time);
// @ts-ignore
THREE.Bootstrap.registerPlugin('warmup', Warmup);
// @ts-ignore
THREE.Bootstrap.registerPlugin('scene', Scene);

// @ts-ignore
THREE.Bootstrap.registerPlugin('fill', Fill);
