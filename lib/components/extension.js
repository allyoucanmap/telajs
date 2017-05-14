"use strict";

var Extension = function Extension(p) {
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.data = ext;
    p.extensions.push(this);
    return this;
};

Extension.prototype.set = function (k, v) {
    if (k && v !== null) {
        this.data.settings[k] = v;
    }
};

Extension.prototype.get = function (k) {
    return k ? this.data.settings[k] : null;
};

module.exports = Extension;