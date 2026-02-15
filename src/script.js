import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color, Group, LoadingManager } from 'three'
//import * as fs from 'fs';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

// textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

/** Debug: when false, options overlay (keys, triangle count) is hidden */
const DEBUG = false

/** Preloaded banana background for idle screen (avoids black flash) */
const idleBackgroundTexture = textureLoader.load('textures/door/back0.jpg')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const idleScene = new THREE.Scene()

//normal material
const material = new THREE.MeshNormalMaterial()
//material.wireframe = true
material.flatShading = true

const body = document.querySelector('body')
window.addEventListener('dblclick', () =>
{
    body.requestFullscreen()
})


// Load stl files
const loader = new STLLoader()

// Helper to dispose geometry and free GPU memory before loading new mesh
function disposeMesh(group) {
    group.traverse((child) => {
        if (child.isMesh) {
            child.geometry.dispose()
            if (child.material) child.material.dispose()
        }
    })
    group.clear()
}

// object groups for each model type and its resolutions
const objectA = new THREE.Group()
const objectB = new THREE.Group()
const objectC = new THREE.Group()
let curObjectPathInd = 0
let curObjectPath = '/models/Grape/grape';
const objectAPath = '/models/Pineapple/pine';
const objectBPath = '/models/Apple/apple';
const objectCPath = '/models/Mushroom/mush';
const objectDPath = '/models/Grape/grape';
const objectEPath = '/models/Straw/straw';
const loadingObjectPath = '/models/Banana/banana'
const objects = ['/models/Banana/banana', '/models/Apple/apple','/models/Grape/grape','/models/Pineapple/pine','/models/Mushroom/mush','/models/Straw/straw']
let resolutionIndex = '1';

let texture = new THREE.TextureLoader().load( 'textures/door/back' + curObjectPathInd + '.jpg');
//scene.background = texture

let loadId = 0
// Generic model loader to avoid repeated code and ensure proper positioning; ignores stale completions to avoid leaks
function loadModel(objectPath, objectIndex, resolution, onLoaded) {
    const thisLoadId = ++loadId
    loader.load(
        objectPath + resolution + '.stl',
        function (geometry) {
            if (thisLoadId !== loadId) {
                geometry.dispose()
                return
            }
            if (objectPath === '/models/Banana/banana') {
                geometry.scale(0.01, 0.01, 0.01)
                geometry.rotateZ(Math.PI / 2)
                geometry.rotateZ(Math.PI)
            } else {
                geometry.rotateX(Math.PI / 2)
                geometry.rotateX(Math.PI)
                if (objectPath === '/models/Pineapple/pine' || objectPath === '/models/Mushroom/mush') {
                    geometry.scale(0.02, 0.02, 0.02)
                } else {
                    geometry.scale(0.03, 0.03, 0.03)
                }
            }
            const loadedMesh = new THREE.Mesh(geometry, material)
            if (objectPath === '/models/Banana/banana') {
                loadedMesh.position.x = -1
                loadedMesh.position.z = 0
            } else if (objectPath === '/models/Pineapple/pine' || objectPath === '/models/Mushroom/mush' || objectPath === '/models/Grape/grape') {
                loadedMesh.position.z = 1.2
            } else {
                loadedMesh.position.z = 0.5
            }
            disposeMesh(objectA)
            objectA.add(loadedMesh)
            scene.clear()
            scene.add(objectA)
            scene.add(camera)
            if (onLoaded) onLoaded()
        },
        (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded') },
        (error) => { console.log(error) }
    )
}

// object selection event
window.addEventListener('keydown', (event) =>
{
    if (event.defaultPrevented)
    {
        return; // Do nothing if event already handled
    }
    
    switch(event.code)
    {
        case "KeyA":
            curObjectPathInd += 1
            curObjectPathInd %= objects.length
            texture = new THREE.TextureLoader().load( 'textures/door/back' + curObjectPathInd + '.jpg');
            scene.background = texture
            curObjectPathInd += 1

            resolutionIndex = 9
            loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
            break; 
        case "KeyB":
            curObjectPathInd = 1
            curObjectPath = objectBPath
            resolutionIndex = 9
            loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
            break; 
        case "KeyC":
            curObjectPathInd = 4
            curObjectPath = objectCPath
            resolutionIndex = 9
            loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
            break; 
        case "KeyD":
            curObjectPathInd = 2
            curObjectPath = objectDPath
            resolutionIndex = 9
            loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
            break; 
        case "KeyE":
            curObjectPathInd = 5
            curObjectPath = objectEPath
            resolutionIndex = 9
            loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
            break; 
    }
})


// Load stl files using number pad with corresponding resolution
// key press 1 == turn left/lower, key press 2 == turn right/higher
window.addEventListener('keydown', (event) =>
{

    if (event.defaultPrevented)
    {
        return; // Do nothing if event already handled
    }
    if (event.key >= 1 && event.key <= 2)
    {
        
        // raise resolution if not maximal
        if (event.key == 2 && resolutionIndex > 1)
        {
           resolutionIndex -= 1
        }
        // lower resolution if not minimal
        if (event.key == 1 && resolutionIndex < 9)
        {
           resolutionIndex += 1
        }
        loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
    }
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Control camera with arrow keys
const ratationSpeed = 0.1
const arrowControls = {
    x: 0,
    y: 0,
    z: 0
}

window.addEventListener('keydown', (event) =>
{
    if (event.defaultPrevented)
    {
        return; // Do nothing if event already handled
    }
    switch(event.code)
    {
        case "ArrowUp":
            arrowControls.y += ratationSpeed
            arrowControls.z -= ratationSpeed 
            // console.log('arrowDown')
            break; 
        case "ArrowDown":
            arrowControls.y -= ratationSpeed
            arrowControls.z += ratationSpeed 
            // console.log('arrowDown')
            break; 
        case "ArrowLeft":
            arrowControls.x -= ratationSpeed
            arrowControls.z += ratationSpeed 
            // console.log('arrowDown')
            break; 
        case "ArrowRight":
            arrowControls.x += ratationSpeed
            arrowControls.z -= ratationSpeed 
            // console.log('arrowDown')
            break; 
    }
    //console.log(arrowControls.x, arrowControls.y, arrowControls.z)
})

// idleScene.add(sphere, torus)
idleScene.add(camera)
let currentScene = scene



var inactivityTime = function () {
    var time
    var loadingTimer = null
    window.onload = resetTimer
    document.onmousemove = resetTimer
    document.onkeydown = resetTimer

    function idle() {
        disposeMesh(objectA)
        scene.clear()
        curObjectPathInd = 0
        resolutionIndex = 9
        scene.background = idleBackgroundTexture
    }

    function resetTimer() {
        clearTimeout(time)
        if (loadingTimer) clearInterval(loadingTimer)
        loadingTimer = null
        currentScene = scene
        if (objectA.children.length === 0) loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
        time = setTimeout(idle, 3000)
    }
    time = setTimeout(idle, 3000)
};

window.onload = function () {
    curObjectPathInd = 0
    resolutionIndex = 9
    loadModel(objects[curObjectPathInd], curObjectPathInd, resolutionIndex)
    inactivityTime()
    if (!DEBUG) {
        const info = document.getElementById('info')
        const kofi = document.getElementById('kofi')
        if (info) info.style.display = 'none'
        if (kofi) kofi.style.display = 'none'
    }
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    if (DEBUG && scene.children.length > 1) {
        const el = document.getElementById('currentTri')
        if (el) el.innerHTML = Math.ceil((currentScene.children[0].children[0].geometry.attributes.normal.count / 3) / 3)
    }
          
    
    const elapsedTime = clock.getElapsedTime()

    // Update camera
    camera.lookAt(0, 0, 0)

    objectA.rotation.y = 0.3 * elapsedTime

    // Render
    renderer.render(currentScene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

