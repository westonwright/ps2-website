import BaseScene from "./BaseScene"
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Vector3 } from "three";


export default class AboutScene extends BaseScene
{
    constructor(renderer, clearColor, clearAlph, sizes)
    {
        super(renderer, clearColor, clearAlph, sizes);

        this.cubeCount = 5;
        this.cubeSlideSpeed = 10;

        this.cubeOffsetPortrait = 1;
        this.minCubeSpacingPortrait = 1;
        this.maxCubeSpacingPortrait = 3.5;
        this.maxCubeSeparationPortrait = 1.25;
        this.maxCubeScalePortrait = 0.7;
        this.cubeScaleRatePortrait = 0.85;

        this.cubeOffsetLandscape = 1.5;
        this.minCubeSpacingLandscape = 3;
        this.maxCubeSpacingLandscape = 3.5;
        this.maxCubeSeparationLandscape = 3;
        this.maxCubeScaleLandscape = 1.5;
        this.cubeScaleRateLandscape = 1;

        this.camera = new THREE.PerspectiveCamera(12, this.sizes.width / this.sizes.height, 0.1, 500);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 45;
        this.scene.add(this.camera);

        this.cubes = [];
        this.goals = [];
        for(let i = 0; i < this.cubeCount; i++)
        {
            this.goals.push(new THREE.Object3D());
            this.cubes.push(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial()));
            this.cubes[i].material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
            this.scene.add(this.cubes[i]);
        }
    }

    tick(delta)
    {
        this.elapsedTime += delta;


        for(let i = 0; i < this.cubeCount; i++)
        {
            var cube = this.cubes[i];
            var goal = this.goals[i];
            cube.position.lerp(goal.position, 1 / this.cubeSlideSpeed);
            cube.scale.lerp(goal.scale, 1 / this.cubeSlideSpeed);
        }
    }

    renderScene()
    {
        this.renderer.setClearColor(this.clearColor, this.clearAlpha);
        this.renderer.setRenderTarget(this.fbo);

        this.renderer.render(this.scene, this.camera);
        return this.fbo;
    }

    resize(sizes)
    {
        super.resize(sizes);

        var sizeRatio = sizes.width/sizes.height;

        var tempVec = new Vector3(0, 0, 0);
        tempVec.project(this.camera);
        var camZVal = tempVec.z;

        var edgePositions = new Vector3(1, 1, camZVal);
        edgePositions.unproject(this.camera)

        if(sizeRatio > 1)
        {
            var alpha = (sizeRatio - 1) * this.cubeScaleRateLandscape;
            alpha = Math.min(alpha, 1);

            var scaledOffset = -edgePositions.x + this.cubeOffsetLandscape;
            // if width / height is greater than one, it is landscape
            for(let i = 0; i < this.cubeCount; i++)
            {
                var goal = this.goals[i];
                var spreadAlpha = i / (this.cubeCount - 1);
                var separation = THREE.MathUtils.lerp(0, (((i + 1) % 2) - 0.5) * this.maxCubeSeparationLandscape, alpha);
    
                var spacing = THREE.MathUtils.lerp(this.maxCubeSpacingLandscape, this.minCubeSpacingLandscape, alpha);

                goal.position.x = scaledOffset + separation + (alpha * (this.maxCubeSeparationLandscape / 2));
                goal.position.y = THREE.MathUtils.lerp(-spacing, spacing, spreadAlpha);

                var scaleSet = THREE.MathUtils.lerp(1, this.maxCubeScaleLandscape, alpha);
                goal.scale.set(scaleSet, scaleSet, scaleSet);
            }

        }
        else
        {
            var alpha = ((1 / sizeRatio) - 1) * this.cubeScaleRatePortrait;
            alpha = Math.min(alpha, 1);

            var scaledOffset = -edgePositions.y + this.cubeOffsetPortrait;
            for(let i = 0; i < this.cubeCount; i++)
            {
                var goal = this.goals[i];
                var spreadAlpha = i / (this.cubeCount - 1);
                var separation = THREE.MathUtils.lerp(0, (((i + 1) % 2) - 0.5) * this.maxCubeSeparationPortrait, alpha);
                var spacing = THREE.MathUtils.lerp(this.maxCubeSpacingPortrait, this.minCubeSpacingPortrait, alpha);

                goal.position.x = THREE.MathUtils.lerp(-spacing, spacing, spreadAlpha);
                goal.position.y = scaledOffset + separation + (alpha * (this.maxCubeSeparationPortrait / 2)); 

                var scaleSet = THREE.MathUtils.lerp(1, this.maxCubeScalePortrait, alpha);
                goal.scale.set(scaleSet, scaleSet, scaleSet);
            }

        }

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    updateSizes(sizes)
    {
        super.updateSizes(sizes);
    }
}