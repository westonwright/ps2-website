import * as THREE from 'three'

export default class BaseScene
{
    constructor(renderer, clearColor, clearAlpha, sizes)
    {
        this.elapsedTime = 0.0;
    
        this.renderer = renderer;
        this.clearColor = clearColor;
        this.clearAlpha = clearAlpha;
        this.sizes = {
            witdh: 0,
            height: 0
        };
        this.updateSizes(sizes);

        this.scene = new THREE.Scene();

        this.fbo = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);
    }

    tick(delta)
    {
        this.elapsedTime += delta;
    }

    renderScene()
    {
        return this.fbo;
    }

    resize(sizes)
    {
        this.updateSizes(sizes);
        this.fbo.setSize(this.sizes.width, this.sizes.height);
    }

    updateSizes(sizes)
    {
        this.sizes.width = sizes.width;
        this.sizes.height = sizes.height;
    }
}