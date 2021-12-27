import Plugin from '../plugin';

type SizeOptions = {
  width: number | null;
  height: number | null;
  aspect: number | null;
  scale: 1;
  maxRenderWidth: number;
  maxRenderHeight: number;
  devicePixelRatio: true;
};

const DEFAULT_OPTIONS: SizeOptions = {
  width: null,
  height: null,
  aspect: null,
  scale: 1,
  maxRenderWidth: Infinity,
  maxRenderHeight: Infinity,
  devicePixelRatio: true,
};

export type ResizeEvent = {
  type: 'resize';
  renderWidth: number;
  renderHeight: number;
  viewWidth: number;
  viewHeight: number;
  aspect: number;
  pixelRatio: number;
};

export default class Size extends Plugin<SizeOptions> {
  api = {
    renderWidth: 0,
    renderHeight: 0,
    viewWidth: 0,
    viewHeight: 0,
    get: this.get,
    set: this.set,
  };

  listeners = [
    { target: window, eventName: 'resize', callback: this.queue },
    { target: this.three.element, eventName: 'resize', callback: this.queue },
    { target: this, eventName: 'change', callback: this.queue },
    { target: this.three, eventName: 'ready', callback: this.resize },
    { target: this.three, eventName: 'pre', callback: this.pre },
  ];

  resized: boolean;

  constructor(three: any, options: SizeOptions) {
    super(three, options, DEFAULT_OPTIONS);
    this.resized = false;
  }

  install(): void {
    this.bindListeners();

    this.three.Size = this.api;

    this.resized = false;
  }

  uninstall(): void {
    const { three } = this;
    delete three.Size;
  }

  queue(): void {
    this.resized = true;
  }

  pre(): void {
    if (!this.resized) return;
    this.resized = false;
    this.resize();
  }

  resize(): void {
    const { three, options } = this;
    const { element, renderer } = three;

    let w;
    let h;
    let rw;
    let rh;
    let aspect;
    let ratio;
    let ml = 0;
    let mt = 0;

    // Measure element
    const boundingRect = element.getBoundingClientRect();
    w =
      options.width === undefined || options.width == null
        ? boundingRect.width
        : options.width;
    const ew = w;

    h =
      options.height === undefined || options.height == null
        ? boundingRect.height
        : options.height;
    const eh = h;

    // Force aspect ratio
    aspect = w / h;
    if (options.aspect) {
      if (options.aspect > aspect) {
        h = Math.round(w / options.aspect);
        mt = Math.floor((eh - h) / 2);
      } else {
        w = Math.round(h * options.aspect);
        ml = Math.floor((ew - w) / 2);
      }
      aspect = w / h;
    }

    // Get device pixel ratio
    ratio = 1;
    if (options.devicePixelRatio && typeof window !== 'undefined') {
      ratio = window.devicePixelRatio || 1;
    }

    // Apply scale and resolution max
    rw = Math.round(
      Math.min(w * ratio * options.scale, options.maxRenderWidth),
    );
    rh = Math.round(
      Math.min(h * ratio * options.scale, options.maxRenderHeight),
    );

    // Retain aspect ratio
    const raspect = rw / rh;
    if (raspect > aspect) {
      rw = Math.round(rh * aspect);
    } else {
      rh = Math.round(rw / aspect);
    }

    // Measure final pixel ratio
    ratio = rh / h;

    // Resize and position renderer element
    const { style } = renderer.domElement;
    style.width = `${w}px`;
    style.height = `${h}px`;
    style.marginLeft = `${ml}px`;
    style.marginTop = `${mt}px`;

    // Notify
    const newValues = {
      renderWidth: rw,
      renderHeight: rh,
      viewWidth: w,
      viewHeight: h,
      aspect,
      pixelRatio: ratio,
    };

    this.api = {
      ...this.api,
      ...newValues,
    };

    const resizeEvent: ResizeEvent = {
      type: 'resize',
      ...newValues,
    };
    three.trigger(resizeEvent);
  }
}
