import BaseScene from "./BaseScene"
import * as THREE from 'three'

export default class BackgroundScene extends BaseScene
{
    constructor(renderer, clearColor, clearAlph, sizes)
    {
        super(renderer, clearColor, clearAlph, sizes);

        this.orbSpeed = 5.0;
        this.orbSpread = 0.01;

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 10;
        this.scene.add(this.camera);

        this.orbs = [];
        this.orbGoals = [];
        this.orbGoalGroup = new THREE.Group();

        this.orbMat = new THREE.MeshBasicMaterial();
        this.orbMat.color = new THREE.Color(0xffff00);

        for(let i = 0; i < 7; i++)
        {
            this.orbGoals.push(new THREE.Object3D());
            this.orbGoalGroup.add(this.orbGoals[i]);

            //this.orbs.push(new THREE.Mesh(new THREE.SphereGeometry(1.0), this.orbMat));
            this.orbs.push(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.orbMat));
            
            this.orbs[i].lookAt(this.camera.position);

            
            this.scene.add(this.orbs[i]);
        }

        this.scene.add(this.orbGoalGroup);
    }

    tick(delta)
    {
        this.elapsedTime += delta;

        this.orbGoalGroup.rotation.x = this.elapsedTime * 2;
        this.orbGoalGroup.rotation.z = this.elapsedTime * 2;
        var vec0 = new THREE.Vector3();
        for(let i = 0; i < 7; i++)
        {
            var orbGoal = this.orbGoals[i];
            orbGoal.position.x = Math.sin((this.elapsedTime * ((i + 1) * this.orbSpread)) * this.orbSpeed);
            orbGoal.position.y = Math.cos((this.elapsedTime * ((i + 1) * this.orbSpread)) * this.orbSpeed);
            var orb = this.orbs[i];

            var worldPos = orbGoal.getWorldPosition(vec0);
            orb.position.set(worldPos.x, worldPos.y, worldPos.z);
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

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    updateSizes(sizes)
    {
        super.updateSizes(sizes);
    }
}