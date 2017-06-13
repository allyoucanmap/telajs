
let tela;

(function() {
    let T = () => {};
    T.prototype._ = {};
    T.prototype._.started = false;
    T.prototype._.spath = 'shader/';
    T.prototype._.extensions = [];
    /**
     * First method to setup the canvas
     * <pre class="prettyprint">
     * <code>
     *  var id = 'tela'; // canvas id
     *  tela.set(id);
     * </code>
     * </pre>
     * @namespace .set()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="myCanvasID" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  tela.set('myCanvasID');
     *
     *  tela.ent({
     *    mod: tela.mod({ ty: 'WGL' })
     *  })
     *
     *  tela.play();
     *
     * </script>
     */
    T.prototype.set = (id) => {

        if (T.prototype._.started) {
            return null;
        }
        T.prototype._.divpi = document.createElement('div');
        T.prototype._.divpi.style.position = 'absolute';
        T.prototype._.divpi.style.left = '-100%';
        T.prototype._.divpi.style.top = '-100%';
        T.prototype._.divpi.style.width = '1in';
        T.prototype._.divpi.style.height = '1in';
        document.body.appendChild(T.prototype._.divpi);

        T.prototype._.dpi = {};
        T.prototype._.dpi.x = T.prototype._.divpi.offsetWidth;
        T.prototype._.dpi.y = T.prototype._.divpi.offsetHeight;

        T.prototype._.canvas = document.getElementById(id);

        T.prototype._.canvas.setAttribute('oncontextmenu', 'return false');
        T.prototype._.canvas.setAttribute('width', T.prototype._.canvas.clientWidth);
        T.prototype._.canvas.setAttribute('height', T.prototype._.canvas.clientHeight);

        T.prototype._.gl = T.prototype._.canvas.getContext('webgl') || T.prototype._.canvas.getContext('experimental-webgl');
        if (!T.prototype._.gl) {
            return null;
        }

        T.prototype._.started = true;
        T.prototype._.w = T.prototype._.canvas.width;
        T.prototype._.h = T.prototype._.canvas.height;
        T.prototype._.gl.viewport(0, 0, T.prototype._.w, T.prototype._.h);
        T.prototype._.stp = false;
        T.prototype._.timeout = null;
        T.prototype._.draw = null;
        T.prototype._.fps = 60;
        T.prototype._.r = null;
        T.prototype._.shaders = [];
        T.prototype._.models = [];
        T.prototype._.entities = [];
        T.prototype._.cameras = [];
        T.prototype._.lights = [];
        T.prototype._.bbox = T.prototype._.canvas.getBoundingClientRect();

        T.prototype._.e = {};
        T.prototype._.e.move = false;
        T.prototype._.e.click = false;
        T.prototype._.e.scroll = false;
        T.prototype._.e.dragstart = false;
        T.prototype._.e.drag = false;
        T.prototype._.e.dragend = false;
        T.prototype._.e.resize = false;

        T.prototype._.stt = {};
        T.prototype._.stt.ids = 0;
        T.prototype._.stt.idc = 0;
        T.prototype._.stt.idl = 0;
        T.prototype._.time = 0.0;
        T.prototype._.SQRT3 = Math.sqrt(3);

        T.prototype._.extensions.forEach((ext) => {
            if (ext.data.set && ext.data.set.now) {
                ext.data.set.now(ext, tela);
            }
        });

        return this;
    };
    /**
     * Starts the render loop
     * <pre class="prettyprint">
     * <code>
     *  var options = {
     *    cam: {}, // see .cam() options
     *    lig: {} // see .lig() options
     *  };
     *
     *  tela.play(function() {
     *    // loop
     *  }, options);
     * </code>
     * </pre>
     * @namespace .play()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  tela.set('tela');
     *
     *  var triangle = tela.ent({
     *    s: 3,
     *    mod: tela.mod({ ty: 'WGL' })
     *  })
     *
     *  tela.play(function() {
     *    triangle.rz(triangle.rz() + 4.0);
     *  });
     *
     * </script>
     */
    T.prototype.play = (f, o) => {
        if (!T.prototype._.started) {
            return null;
        }
        if (T.prototype._.r === null) {
            T.prototype._.r = new T.prototype.Render(T.prototype._, o);
        }

        T.prototype.draw = () => {
            if (!T.prototype._.stp) {
                T.prototype._.extensions.forEach((ext) => {
                    if (ext.data.play && ext.data.play.before) {
                        ext.data.play.before(ext, tela);
                    }
                });
                T.prototype._.timeout = window.setTimeout(() => {
                    window.requestAnimationFrame(T.prototype.draw);
                }, 1000 / T.prototype._.fps);
                if (f) {
                    f();
                }
                T.prototype._.extensions.forEach((ext) => {
                    if (ext.data.play && ext.data.play.now) {
                        ext.data.play.now(ext, tela);
                    }
                });
                T.prototype._.r.update(T.prototype._.models);
                for (let e in T.prototype._.e) {
                    if (T.prototype._.e[e]) {
                        T.prototype._.e[e] = false;
                    }

                }
                T.prototype._.time += 0.05;
                T.prototype._.extensions.forEach((ext) => {
                    if (ext.data.play && ext.data.play.after) {
                        ext.data.play.after(ext, tela);
                    }
                });
            }
        };
        T.prototype.draw();
        return 'play';
    };
    /**
     * Pauses/Plays the render loop
     * <pre class="prettyprint">
     * <code>
     * tela.pause();
     * </code>
     * </pre>
     * @namespace .pause()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  // click on canvas to pause and click again to restart
     *  tela.set('tela');
     *
     *  var model = tela.mod({ ty: 'CUB' });
     *
     *  var left = tela.ent({
     *    c: [0.0, 1.0, 1.0],
     *    p: [-2.5, 0, 0],
     *    s: [0.5, 5.0, 0.5 ],
     *    rs: ['rz', 'ry', 'rx'],
     *    mod: model
     *  });
     *
     *  var right = tela.ent({
     *    c: [1.0, 0.0, 1.0],
     *    p: [2.5, 0, 0],
     *    s: [0.5, 5.0, 0.5 ],
     *    rs: ['rz', 'ry', 'rx'],
     *    mod: model
     *  });
     *
     *  tela.play(function() {
     *    left.rz(left.rz() + 5);
     *    left.ry(left.ry() + 5);
     *
     *    right.rz(right.rz() - 5);
     *    right.ry(right.ry() - 5);
     *  });
     *
     *  tela.on('click', function() {
     *    tela.pause();
     *  });
     *
     * </script>
     */
    T.prototype.pause = () => {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.stp = !T.prototype._.stp;
        T.prototype.draw();
        return 'pause';
    };

    T.prototype.stop = () => {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.stp = true;
        window.clearTimeout(T.prototype._.timeout);
        if (T.prototype._.resizeid) {
            window.clearTimeout(T.prototype._.resizeid);
        }
        for (let m = 0; m < T.prototype._.models.length; m++) {
            T.prototype._.models[m].destroy();
        }
        T.prototype._.r.destroy(T.prototype._.shaders);
        return 'stop';
    };
    /**
     * Adjusts the aspect ratio of canvas on window resize
     * <pre class="prettyprint">
     * <code>
     * tela.resize(function() {
     *  // callback on resize
     * });
     * </code>
     * </pre>
     * @namespace .resize()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  // try to resize the window
     *  var hide = true;
     *
     *  tela.set('tela');
     *
     *  var square = tela.ent({
     *    mod: tela.mod({ ty: 'REC' }),
     *    s: 4
     *  });
     *
     *  square.hi(hide);
     *
     *  var triangle = tela.ent({
     *    mod: tela.mod({ ty: 'WGL' }),
     *    s: 4
     *  })
     *
     *  tela.play();
     *
     *  tela.resize(function() {
     *    hide = !hide;
     *    square.hi(hide);
     *    hide = !hide;
     *    triangle.hi(hide);
     *    hide = !hide;
     *  });
     *
     * </script>
     */
    T.prototype.resize = (f) => {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.resizeid = null;
        window.addEventListener('resize', () => {
            window.clearTimeout(T.prototype._.resizeid);
            T.prototype._.resizeid = window.setTimeout(() => {
                T.prototype._.canvas.setAttribute('width', T.prototype._.canvas.clientWidth);
                T.prototype._.canvas.setAttribute('height', T.prototype._.canvas.clientHeight);
                T.prototype._.w = T.prototype._.canvas.width;
                T.prototype._.h = T.prototype._.canvas.height;
                T.prototype._.bbox = T.prototype._.canvas.getBoundingClientRect();
                T.prototype._.gl.viewport(0, 0, T.prototype._.w, T.prototype._.h);
                for (let c in T.prototype._.cameras) {
                    if (T.prototype._.cameras[c]) {
                        T.prototype._.cameras[c].update({
                            h: T.prototype._.h,
                            w: T.prototype._.w,
                            as: T.prototype._.w / T.prototype._.h
                        });
                    }
                }
                if (f) {
                    f();
                }
                T.prototype._.extensions.forEach((ext) => {
                    if (ext.data.resize && ext.data.resize.now) {
                        ext.data.resize.now(ext, tela);
                    }
                });
            }, 500);
            T.prototype._.e.resize = true;
        }, false);

        return 'resize';
    };

    T.prototype.get = (k) => {
        return T.prototype._[k] ? T.prototype._[k] : null;
    };

    T.prototype.Shader = require('./shader');
    T.prototype.Model = require('./model');
    T.prototype.Entity = require('./entity');
    T.prototype.Camera = require('./camera');
    T.prototype.Light = require('./light');
    T.prototype.Render = require('./render');
    T.prototype.Extension = require('./extension');
    T.prototype.Event = require('./event');

    tela = new T();

    tela.sha = (o) => {
        return new tela.Shader(T.prototype._, o);
    };
    /**
     * Adds a new Model
     * <pre class="prettyprint">
     * <code>
     * // with ty
     * // 'EQU' -> equilateral triangle
     * // 'TRI' -> right triangle
     * // 'REC' -> square/rectangle
     * // 'CUB' -> cube
     * var options = {
     *  ty: 'CUB'// type
     * };
     *
     * // with ty, raw and cv
     * // 'PLL' -> polylines
     * // 'PLG' -> polygons
     * var options = {
     *  cv: [0.0, 1.0, 1.0], // color of vectors (optional)
     *  raw: [[[0, 0, 0], [1, 0, 0], [1, 1, 0]]], // or [[[0, 0], [1, 0], [1, 1]], ...] raw structure
     *  ty: 'PLL' // type
     * };
     *
     * // with ty and str
     * var vs = {
     *  i: [0, 1, 2], // indicies
     *  p: [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0], // positions
     *  t: [0, 1, 0, 0, 1, 1], // texture coordinates
     *  n: [0, 0, 1, 0, 0, 1, 0, 0, 1], // normals
     *  c: [-1, -1, -1, -1, -1, -1, -1, -1, -1] // verticies color
     * };
     *
     * var options = {
     *  str: vs, // structure
     *  ty: 'STR'// type
     * };
     *
     * tela.mod(options);
     * </code>
     * </pre>
     * @namespace .mod()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  tela.set('tela');
     *  tela.resize();
     *
     *  var squareModel = tela.mod({ty: 'REC'});
     *
     *  var polylineModel = tela.mod({
     *    ty: 'PLL',
     *    raw: [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0]]]
     *  });
     *
     *  var vs = {
     *    i: [0, 1, 2],
     *    p: [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0],
     *    t: [0, 1, 0, 0, 1, 1],
     *    n: [0, 0, 1, 0, 0, 1, 0, 0, 1],
     *    c: [0.5, 0, 1, 0.5, 1, 0.4, 0, 0.6, 1]
     *  };
     *
     *  var structureModel = tela.mod({
     *    ty: 'STR',
     *    str: vs
     *  });
     *
     *
     *  for (var y = -2; y <= 2; y++) {
     *    for (var x = -7; x <= 7; x++) {
     *      tela.ent({
     *        mod: polylineModel,
     *        p:[x, y, Math.random()],
     *        c: [Math.random(), Math.random(), Math.random()],
     *        r: [0.0, 0.0, 180.0]
     *      }).lw(Math.random() * 10);
     *    }
     *  }
     *
     *  tela.ent({
     *    mod: structureModel,
     *    s: 5,
     *    p: [5.0, 0.0, 0.0]
     *  });
     *
     *  tela.ent({
     *    mod: structureModel,
     *    s: 5,
     *    r: [0.0, 0.0, 270.0],
     *    p: [-5.0, 0, 0]
     *  });
     *
     *  tela.ent({
     *    mod: squareModel,
     *    s: 5,
     *    c: [0.2, 0.2, 0.2]
     *  });
     *
     *  tela.play();
     *
     * </script>
     */
    tela.mod = (o) => {
        return new tela.Model(T.prototype._, o);
    };
    /**
     * Adds a new Entity
     *
     * <pre class="prettyprint">
     * <code>
     * var options = {
     *  c: [0.0, 1.0, 1.0], // color
     *  mod: tela.mod({ ty: 'CUB' }), // model (required)
     *  ma: 1, // material
     *  n: 'myCube', // name
     *  o: [0.0, 0.0, 0.0], // origin
     *  p: [0.0, 0.0, 0.0], // position
     *  r: [0.0, 0.0, 0.0], // rotation
     *  rs: ['rx', 'ry', 'rz'], // sort rotation
     *  s: [1.0, 1.0, 1.0], // scale
     *  sp: [1.0, 0.0, 1.0], // specular color
     *  va: 1.0 // value
     * };
     *
     * tela.ent(options);
     * </code>
     * </pre>
     * @namespace .ent()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  var count = 0;
     *
     *  tela.set('tela');
     *  tela.resize();
     *
     *  var cube = tela.ent({
     *    s: 2,
     *    c: [0.0, 0.6, 0.8],
     *    sp: [1.0, 0.0, 0.5],
     *    mod: tela.mod({ ty: 'CUB' })
     *  });
     *
     *  tela.play(function () {
     *    cube.px(Math.sin(count));
     *    cube.py(Math.cos(count));
     *
     *    cube.rx(cube.rx() + 1.0);
     *    cube.ry(cube.ry() + 1.0);
     *
     *    cube.ma(Math.floor(count/10 % 10));
     *
     *    count += 0.05;
     *  });
     *
     * </script>
     */
    tela.ent = (o) => {
        return new tela.Entity(T.prototype._, o);
    };
    /**
     * Adds a new Camera
     * <pre class="prettyprint">
     * <code>
     * var options = {
     *  ty: 'p', // type
     *  fo: 70.0, // fov
     *  as: 512 / 256, // aspect
     *  w: 512, // width
     *  h: 256, // height
     *  z: 100, // zoom (ty: 'o')
     *  ne: 0.5, // near
     *  fa: 1000, // far
     *  p: [1.0, 1.0, 1.0], // postion
     *  ta: [0.0, 0.0, 0.0], // target
     *  up: [0.0, 1.0, 0.0] // up
     * };
     *
     * tela.cam(options);
     * </code>
     * </pre>
     * @namespace .cam()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  var change = false;
     *
     *  tela.set('tela');
     *  tela.resize();
     *
     *  var cam = tela.cam({
     *    ty: 'o',
     *    p: [0.0, 0.0, 3.0]
     *  });
     *
     *  var roofModel = tela.mod({
     *    ty: 'PLG',
     *    raw: [
     *      [
     *        [-0.5, 0.5, 0.5],
     *        [0.0, 1.0, 0.5],
     *        [0.5, 0.5, 0.5]
     *      ],
     *      [
     *        [0.5, 0.5, -0.5],
     *        [0.0, 1.0, -0.5],
     *        [-0.5, 0.5, -0.5]
     *      ],
     *      [
     *        [0.5, 0.5, 0.5],
     *        [0.0, 1.0, 0.5],
     *        [0.0, 1.0, -0.5],
     *        [0.5, 0.5, -0.5]
     *      ],
     *      [
     *        [-0.5, 0.5, 0.5],
     *        [-0.5, 0.5, -0.5],
     *        [0.0, 1.0, -0.5],
     *        [0.0, 1.0, 0.5]
     *      ]
     *    ]
     *  });
     *
     *  var roof = tela.ent({
     *    c: [0.95, 0.2, 0.2],
     *    mod: roofModel
     *  });
     *
     *  var wall = tela.ent({
     *    c: [0.95, 0.95, 0.95],
     *    mod: tela.mod({
     *      ty: 'CUB'
     *    })
     *  });
     *
     *  tela.play(function() {
     *    roof.ry(roof.ry() + 1);
     *    wall.ry(wall.ry() + 1);
     *  });
     *
     *  tela.on('click', function() {
     *    change = !change;
     *    if(change)  {
     *      cam.update({ ty: 'p' });
     *    } else {
     *      cam.update({ ty: 'o' });
     *    }
     *  });
     *
     * </script>
     */
    tela.cam = (o) => {
        return new tela.Camera(T.prototype._, o);
    };
    /**
     * Adds a new Light
     * <pre class="prettyprint">
     * <code>
     * var options = {
     *  c: [1.0, 1.0, 1.0], // color
     *  p: [2.0, 2.0, 2.0], // position
     * };
     *
     * tela.lig(options);
     * </code>
     * </pre>
     * @namespace .lig()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  var count = 0;
     *
     *  tela.set('tela');
     *  tela.resize();
     *
     *  var light = tela.lig({
     *    c: [1.0, 0.7, 0.7],
     *    p: [0.0, 0.0, 2.0]
     *  });
     *
     *  tela.ent({
     *    mod: tela.mod({ ty: 'REC' }),
     *    s: 7
     *  });
     *
     *  tela.play(function () {
     *    light.px(Math.sin(count) * 2);
     *    light.py(Math.cos(count) * 2);
     *
     *    light.cb((Math.cos(count) + 1) / 2);
     *
     *    count += 0.05;
     *  });
     *
     * </script>
     */
    tela.lig = (o) => {
        return new tela.Light(T.prototype._, o);
    };

    tela.ren = (o) => {
        return new tela.Render(T.prototype._, o);
    };

    tela.ext = (ext) => {
        return new tela.Extension(T.prototype._, ext);
    };
    /**
     * Adds a new Event
     * <pre class="prettyprint">
     * <code>
     * tela.on('click', function(p, e) {
     *  // p -> position [x, y]
     *  // e -> click event
     * });
     *
     * tela.on('move', function(p, e) {
     *  // p -> position [x, y]
     *  // e -> mousemove event
     * });
     *
     * tela.on('scroll', function(sc, p, e) {
     *  // sc -> scroll -1 or 1
     *  // p -> position [x, y]
     *  // e -> mousewheel event
     * });
     *
     * tela.on('drag', function(d, e) {
     *  // d -> delta [dx, dy]
     *  // e -> mousemove event
     * });
     * </code>
     * </pre>
     * @namespace .on()
     * @example
     * <script language="javascript" type="text/javascript" src="./tela.js"></script>
     * <canvas id="tela" class="tela-canvas" ></canvas>
     * <script language="javascript" type="text/javascript">
     *
     *  var direction = 1;
     *
     *  tela.set('tela');
     *  tela.resize();
     *
     *  var width = tela.get('w');
     *
     *  var triangle = tela.ent({
     *    s: 3,
     *    mod: tela.mod({ ty: 'EQU' })
     *  })
     *
     *  tela.play(function() {
     *    triangle.rz(triangle.rz() + 4.0 * direction);
     *  });
     *
     *  tela.on('move', function(p) {
     *    if (p[0] > width/2) {
     *      direction = -1.0;
     *    } else {
     *      direction = 1.0;
     *    }
     *  });
     *
     *  tela.on('click', function() {
     *    triangle.s([Math.random() + 2, Math.random() + 2, Math.random() + 2]);
     *  });
     *
     *  tela.on('drag', function(p) {
     *    triangle.p([p[0], p[1], 0]);
     *  });
     *
     *  tela.on('scroll', function() {
     *    triangle.c([Math.random(), Math.random(), Math.random()]);
     *  });
     *
     * </script>
     */
    tela.on = (ty, f) => {
        return new tela.Event(T.prototype._, ty, f);
    };

    window.addEventListener('beforeunload', function() {
        tela.stop();
    }, false);

    window.addEventListener('unload', function() {
        tela.stop();
    }, false);

})();

module.exports = tela;
