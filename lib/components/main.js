'use strict';

var tela = void 0;

(function () {
    var _this = this;

    var T = function T() {};
    T.prototype._ = {};
    T.prototype._.started = false;
    T.prototype._.spath = 'shader/';
    T.prototype._.extensions = [];
    T.prototype.set = function (id) {

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

        T.prototype._.extensions.forEach(function (ext) {
            if (ext.data.set && ext.data.set.now) {
                ext.data.set.now(ext, tela);
            }
        });

        return _this;
    };

    T.prototype.play = function (f, o) {
        if (!T.prototype._.started) {
            return null;
        }
        if (T.prototype._.r === null) {
            T.prototype._.r = new T.prototype.Render(T.prototype._, o);
        }

        T.prototype.draw = function () {
            if (!T.prototype._.stp) {
                T.prototype._.extensions.forEach(function (ext) {
                    if (ext.data.play && ext.data.play.before) {
                        ext.data.play.before(ext, tela);
                    }
                });
                T.prototype._.timeout = window.setTimeout(function () {
                    window.requestAnimationFrame(T.prototype.draw);
                }, 1000 / T.prototype._.fps);
                if (f) {
                    f();
                }
                T.prototype._.extensions.forEach(function (ext) {
                    if (ext.data.play && ext.data.play.now) {
                        ext.data.play.now(ext, tela);
                    }
                });
                T.prototype._.r.update(T.prototype._.models);
                for (var e in T.prototype._.e) {
                    if (T.prototype._.e[e]) {
                        T.prototype._.e[e] = false;
                    }
                }
                T.prototype._.time += 0.05;
                T.prototype._.extensions.forEach(function (ext) {
                    if (ext.data.play && ext.data.play.after) {
                        ext.data.play.after(ext, tela);
                    }
                });
            }
        };
        T.prototype.draw();
        return 'play';
    };

    T.prototype.pause = function () {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.stp = !T.prototype._.stp;
        T.prototype.draw();
        return 'pause';
    };

    T.prototype.stop = function () {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.stp = true;
        window.clearTimeout(T.prototype._.timeout);
        if (T.prototype._.resizeid) {
            window.clearTimeout(T.prototype._.resizeid);
        }
        for (var m = 0; m < T.prototype._.models.length; m++) {
            T.prototype._.models[m].destroy();
        }
        T.prototype._.r.destroy(T.prototype._.shaders);
        return 'stop';
    };

    T.prototype.resize = function () {
        if (!T.prototype._.started) {
            return null;
        }
        T.prototype._.resizeid = null;
        window.addEventListener('resize', function () {
            window.clearTimeout(T.prototype._.resizeid);
            T.prototype._.resizeid = window.setTimeout(function () {
                T.prototype._.canvas.setAttribute('width', T.prototype._.canvas.clientWidth);
                T.prototype._.canvas.setAttribute('height', T.prototype._.canvas.clientHeight);
                T.prototype._.w = T.prototype._.canvas.width;
                T.prototype._.h = T.prototype._.canvas.height;
                T.prototype._.bbox = T.prototype._.canvas.getBoundingClientRect();
                T.prototype._.gl.viewport(0, 0, T.prototype._.w, T.prototype._.h);
                for (var c in T.prototype._.cameras) {
                    if (T.prototype._.cameras[c]) {
                        T.prototype._.cameras[c].update({
                            h: T.prototype._.h,
                            w: T.prototype._.w,
                            as: T.prototype._.w / T.prototype._.h
                        });
                    }
                }
            }, 500);
            T.prototype._.e.resize = true;
        }, false);

        return 'resize';
    };

    T.prototype.get = function (k) {
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

    tela.sha = function (o) {
        return new tela.Shader(T.prototype._, o);
    };

    tela.mod = function (o) {
        return new tela.Model(T.prototype._, o);
    };

    tela.ent = function (o) {
        return new tela.Entity(T.prototype._, o);
    };

    tela.cam = function (o) {
        return new tela.Camera(T.prototype._, o);
    };

    tela.lig = function (o) {
        return new tela.Light(T.prototype._, o);
    };

    tela.ren = function (o) {
        return new tela.Render(T.prototype._, o);
    };

    tela.ext = function (ext) {
        return new tela.Extension(T.prototype._, ext);
    };

    tela.on = function (ty, f) {
        return new tela.Event(T.prototype._, ty, f);
    };
})();

module.exports = tela;