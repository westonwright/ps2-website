import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import createMaterial from './Rendering/FinalOutputMaterial.js'
import BaseScene from './Scenes/BaseScene.js'
import BackgroundScene from './Scenes/BackgroundScene.js'
import SaveDataScene from './Scenes/SaveDataScene.js'
import AboutScene from './Scenes/AboutScene.js'

// Debug
//const gui = new dat.GUI()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneGeometry(sizes.width, sizes.height);

// Materials

const material = createMaterial();
//const material = new THREE.MeshBasicMaterial();
//material.color = new THREE.Color(0xffffff);

// Mesh
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Lights
/*
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
*/

/**
 * Camera
 */
// Base camera
//const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const camera = new THREE.OrthographicCamera( sizes.width / - 2, sizes.width / 2, sizes.height / 2, sizes.height / - 2, - 10, 10 );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//const backgroundScene = new BackgroundScene(renderer, 0x000000, 0, sizes);
const saveDataScene = new SaveDataScene(renderer, 0x000000, 0, sizes);
//const aboutScene = new AboutScene(renderer, 0x000000, 0, sizes);

window.addEventListener('resize', () =>
{

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    renderer.setSize(sizes.width, sizes.height, true)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    sizes.width = canvas.clientWidth ;
    sizes.height = canvas.clientHeight;

    // prevent it from getting too wide and also preven distortion
    resize(sizes);

    //backgroundScene.resize(sizes);
    saveDataScene.resize(sizes);
    //aboutScene.resize(sizes);
});

addEventListener("click", (event) =>
{
    console.log(event.clientX);
    console.log(event.clientY);
});

const resize = (sizes) =>
{
    // Update camera
    camera.aspect =  sizes.width / sizes.height ;
    camera.updateProjectionMatrix();
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.elapsedTime;
    const deltaTime = clock.getDelta();

    // Update Orbital Controls
    // controls.update()

    ///backgroundScene.tick(deltaTime);
    saveDataScene.tick(deltaTime);
    //aboutScene.tick(deltaTime);
    //material.uniforms.colorTexture.value = backgroundScene.renderScene().texture;
    material.uniforms.colorTexture.value = saveDataScene.renderScene().texture;
    //material.uniforms.colorTexture.value = aboutScene.renderScene().texture;

    // Render
    renderer.setClearColor(0x000000, 0);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()