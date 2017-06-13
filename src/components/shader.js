
const {getShadersFromFile} = require('./utils');
const ShaderProgram = require('./shaderprogram');

const Shader = function(p, optns = {}) {

    if (!p.started) {
        return null;
    }

    let options = optns;

    this.name = '_';

    if (options.n !== undefined) {
        this.name = options.n;
    }

    this.id = p.shaders.length;
    this.vload = false;
    this.fload = false;

    this.vert = '';
    this.frag = '';

    this.attributes = [{
        pos: 0,
        name: 'p'
    }, {
        pos: 1,
        name: 't'
    }, {
        pos: 2,
        name: 'n'
    }, {
        pos: 3,
        name: 'c'
    }];

    this.uniforms = {
        mvp: {
            type: 'mat4',
            name: 'mvp'
        },
        mmx: {
            type: 'mat4',
            name: 'mmx'
        },
        vmx: {
            type: 'mat4',
            name: 'vmx'
        },
        pmx: {
            type: 'mat4',
            name: 'pmx'
        },
        light: {
            type: 'vec3',
            name: 'light'
        },
        lcolor: {
            type: 'vec3',
            name: 'lcolor'
        },
        diffuse: {
            type: 'vec3',
            name: 'diffuse'
        },
        line: {
            type: 'i',
            name: 'line'
        },
        lwidth: {
            type: 'f',
            name: 'lwidth'
        },
        origin: {
            type: 'vec3',
            name: 'origin'
        },
        material: {
            type: 'i',
            name: 'material'
        },
        time: {
            type: 'f',
            name: 'time'
        },
        specular: {
            type: 'vec3',
            name: 'specular'
        },
        value: {
            type: 'f',
            name: 'value'
        }
    };

    if (this.name === '_') {
        this.vert = require('./vert');
        this.frag = require('./frag');
        this.vload = true;
        this.fload = true;
        this.program = new ShaderProgram(p, this);
        this.program.set();
    } else {
        this.program = new ShaderProgram(p, this);
        getShadersFromFile(this.name, this, this.program, p.spath);
    }
    p.shaders.push(this);
    return this;
};

Shader.prototype.load = function(n, v) {
    if (this.uniforms[n] !== undefined) {
        this.program.load(this.uniforms[n], v);
    }
};

Shader.prototype.ready = function() {
    if (this.vload && this.fload) {
        return true;
    }
    return false;
};

Shader.prototype.start = function() {
    this.program.start();
};

Shader.prototype.stop = function() {
    this.program.stop();
};

Shader.prototype.destroy = function() {
    this.program.destroy();
};

module.exports = Shader;
