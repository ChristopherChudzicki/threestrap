THREE.Bootstrap.registerPlugin('bind', {
  install: function (three) {
    var globals = {
      three: three,
      window: window,
    };

    three.bindZ = THREE.Binder.bindZ(three, globals);
    three.unbindZ = THREE.Binder.unbindZ(three);

    three.bindZ('install:bind', this);
    three.bindZ('uninstall:unbind', this);
  },

  uninstall: function (three) {
    three.unbindZ(this);

    delete three.bindZ;
    delete three.unbindZ;
  },

  bind: function (event, three) {
    var plugin = event.plugin;
    var listen = plugin.listen;

    listen &&
      listen.forEach(function (key) {
        three.bindZ(key, plugin);
      });
  },

  unbind: function (event, three) {
    three.unbindZ(event.plugin);
  },
});
