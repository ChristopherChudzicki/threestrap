import Plugin from './plugin';

THREE.Bootstrap.Plugins = {};
THREE.Bootstrap.Aliases = {};

THREE.Bootstrap.Plugin = function (options) {
  this.options = _.defaults(options || {}, this.defaults);
};

THREE.Bootstrap.Plugin.prototype = {
  listen: [],

  defaults: {},

  install: function (three) {},

  uninstall: function (three) {},

  ////////
};

THREE.Binder.apply(THREE.Bootstrap.Plugin.prototype);
THREE.Api.apply(THREE.Bootstrap.Plugin.prototype);

THREE.Bootstrap.registerPluginOld = function (name, spec) {
  var ctor = function (options) {
    THREE.Bootstrap.Plugin.call(this, options);
    this.__name = name;
  };
  ctor.prototype = _.extend(new THREE.Bootstrap.Plugin(), spec);

  THREE.Bootstrap.Plugins[name] = ctor;
};

THREE.Bootstrap.unregisterPluginOld = function (name) {
  delete THREE.Bootstrap.Plugins[name];
};

THREE.Bootstrap.registerAlias = function (name, plugins) {
  THREE.Bootstrap.Aliases[name] = plugins;
};

THREE.Bootstrap.unregisterAlias = function (name) {
  delete THREE.Bootstrap.Aliases[name];
};

THREE.Bootstrap.registerPlugin = (name, plugin) => {
  THREE.Bootstrap.Plugins[name] = plugin;
};
