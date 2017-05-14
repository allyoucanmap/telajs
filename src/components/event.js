
const {map} = require('./utils');

const Event = function(p, ty, f) {
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

Event.prototype.click = function(f) {
    if (this.canvas.addEventListener && !this.block) {
        this.events.push((e) => {
            if (f) {
                f([e.clientX - this.bbox.left, e.clientY - this.bbox.top], e);
            }
            this.extensions.forEach((ext) => {
                if (ext.data.events && ext.data.events.click) {
                    ext.data.events.click([e.clientX - this.bbox.left, e.clientY - this.bbox.top], ext, e);
                }
            });
            this.e.click = true;
        });
        this.canvas.addEventListener('click', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.move = function(f) {
    if (this.canvas.addEventListener && !this.block) {
        this.events.push((e) => {
            if (f) {
                f([e.clientX - this.bbox.left, e.clientY - this.bbox.top], e);
            }
            this.extensions.forEach((ext) => {
                if (ext.data.events && ext.data.events.move) {
                    ext.data.events.move([e.clientX - this.bbox.left, e.clientY - this.bbox.top], ext, e);
                }
            });
            this.e.move = true;
        });
        this.canvas.addEventListener('mousemove', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.scroll = function(f) {
    if (this.canvas.addEventListener && !this.block) {
        this.events.push((e) => {
            let ev = -e.detail || e.wheelDelta;
            ev = map(ev, -Math.abs(ev), Math.abs(ev), -1, 1);
            if (f) {
                f(ev, [e.clientX - this.bbox.left, e.clientY - this.bbox.top], e);
            }
            this.extensions.forEach((ext) => {
                if (ext.data.events && ext.data.events.scroll) {
                    ext.data.events.scroll(ev, [e.clientX - this.bbox.left, e.clientY - this.bbox.top], ext, e);
                }
            });
            this.e.scroll = true;
        });
        this.canvas.addEventListener('mousewheel', this.events[0], false);
        this.canvas.addEventListener('DOMMouseScroll', this.events[0], false);
    }

    this.block = true;
};

Event.prototype.drag = function(f) {
    if (this.canvas.addEventListener && !this.block) {
        this.start = false;
        this.point = [];
        this.events.push((e) => {
            if (e.button >= 0) {
                this.start = true;
                this.point = [e.clientX - this.bbox.left, e.clientY - this.bbox.top];
                this.e.dragstart = true;
            }
        });
        this.events.push((e) => {
            if (e.button >= 0 && this.start) {
                if (f) {
                    f([this.point[0] - e.clientX - this.bbox.left, e.clientY - this.bbox.top - this.point[1]], e);
                }
                this.extensions.forEach((ext) => {
                    if (ext.data.events && ext.data.events.drag) {
                        ext.data.events.drag([this.point[0] - e.clientX - this.bbox.left, e.clientY - this.bbox.top - this.point[1]], ext, e);
                    }
                });
                this.point = [e.clientX - this.bbox.left, e.clientY - this.bbox.top];
                this.e.drag = true;
            }
        });
        this.events.push((e) => {
            if (e.button >= 0 && this.start) {
                this.start = false;
                this.e.dragend = true;
            }
        });
        this.canvas.addEventListener('mousedown', this.events[0], false);
        this.canvas.addEventListener('mousemove', this.events[1], false);
        this.canvas.addEventListener('mouseup', this.events[2], false);
    }
    this.block = true;
};

module.exports = Event;
