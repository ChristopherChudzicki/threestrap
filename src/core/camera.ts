import _ from 'lodash';
import Plugin, { makeChangeEvent } from '../plugin';
import type { ChangeEvent } from '../plugin';
import type { ResizeEvent } from './size';

type CameraOptions = {
  near: number;
  far: number;

  type: 'perspective' | 'orthographic';
  fov: number;
  aspect: number | null;

  // type: 'orthographic',
  left: number;
  right: number;
  bottom: number;
  top: number;

  // custom camera
  klass: any;
  parameters: any;
};

const DEFAULT_CAMERA_OPTIONS: CameraOptions = {
  near: 0.1,
  far: 10000,

  type: 'perspective',
  fov: 60,
  aspect: null,

  // type: 'orthographic',
  left: -1,
  right: 1,
  bottom: -1,
  top: 1,

  klass: null,
  parameters: null,
};

const THREE = window.THREE as any;

export default class Camera extends Plugin<CameraOptions> {
  listen = [
    {
      type: 'resize',
      target: this.three,
      listener: this.resize,
    },
    {
      type: 'change',
      target: this as Camera,
      listener: this.change,
    },
  ];

  api = {
    set: this.set,
    get: this.get,
  };

  aspect: number;

  constructor(three: any, options: Partial<CameraOptions>) {
    super(three, options, DEFAULT_CAMERA_OPTIONS);
    this.aspect = 1;
  }

  onInstall(): boolean {
    this.three.Camera = this.api;
    this.three.camera = null;

    const changeEvent = makeChangeEvent(this.options, {});
    this.change(changeEvent);
    return true;
  }

  onUninstall(): void {
    delete this.three.Camera;
    delete this.three.camera;
  }

  change(event: ChangeEvent<CameraOptions>): void {
    const { three } = this;
    const o = this.options;
    const old = three.camera;

    if (!three.camera || event.changes.type || event.changes.klass) {
      const Klass =
        o.klass ||
        {
          perspective: THREE.PerspectiveCamera,
          orthographic: THREE.OrthographicCamera,
        }[o.type] ||
        THREE.Camera;

      three.camera = o.parameters ? new Klass(o.parameters) : new Klass();
    }

    Object.entries(o).forEach(([key, value]) => {
      if (_.has(three.camera, key)) {
        three.camera[key] = value;
      }
    });

    this.update();

    if (old !== three.camera) {
      three.trigger({
        type: 'camera',
        camera: three.camera,
      });
    }
  }

  resize(event: ResizeEvent): void {
    this.aspect = event.viewWidth / Math.max(1, event.viewHeight);

    this.update();
  }

  update() {
    const { three } = this;
    three.camera.aspect = this.options.aspect || this.aspect;
    three.camera.updateProjectionMatrix();
  }
}
