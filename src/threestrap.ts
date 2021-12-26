import { EventDispatcher } from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Binder from './binder.js';

interface ThreestrapEvent {
  type: string;
}

type ThreestrapOptions = {
  init: boolean;
  element: HTMLElement;
  plugins: string[];
  plugindb: any;
};

export default class Threestrap extends EventDispatcher {
  __inited = false;

  __destroyed = false;

  __installed: string[] = [];

  __options: ThreestrapOptions;

  element: HTMLElement;

  plugins: any;

  events: ThreestrapEvent[];

  constructor(options: Partial<ThreestrapOptions> = {}) {
    super();

    // Apply defaults
    const defaults: ThreestrapOptions = {
      init: true,
      element: document.body,
      plugins: ['core'],
      plugindb: {},
    };
    this.__options = { ...defaults, ...options };

    // Hidden state
    this.__inited = false;
    this.__destroyed = false;
    this.__installed = [];

    // Query element
    const { element } = this.__options;

    // Global context
    this.plugins = {};
    this.element = element;

    // Update cycle
    this.trigger = this.trigger.bind(this);
    this.frame = this.frame.bind(this);
    this.events = ['pre', 'update', 'render', 'post'].map((type) => ({
      type,
    }));

    // Auto-init
    if (this.__options.init) {
      this.init();
    }
  }

  trigger = Binder._trigger.bind(this);

  triggerOnce = Binder._triggerOnce.bind(this);

  on = this.addEventListener;

  off = this.removeEventListener;

  dispatchEvent = this.trigger;

  frame(): void {
    console.log(this);
  }

  init(): void {
    console.log(this);
  }
}
