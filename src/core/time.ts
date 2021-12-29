import Plugin from '../plugin';

type TimeOptions = {
  speed: number;
  warmup: number;
  timeout: number;
};

const DEFAULT_TIME_OPTIONS: TimeOptions = {
  speed: 1, // Clock speed
  warmup: 0, // Wait N frames before starting clock
  timeout: 1, // Timeout in seconds. Pause if no tick happens in this time.
};

const getCurrentTime = () => new Date().getTime() / 1000;

export default class Time extends Plugin<TimeOptions> {
  listen = [
    {
      type: 'pre',
      target: this.three,
      listener: this.tick,
    },
  ];

  api = {
    now: getCurrentTime(), // Time since 1970 in seconds

    clock: 0, // Adjustable clock that counts up from 0 seconds
    step: 1 / 60, // Clock step in seconds

    frames: 0, // Framenumber
    time: 0, // Real time in seconds
    delta: 1 / 60, // Frame step in seconds

    average: 0, // Average frame time in seconds
    fps: 0, // Average frames per second

    get: this.get,
    set: this.set,
  };

  last: number;

  time: number;

  clock: number;

  wait: number;

  clockStart: number;

  timeStart: number;

  constructor(three: any, options: Partial<TimeOptions>) {
    super(three, options, DEFAULT_TIME_OPTIONS);

    this.last = 0;
    this.time = 0;
    this.clock = 0;
    this.wait = this.options.warmup;

    this.clockStart = 0;
    this.timeStart = 0;
  }

  onInstall(): boolean {
    this.three.Time = this.api;
    return true;
  }

  onUninstall(): void {
    delete this.three.Time;
  }

  tick(): void {
    const { speed, timeout } = this.options;
    const { last, api } = this;
    let { time, clock } = this;
    const now = getCurrentTime();
    api.now = now;

    if (last) {
      let delta = now - last;
      api.delta = delta;

      const average = api.average === 0 ? delta : api.average;

      if (delta > timeout) {
        delta = 0;
      }

      const step = delta * speed;

      time += delta;
      clock += step;

      if (api.frames > 0) {
        api.average = average + (delta - average) * 0.1;
        api.fps = 1 / average;
      }

      api.step = step;
      api.clock = clock - this.clockStart;
      api.time = time - this.timeStart;

      api.frames += 1;

      if (this.wait > 0) {
        this.wait -= 1;
        this.clockStart = clock;
        this.timeStart = time;
        api.clock = 0;
        api.step = 1e-100;
      }
    }

    this.last = now;
    this.clock = clock;
    this.time = time;
  }
}
