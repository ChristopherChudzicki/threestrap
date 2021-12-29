import Plugin from '../plugin';

type SceneOptions = Record<any, never>;

const DEFAULT_SCENE_OPTIONS: SceneOptions = {};

const THREE = window.THREE as any;

export default class Scene extends Plugin<SceneOptions> {
  api = {
    get: this.get,
    set: this.set,
  };

  constructor(three: any, options: SceneOptions) {
    super(three, options, DEFAULT_SCENE_OPTIONS);
  }

  onInstall(): boolean {
    this.three.scene = new THREE.Scene();
    this.three.Scene = this.api;
    return true;
  }

  onUninstall(): void {
    delete this.three.scene;
    delete this.three.Scene;
  }
}
