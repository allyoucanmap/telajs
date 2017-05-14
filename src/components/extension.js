
const Extension = function(p, ext = {}) {
    this.data = ext;
    p.extensions.push(this);
    return this;
};

Extension.prototype.set = function(k, v) {
    if (k && v !== null) {
        this.data.settings[k] = v;
    }
};

Extension.prototype.get = function(k) {
    return k ? this.data.settings[k] : null;
};

module.exports = Extension;
