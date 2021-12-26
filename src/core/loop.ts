import Plugin from '../plugin';

type LoopOptions = {
  start: boolean;
  force: boolean;
  rate: number;
};

const DEFAULT_LOOP_OPTIONS: LoopOptions = {
  start: true,
  force: true,
  rate: 1,
};

export default class Loop extends Plugin<LoopOptions> {
  api = {
    start: this.start.bind(this),
    stop: this.stop.bind(this),
    running: false,
    get: this.get,
    set: this.set,
  };

  running = false;

  pending = false;

  frame = 0;

  listeners = [
    { eventName: 'ready', target: this.three, callback: this.ready },
    { eventName: 'resize', target: window, callback: this.reset },
    { eventName: 'dirty', target: this.three, callback: this.dirty },
    { eventName: 'post', target: this.three, callback: this.post },
  ];

  constructor(three: any, options: Partial<LoopOptions>) {
    super(three, options, DEFAULT_LOOP_OPTIONS);
  }

  install(): void {
    this.bindListeners();
    this.three.Loop = this.api;
  }

  uninstall(): void {
    this.stop();
  }

  ready(): void {
    if (this.options.start) this.start();
  }

  dirty(): void {
    if (!this.running && this.options.force && !this.pending) {
      this.reset();
      requestAnimationFrame(this.three.frame);
      this.pending = true;
    }
  }

  post(): void {
    this.pending = false;
  }

  reset(): void {
    this.frame = 0;
  }

  start(): void {
    if (this.running) return;

    const { three } = this;

    this.running = true;
    three.Loop.running = this.running;

    const loop = () => {
      if (this.running) {
        requestAnimationFrame(loop);
      }

      const { rate } = this.options;
      if (rate <= 1 || this.frame % rate === 0) {
        three.frame();
      }

      this.frame += 1;
    };

    requestAnimationFrame(loop);

    three.trigger({ type: 'start' });
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.three.Loop.running = this.running;

    this.three.trigger({ type: 'stop' });
  }
}
