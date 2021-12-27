import { EventDispatcher } from 'three';

interface EventTarget {
  addEventListener: (eventName: string, callback: (event: any) => void) => void;
  removeEventListener: (
    eventName: string,
    callback: (event: any) => void,
  ) => void;
}

type ListenerConfig = {
  callback: (event: any) => void;
  target: EventTarget;
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

export default abstract class Plugin<T> extends EventDispatcher {
  options: T;

  three: any;

  listeners: ListenerConfig[] = [];

  listenerRemovers?: (() => void)[];

  abstract api: {
    set(options: Partial<T>): void;
    get(): T;
  };

  constructor(three: any, options: Partial<T>, defaults: T) {
    super();
    this.three = three;
    this.options = { ...defaults, ...options };
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
  }

  abstract install(): void;

  uninstall(): void {
    this.unbindListeners();
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
    this.dispatchEvent({ type: 'change', options, changes });
  }

  get(): T {
    return this.options;
  }
}
