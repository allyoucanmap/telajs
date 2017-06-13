'use strict';

var _require = require('./utils'),
    map = _require.map;

var Event = function Event(p, ty, f) {
    this.e = p.e;
    this.canvas = p.canvas;
    this.extensions = p.extensions;
    this.bbox = p.bbox;

    this.type = ty;
    this.f = f;
    this.events = [];
    this.block = false;
    return this.type && this[this.type] ? this[this.type](this.f) : null;
};

Event.prototype.click = function (f) {
    var _this = this;

    if (this.canvas.addEventListener && !this.block) {
        this.events.push(function (e) {
            if (f) {
                f([e.clientX - _this.bbox.left, e.clientY - _this.bbox.top], e);
            }
            _this.extensions.forEach(function (ext) {
                if (ext.data.events && ext.data.events.click) {
                    ext.data.events.click([e.clientX - _this.bbox.left, e.clientY - _this.bbox.top], ext, e);
                }
            });
            _this.e.click = true;
        });
        this.canvas.addEventListener('click', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.move = function (f) {
    var _this2 = this;

    if (this.canvas.addEventListener && !this.block) {
        this.events.push(function (e) {
            if (f) {
                f([e.clientX - _this2.bbox.left, e.clientY - _this2.bbox.top], e);
            }
            _this2.extensions.forEach(function (ext) {
                if (ext.data.events && ext.data.events.move) {
                    ext.data.events.move([e.clientX - _this2.bbox.left, e.clientY - _this2.bbox.top], ext, e);
                }
            });
            _this2.e.move = true;
        });
        this.canvas.addEventListener('mousemove', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.scroll = function (f) {
    var _this3 = this;

    if (this.canvas.addEventListener && !this.block) {
        this.events.push(function (e) {
            var ev = -e.detail || e.wheelDelta;
            ev = map(ev, -Math.abs(ev), Math.abs(ev), -1, 1);
            if (f) {
                f(ev, [e.clientX - _this3.bbox.left, e.clientY - _this3.bbox.top], e);
            }
            _this3.extensions.forEach(function (ext) {
                if (ext.data.events && ext.data.events.scroll) {
                    ext.data.events.scroll(ev, [e.clientX - _this3.bbox.left, e.clientY - _this3.bbox.top], ext, e);
                }
            });
            _this3.e.scroll = true;
        });
        this.canvas.addEventListener('mousewheel', this.events[0], false);
        this.canvas.addEventListener('DOMMouseScroll', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.drag = function (f) {
    var _this4 = this;

    if (this.canvas.addEventListener && !this.block) {
        this.start = false;
        this.point = [];
        this.events.push(function (e) {
            if (e.button >= 0) {
                _this4.start = true;
                _this4.point = [e.clientX - _this4.bbox.left, e.clientY - _this4.bbox.top];
                _this4.e.dragstart = true;
            }
        });
        this.events.push(function (e) {
            if (e.button >= 0 && _this4.start) {
                if (f) {
                    f([e.clientX - _this4.bbox.left - _this4.point[0], e.clientY - _this4.bbox.top - _this4.point[1]], e);
                }
                _this4.extensions.forEach(function (ext) {
                    if (ext.data.events && ext.data.events.drag) {
                        ext.data.events.drag([e.clientX - _this4.bbox.left - _this4.point[0], e.clientY - _this4.bbox.top - _this4.point[1]], ext, e);
                    }
                });
                _this4.point = [e.clientX - _this4.bbox.left, e.clientY - _this4.bbox.top];
                _this4.e.drag = true;
            }
        });
        this.events.push(function (e) {
            if (e.button >= 0 && _this4.start) {
                _this4.start = false;
                _this4.e.dragend = true;
            }
        });
        this.canvas.addEventListener('mousedown', this.events[0], false);
        this.canvas.addEventListener('mousemove', this.events[1], false);
        this.canvas.addEventListener('mouseup', this.events[2], false);
    }
    this.block = true;
};

module.exports = Event;