import Plugin from '../plugin';

type FillOptions = {
  block: boolean;
  body: boolean;
  layout: boolean;
};
const DEFAULT_FILL_OPTIONS: FillOptions = {
  block: true,
  body: true,
  layout: true,
};

export default class Fill extends Plugin<FillOptions> {
  applied?: HTMLElement[];

  block?: boolean;

  layout?: boolean;

  api = {
    get: this.get,
    set: this.set,
  };

  listen = [
    {
      type: 'change',
      target: this as Fill,
      listener: this.change,
    },
  ];

  constructor(three: any, options: FillOptions) {
    super(three, options, DEFAULT_FILL_OPTIONS);
  }

  onInstall(): boolean {
    const hasAutoHeight = (element: HTMLElement) => {
      const h = element.style.height;
      return h === 'auto' || h === '';
    };

    const setHeight = (element: HTMLElement) => {
      element.style.height = '100%';
      element.style.margin = '0px';
      element.style.padding = '0px';
      return element;
    };

    if (this.options.body && this.three.element === document.body) {
      // Fix body height if we're naked
      this.applied = [this.three.element, document.documentElement]
        .filter(hasAutoHeight)
        .map(setHeight);
    }

    if (this.options.block && this.three.canvas) {
      this.three.canvas.style.display = 'block';
      this.block = true;
    }

    if (this.options.layout && this.three.element) {
      const style = window.getComputedStyle(this.three.element);
      if (style.position === 'static') {
        this.three.element.style.position = 'relative';
        this.layout = true;
      }
    }

    return true;
  }

  onUninstall(): void {
    if (this.applied) {
      const resetHeight = (element: HTMLElement) => {
        element.style.height = '';
        element.style.margin = '';
        element.style.padding = '';
        return element;
      };

      this.applied.forEach(resetHeight);
      delete this.applied;
    }

    if (this.block && this.three.canvas) {
      this.three.canvas.style.display = '';
      delete this.block;
    }

    if (this.layout && this.three.element) {
      this.three.element.style.position = '';
      delete this.layout;
    }
  }

  change(): void {
    this.uninstall();
    this.install();
  }
}
