THREE.Bootstrap.registerPluginOld('scene', {
  install: function (three) {
    three.scene = new THREE.Scene();
  },

  uninstall: function (three) {
    delete three.scene;
  },
});
