import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color, Group, LoadingManager } from 'three'
import * as dat from 'lil-gui'
//import * as fs from 'fs';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

// debug ui
const gui = new dat.GUI()

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
            curObjectPathInd %= (objects.length - 1)
            texture = new THREE.TextureLoader().load( 'textures/door/back' + curObjectPathInd + '.jpg');
            scene.background = texture
            curObjectPathInd += 1

            resolutionIndex = 9

            loader.load(
                objects[curObjectPathInd] + resolutionIndex + '.stl',
                
                function (geometry) { 
                    
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)                
                    if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush')
                    {
                        geometry.scale(0.02, 0.02, 0.02)
                    }
                    else
                    {
                        geometry.scale(0.03, 0.03, 0.03)
                    }

                    const loadedMesh = new THREE.Mesh(geometry, material)
                    if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush'
                    || objects[curObjectPathInd] == '/models/Grape/grape')
                    {
                        loadedMesh.position.z = 1.2
                    }
                    else
                    {
                        loadedMesh.position.z = 0.5
                    }
                    objectA.clear()
                    objectA.add(loadedMesh)
                    scene.clear()
                    scene.add(objectA)
                    scene.add(camera)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
            break; 
        case "KeyB":
            curObjectPath = objectBPath
            resolutionIndex = 9
            loader.load(
                curObjectPath + resolutionIndex + '.stl',
                function (geometry) { 
                    geometry.scale(0.03, 0.03, 0.03)
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)
                    
                    // orientate the object
                    const loadedMesh = new THREE.Mesh(geometry, material)
                    loadedMesh.position.z = 0.5
        
                    objectA.clear()
                    objectA.add(loadedMesh)
                    scene.clear()
                    scene.add(objectA)
                    scene.add(camera)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
            break; 
        case "KeyC":
            curObjectPath = objectCPath
            resolutionIndex = 9
            loader.load(
                curObjectPath + resolutionIndex + '.stl',
                function (geometry) { 
                    geometry.scale(0.025, 0.025, 0.025)
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)
                    
                    // orientate the object
                    const loadedMesh = new THREE.Mesh(geometry, material)
                    loadedMesh.position.z = 1.2
        
                    objectA.clear()
                    objectA.add(loadedMesh)
                    scene.clear()
                    scene.add(objectA)
                    scene.add(camera)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
            break; 
        case "KeyD":
            curObjectPath = objectDPath
            resolutionIndex = 9
            loader.load(
                curObjectPath + resolutionIndex + '.stl',
                function (geometry) { 
                    geometry.scale(0.03, 0.03, 0.03)
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)
                    
                    // orientate the object
                    const loadedMesh = new THREE.Mesh(geometry, material)
                    loadedMesh.position.z = 1.2
        
                    objectA.clear()
                    objectA.add(loadedMesh)
                    scene.clear()
                    scene.add(objectA)
                    scene.add(camera)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
            break; 
        case "KeyE":
            curObjectPath = objectEPath
            resolutionIndex = 9
            loader.load(
                curObjectPath + resolutionIndex + '.stl',
                function (geometry) { 
                    geometry.scale(0.03, 0.03, 0.03)
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)
                    
                    // orientate the object
                    const loadedMesh = new THREE.Mesh(geometry, material)
                    loadedMesh.position.z = 0.5
        
                    objectA.clear()
                    objectA.add(loadedMesh)
                    scene.clear()
                    scene.add(objectA)
                    scene.add(camera)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
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
        
        loader.load(
            objects[curObjectPathInd] + resolutionIndex + '.stl',
            function (geometry) {   
                // orient object
                
                if (objects[curObjectPathInd] == '/models/Banana/banana')
                {
                    geometry.scale(0.01, 0.01, 0.01)
                    geometry.rotateZ(Math.PI / 2)
                    geometry.rotateZ(Math.PI)
                }
                else
                {
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)
                    if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush')
                    {
                        geometry.scale(0.02, 0.02, 0.02)
                    }
                    else
                    {
                        geometry.scale(0.03, 0.03, 0.03)
                    }
                }

                const loadedMesh = new THREE.Mesh(geometry, material)
                if (objects[curObjectPathInd] == '/models/Banana/banana')
                {
                    loadedMesh.position.x = -1
                    loadedMesh.position.z = 0
                }
                else if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush'
                 || objects[curObjectPathInd] == '/models/Grape/grape')
                {
                    loadedMesh.position.z = 1.2
                }
                else
                {
                    loadedMesh.position.z = 0.5
                }

                objectA.clear()
                objectB.clear()
                objectC.clear()
                objectA.add(loadedMesh)
                scene.add(objectA)
                scene.add(camera)
                console.log(scene.children[0].children[0].geometry.attributes.normal.count)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
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
    console.log("hello")
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    var flagUp = false
    var flagDown = false
    var loadingTimer = setInterval(loadingIcon, 1000)  
    resolutionIndex = 9

    function loadingIcon() {
        if (resolutionIndex == 1)
        {
            flagUp = true
            flagDown = false
        }
        if (resolutionIndex == 9)
        {
            flagDown = true
            flagUp = false
        }
        if (flagDown)
        {
            resolutionIndex -= 1
        }
        if (flagUp)
        {
            resolutionIndex += 1
        }
        curObjectPathInd = 0
        // texture = new THREE.TextureLoader().load( 'textures/door/back' + curObjectPathInd + '.jpg');
        // scene.background = texture
        console.log(resolutionIndex)
        loader.load(
            
            objects[curObjectPathInd] + resolutionIndex + '.stl',
            function (geometry) { 
                geometry.scale(0.01, 0.01, 0.01)
                geometry.rotateZ(Math.PI / 2)
                geometry.rotateZ(Math.PI)
                
                // orientate the object
                const loadedMesh = new THREE.Mesh(geometry, material)
                loadedMesh.position.x = -1
                loadedMesh.position.z = 0
    
                objectA.clear()
                objectA.add(loadedMesh)                    
                scene.add(objectA)
                scene.add(camera)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    }
        
    function idle() {
        console.log("idle")
        scene.clear()
        // currentScene = idleScene
        // curObjectPath = objectEPath
        curObjectPathInd = 0
        resolutionIndex = 9
        texture = new THREE.TextureLoader().load( 'textures/door/back' + curObjectPathInd + '.jpg');
        scene.background = texture
        loadingTimer = setInterval(loadingIcon, 1000)  
          
        
    }

    function resetTimer() {
        console.log("reset")
        clearTimeout(time);
        clearInterval(loadingTimer)
        currentScene = scene
        let firstTimeout = true
        

        time = setTimeout(idle, 3000)

        // 1000 milliseconds = 1 second
    }
};

window.onload = function() {
    inactivityTime();
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
    if (scene.children.length > 1)
    {    
        console.log(scene.children[0].children[0].geometry.attributes.normal.count)
        document.getElementById("currentTri").innerHTML = Math.ceil((currentScene.children[0].children[0].geometry.attributes.normal.count / 3) / 3);
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
