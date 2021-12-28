import { EventEmitter } from 'events';

type Listener = (event: any) => void;
interface EventListener {
  // In practice, this could be a js EventTarget or a node EventEmitter
  addEventListener: (eventName: string, listener: Listener) => void;
  removeEventListener: (eventName: string, listener: Listener) => void;
}

type ListenerConfig = {
  listener: (event: any) => void;
  target: EventListener;
  type: string;
};

export type ChangeEvent<T> = {
  type: 'change';
  options: T;
  changes: Partial<T>;
};

export const makeChangeEvent = <T>(
  options: T,
  changes: Partial<T>,
): ChangeEvent<T> => ({
  type: 'change' as const,
  options,
  changes,
});

export default abstract class Plugin<T> implements EventListener {
  options: T;

  three: any;

  listen: ListenerConfig[] = [];

  listenOnce: ListenerConfig[] = [];

  listenerRemovers?: (() => void)[];

  eventEmitter: EventEmitter;

  abstract api: {
    set(options: Partial<T>): void;
    get(): T;
  };

  constructor(three: any, options: Partial<T>, defaults: T) {
    this.eventEmitter = new EventEmitter();
    this.three = three;
    this.options = { ...defaults, ...options };
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
  }

  install(): void {
    this.bindAllListeners();
    this.onInstall();
  }

  uninstall(): void {
    this.unbindAllListeners();
    this.onUninstall();
  }

  abstract onInstall(): void;

  abstract onUninstall(): void;

  addEventListener(type: string, listener: Listener): void {
    this.eventEmitter.addListener(type, listener);
  }

  removeEventListener(type: string, listener: Listener): void {
    this.eventEmitter.removeListener(type, listener);
  }

  bindAllListeners(): void {
    const removers = this.listen.map(({ target, listener, type }) => {
      const boundCb = listener.bind(this);
      target.addEventListener(type, boundCb);
      return () => {
        target.removeEventListener(type, boundCb);
      };
    });
    const onceRemovers = this.listenOnce.map(({ target, listener, type }) => {
      const boundListener = listener.bind(this);
      const listensOnce = (event: any) => {
        target.removeEventListener(type, listensOnce);
        boundListener(event);
      };
      target.addEventListener(type, listensOnce);
      return () => {
        target.removeEventListener(type, listensOnce);
      };
    });
    this.listenerRemovers = [...removers, ...onceRemovers];
  }

  unbindAllListeners(): void {
    if (this.listenerRemovers === undefined) return;
    this.listenerRemovers.forEach((removeListener) => removeListener());
  }

  set(options: Partial<T>): void {
    const opts = this.options;
    const keys = Object.keys(options) as (keyof T)[];
    // Diff out changes
    const changes = keys.reduce((result, key) => {
      const value = options[key];
      if (opts[key] !== value) {
        result[key] = value;
      }
      return result;
    }, {} as Partial<T>);

    this.options = { ...opts, ...changes };

    // Notify
    const event = { type: 'change', options, changes };
    this.eventEmitter.emit(event.type, event);
  }

  get(): T {
    return this.options;
  }
}
