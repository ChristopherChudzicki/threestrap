import { EventEmitter } from 'events';

type Listener = (event: any) => void;
interface EventListener {
  addEventListener: (eventName: string, listener: Listener) => void;
  removeEventListener: (eventName: string, listener: Listener) => void;
}

type ListenerConfig = {
  callback: (event: any) => void;
  target: EventListener;
  eventName: string;
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

  listeners: ListenerConfig[] = [];

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

  abstract install(): void;

  uninstall(): void {
    this.unbindListeners();
  }

  addEventListener(eventName: string, listener: Listener): void {
    this.eventEmitter.addListener(eventName, listener);
  }

  removeEventListener(eventName: string, listener: Listener): void {
    this.eventEmitter.removeListener(eventName, listener);
  }

  bindListeners(): void {
    this.listenerRemovers = this.listeners.map(
      ({ target, callback, eventName }) => {
        const boundCb = callback.bind(this);
        target.addEventListener(eventName, boundCb);
        return () => {
          target.removeEventListener(eventName, boundCb);
        };
      },
    );
  }

  unbindListeners(): void {
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
