import Plugin from '../plugin';

type WarmupOptions = {
  delay: number;
};

const DEFAULT_WARMUP_OPTIONS: WarmupOptions = {
  delay: 2,
};

export default class Warmup extends Plugin<WarmupOptions> {
  api = {
    get: this.get,
    set: this.set,
  };

  // listen: ['ready', 'post'],
  listeners = [
    { target: this.three, eventName: 'ready', callback: this.ready },
    { target: this.three, eventName: 'post', callback: this.post },
  ];

  frame = 0;

  hidden = true;

  constructor(three: any, options: WarmupOptions) {
    super(three, options, DEFAULT_WARMUP_OPTIONS);
  }

  install(): void {
    this.bindListeners();
    this.three.Warmup = this.api;
  }

  ready(): void {
    this.three.renderer.domElement.style.visibility = 'hidden';
  }

  post(): void {
    if (this.hidden && this.frame >= this.options.delay) {
      this.three.renderer.domElement.style.visibility = 'visible';
      this.hidden = false;
    }
    this.frame += 1;
  }
}
