'use strict';

var Vector = require('./vector');
var Matrix = require('./matrix');
var Shader = require('./shader');
var Camera = require('./camera');
var Light = require('./light');

var Render = function Render(p) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!p.started || p.r !== null) {
        return null;
    }

    if (p.shaders.length === 0) {
        this.shader = new Shader(p, options.sha);
    } else {
        this.shader = p.shaders[0];
    }

    if (p.cameras.length === 0) {
        this.camera = new Camera(p, options.cam);
    } else {
        this.camera = p.cameras[0];
    }

    if (p.lights.length === 0) {
        this.light = new Light(p, options.lig);
    } else {
        this.light = p.lights[0];
    }

    this.clean = false;
    this.background = new Vector([0.9, 0.9, 0.9]);
    this.gl = p.gl;

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);

    this.p = p;

    p.r = this;
    return this;
};

Render.prototype.sky = function (c) {
    if (c !== undefined) {
        this.background.all(c);
    }
    return this.background.all();
};

Render.prototype.sha = function (sha) {
    if (sha !== undefined) {
        this.shader = sha;
    }
    return this.shader;
};

Render.prototype.cam = function (cam) {
    if (cam !== undefined) {
        this.camera = cam;
    }
    return this.camera;
};

Render.prototype.lig = function (lig) {
    if (lig !== undefined) {
        this.light = lig;
    }
    return this.light;
};

Render.prototype.update = function (models) {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clearColor(this.background.x(), this.background.y(), this.background.z(), 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    if (this.shader.ready()) {
        this.shader.start();
        this.shader.load('time', this.p.time);
        this.shader.load('light', this.light.p());
        this.shader.load('lcolor', this.light.c());
        for (var i = 0; i < models.length; i++) {
            if (!models[i].del) {
                // position
                this.gl.enableVertexAttribArray(0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, models[i].bu.p);
                this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
                // texture coordinates
                this.gl.enableVertexAttribArray(1);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, models[i].bu.t);
                this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 0, 0);
                // normals
                this.gl.enableVertexAttribArray(2);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, models[i].bu.n);
                this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 0, 0);
                // colors
                if (models[i].bu.c) {
                    this.gl.enableVertexAttribArray(3);
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, models[i].bu.c);
                    this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, 0, 0);
                }
                // indicies
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, models[i].bu.i);
                for (var j = 0; j < models[i].ent().length; j++) {
                    if (!models[i].ent()[j].hi()) {
                        var mmx = Matrix.mmx(models[i].ent()[j]);
                        var mvp = Matrix.mvp(mmx, this.camera.view, this.camera.projection);
                        this.shader.load('diffuse', models[i].ent()[j].c());
                        this.shader.load('specular', models[i].ent()[j].sp());
                        this.shader.load('material', models[i].ent()[j].ma());
                        this.shader.load('value', models[i].ent()[j].va());
                        this.shader.load('line', models[i].ent()[j].li());
                        this.shader.load('lwidth', models[i].ent()[j].lw());
                        this.shader.load('origin', models[i].ent()[j].o());
                        this.shader.load('mmx', mmx.all());
                        this.shader.load('vmx', this.camera.view.all());
                        this.shader.load('pmx', this.camera.projection.all());
                        this.shader.load('mvp', mvp.all());
                        this.gl.drawElements(this.gl.TRIANGLES, models[i].size(), this.gl.UNSIGNED_SHORT, 0);
                    }
                }
                this.gl.disableVertexAttribArray(0);
                this.gl.disableVertexAttribArray(1);
                this.gl.disableVertexAttribArray(2);

                if (models[i].bu.c) {
                    this.gl.disableVertexAttribArray(3);
                }
            }
        }
        this.shader.stop();
    }
};

Render.prototype.destroy = function (shaders) {
    if (!this.clean) {
        for (var s in shaders.length) {
            if (shaders[s] !== undefined) {
                shaders[s].destroy();
            }
        }
        this.clean = true;
    }
};

module.exports = Render;