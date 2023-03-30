import BaseScene from "./BaseScene"
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';


export default class SaveDataScene extends BaseScene
{
    constructor(renderer, clearColor, clearAlph, sizes)
    {
        super(renderer, clearColor, clearAlph, sizes);

        this.dataParent = document.querySelector('.dataParent');
        this.dataDirectoryContainer = document.querySelector('.dataDirectoryContainer');
        this.dataDirectory = document.querySelector('.dataDirectory');
        this.dataDescriptionContainer = document.querySelector('.dataDescriptionContainer');
        this.dataDescription = document.querySelector('.dataDescription');

        this.tileHorizontalRange = 6;
        this.tileVerticalSpacing = 1.75;
        this.verticalOffset = 0;
        this.tileSlideSpeed = 10;
        this.tileCount = 40;

        this.scrollOffset = 0;
        this.maxScrollOffset = 0;

        this.camera = new THREE.PerspectiveCamera(22, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.x = 0;
        this.camera.position.y = 20;
        this.camera.position.z = 13.5;
        this.camera.rotation.x = THREE.MathUtils.degToRad(-60);
        this.scene.add(this.camera);

        this.tiles = [];
        this.goals = [];
        for(let i = 0; i < this.tileCount; i++)
        {
            this.goals.push(new THREE.Object3D());
            this.tiles.push(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial()));
            this.tiles[i].material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
            this.scene.add(this.tiles[i]);
        }
        /*
        this.testPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshLambertMaterial());
        this.testPlane.color = new THREE.Color(0xffffff);
        this.scene.add(this.testPlane);
        this.testPlane.rotation.x = THREE.MathUtils.degToRad(-90);
        this.testPlane.scale.x = 10;
        this.testPlane.scale.y = 10;

        this.testLight = new THREE.PointLight
        (
            new THREE.Color(0xffffff),
            1,
            100,
            0
        );
        this.testLight.position.y = 10;
        this.testLight.position.z = 10;

        this.scene.add(this.testLight);
        */
        this.resize(this.sizes);
    }

    tick(delta)
    {
        this.elapsedTime += delta;

        for(let i = 0; i < this.tileCount; i++)
        {
            var tile = this.tiles[i];
            var goal = this.goals[i];
            tile.position.lerp(goal.position, 1 / this.tileSlideSpeed);
            //tile.position.set(newPos.x, newPos.y, newPos.z);
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

        // resize text
        this.dataDirectory.style.fontSize = '5vh';
        this.resizeText(this.dataDirectory, this.dataDirectoryContainer, this.dataParent);

        this.dataDescription.style.fontSize = '5vh';
        this.resizeText(this.dataDescription, this.dataDescriptionContainer, this.dataParent);

        // resize and reposition tiles
        var sizeRatio = this.sizes.width/this.sizes.height;

        var horizontalTiles = 6;
        var verticalTiles = 0;
        var scaledHorizontalRange = this.tileHorizontalRange;

        if(sizeRatio > 1)
        {
            var addition = 1 - Math.floor(sizeRatio / 2);
            horizontalTiles -= addition;
            scaledHorizontalRange *= sizeRatio;
        }
        else
        {
            var addition = 1 - Math.ceil(1 / (sizeRatio / 2));
            horizontalTiles += addition;
            horizontalTiles = Math.max(horizontalTiles, 1);
            scaledHorizontalRange *= Math.pow(sizeRatio, 1.5);
            //scaledHorizontalRange *= sizeRatio;
        }
        verticalTiles = Math.max(this.tileCount / horizontalTiles);
        //console.log("horizontal " + horizontalTiles);
        //console.log("vertical " + verticalTiles);

        this.maxScrollOffset = Math.max((verticalTiles - 4), 0) * this.tileVerticalSpacing;

        scaledHorizontalRange = scaledHorizontalRange / 2;
        // if width / height is greater than one, it is landscape
        for(let i = 0; i < horizontalTiles; i++)
        {
            for(let j = 0; j < verticalTiles; j++)
            {
                var index = (j * (horizontalTiles)) + i;
                if(index > this.tileCount - 1) continue;

                //console.log(index);
                var goal = this.goals[index];
                var alpha =  horizontalTiles > 1 ? i / (horizontalTiles - 1) : 0.5;
                goal.position.x = THREE.MathUtils.lerp(-scaledHorizontalRange, scaledHorizontalRange, alpha);
                goal.position.z = (this.tileVerticalSpacing * j) - this.verticalOffset;
                //tile.position.y = THREE.MathUtils.lerp(-this.tileSpacing.height, this.tileSpacing.height, j / (verticalTiles - 1));
                //tile.scale.y = sizes.height / 200.0;
            }
        }

        // resize camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
    }

    // refactor this to use quick search
    resizeText(textObj, containerObj, parentObj)
    {
        var fontSize = window.getComputedStyle(textObj).fontSize;
        var resized = false;
        if(containerObj.scrollWidth > containerObj.clientWidth)
        {
            textObj.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
            resized = true;
        }
        if(containerObj.scrollHeight > containerObj.clientHeight)
        {
            textObj.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
            resized = true;
        }
        if(resized)
        {
            this.resizeText(textObj, containerObj, parentObj);  
        }
    }

    updateSizes(sizes)
    {
        super.updateSizes(sizes);
    }
}