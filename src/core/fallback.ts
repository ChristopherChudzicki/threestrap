import Plugin from '../plugin';

type FallbackOptions = {
  force: boolean;
  fill: boolean;
  begin: string;
  end: string;
  message: string;
};

const DEFAULT_FALLBACK_OPTIONS: FallbackOptions = {
  force: false,
  fill: true,
  begin:
    '<div class="threestrap-fallback" style="display: table; width: 100%; height: 100%;' +
    'box-sizing: border-box; border: 1px dashed rgba(0, 0, 0, .25);">' +
    '<div style="display: table-cell; padding: 10px; vertical-align: middle; text-align: center;">',
  end: '</div></div>',
  message:
    '<big><strong>This example requires WebGL</strong></big><br>' +
    'Visit <a target="_blank" href="http://get.webgl.org/">get.webgl.org</a> for more info</a>',
};

export default class Fallback extends Plugin<FallbackOptions> {
  api = {
    get: this.get,
    set: this.set,
    fallback: false,
  };

  children: ChildNode[] = [];

  constructor(three: any, options: FallbackOptions) {
    super(three, options, DEFAULT_FALLBACK_OPTIONS);
  }

  onInstall(): boolean {
    let cnv;
    this.three.Fallback = this.api;
    try {
      cnv = document.createElement('canvas');
      const gl =
        cnv.getContext('webgl') || cnv.getContext('experimental-webgl');
      if (!gl || this.options.force) {
        throw new Error('WebGL unavailable.');
      }
      return true;
    } catch (e) {
      const { message, begin, end, fill } = this.options;
      const div = document.createElement('div');

      div.innerHTML = begin + message + end;

      this.children = [];

      while (div.childNodes.length > 0) {
        if (div.firstChild) {
          this.children.push(div.firstChild);
        }

        this.three.element.appendChild(div.firstChild);
      }

      if (fill) {
        this.three.install('fill');
      }

      this.api.fallback = true;
      return false; // Abort install
    }
  }

  onUninstall(): void {
    this.children.forEach((child) => {
      child.parentNode?.removeChild(child);
    });
    this.children = [];

    delete this.three.Fallback;
  }
}
