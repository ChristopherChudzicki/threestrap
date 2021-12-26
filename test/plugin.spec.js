describe('plugin', function () {
  it('registers a plugin', function () {
    const spec = {};

    expect(THREE.Bootstrap.Plugins.mockp1).toBeFalsy();

    THREE.Bootstrap.registerPluginOld('mockp1', spec);

    expect(new THREE.Bootstrap.Plugins.mockp1()).toBeInstanceOf(
      THREE.Bootstrap.Plugin,
    );

    THREE.Bootstrap.unregisterPluginOld('mockp1', spec);

    expect(THREE.Bootstrap.Plugins.mockp1).toBeFalsy();
  });

  it('sets defaults', function () {
    let captured;

    const spec = {
      install: function () {
        captured = this.options;
      },
      defaults: {
        foo: 'bar',
        foos: 'bars',
      },
    };

    THREE.Bootstrap.registerPluginOld('mockp2', spec);

    const options = {
      init: false,
      mockp2: {
        foo: 'baz',
      },
      plugins: ['mockp2'],
    };

    const three = new THREE.Bootstrap(options);

    three.init();

    expect(captured.foo).toBe('baz');
    expect(captured.foos).toBe('bars');

    three.destroy();

    THREE.Bootstrap.unregisterPluginOld('mockp2', spec);
  });
});
