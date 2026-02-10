import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color, Group, LoadingManager } from 'three'
import * as dat from 'lil-gui'
//import * as fs from 'fs';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

// debug ui
const gui = new dat.GUI()

// Requiring fs module in which
// writeFile function is defined.
// //const fs = require('fs')
    
// Data which will write in a file.
// let data = "Learning how to write in a file."
    
// // Write data in 'Output.txt' .
// fs.writeFile('Output.txt', data, (err) => {
        
//     // In case of a error throw err.
//     if (err) throw err;
// })

// const fsm = require('fs-minipass')
// //const readStream = new fsm.ReadStream('file.txt')
// const writeStream = new fsm.WriteStream('output.txt')
// writeStream.write('some file header or whatever\n')




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




// Materials

// basic material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color.set('#ff9f82')
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

//normal material
const material = new THREE.MeshNormalMaterial()
//material.wireframe = true
material.flatShading = true

// matcap material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// depth material
// const material = new THREE.MeshDepthMaterial()

// lambert material
// const material = new THREE.MeshLambertMaterial()

// blinn phong material
// const material = new THREE.MeshPhongMaterial()
// material. shininess = 100
// material.specular = new THREE.Color('0xffff00')

// cartoony material
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// standard material
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness = 0.2
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = doorAlphaTexture
// material.transparent = true

// adding envirinment map
//material.envMap = environmentMapTexture

//gui.add(material, 'metalness').min(0).max(1).step(0.0001)
//gui.add(material, 'roughness').min(0).max(1).step(0.0001)
//gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
//gui.add(material, 'displacementScale').min(0).max(10).step(0.0001)

// Geometries
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 64, 64),
//     material
// )
// sphere.position.x = -1.5
// sphere.geometry.setAttribute(
//     'uv2', 
//     new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// )

// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.3, 0.2, 164, 128),
//     material
// )
// torus.position.x = 1.5
// torus.geometry.setAttribute(
//     'uv2', 
//     new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
// )



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
                    // console.log(curObjectPathInd)
                    // geometry.scale(0.03, 0.03, 0.03)
                    // geometry.rotateX(Math.PI / 2)
                    // geometry.rotateX(Math.PI)
                    
                    // // orientate the object
                    // const loadedMesh = new THREE.Mesh(geometry, material)
                    // loadedMesh.position.z = 0.5
                    // switch(curObjectPathInd)
                    // {
                    //     case 0:
                    //         geometry.scale(0.015, 0.015, 0.015)
                    //         geometry.rotateZ(Math.PI / 2)
                    //         geometry.rotateZ(Math.PI)
                            
                    //     case 1:
                    //         geometry.scale(0.025, 0.025, 0.025)
                    //         geometry.rotateX(Math.PI / 2)
                    //         geometry.rotateX(Math.PI)
                            
                    //     case 2:
                    //         geometry.scale(0.03, 0.03, 0.03)
                    //         geometry.rotateX(Math.PI / 2)
                    //         geometry.rotateX(Math.PI)
                            
                    //     case 3:
                    //         geometry.scale(0.025, 0.025, 0.025)
                    //         geometry.rotateX(Math.PI / 2)
                    //         geometry.rotateX(Math.PI)
                            
                    //     case 4:
                    //         geometry.scale(0.03, 0.03, 0.03)
                    //         geometry.rotateX(Math.PI / 2)
                    //         geometry.rotateX(Math.PI)
                    // }        
                    // const loadedMesh = new THREE.Mesh(geometry, material)     
                    // switch(curObjectPathInd)
                    // {
                    //     case 0:
                            
                    //         loadedMesh.position.z = 0
                    //         loadedMesh.position.x = -1
                    //     case 1:
                            
                    //         loadedMesh.position.z = 1.2
                    //     case 2:
                            
                    //         loadedMesh.position.z = 0.5
                    //     case 3:
                           
                    //         loadedMesh.position.z = 1.2
                    //     case 4:
                            
                    //         loadedMesh.position.z = 1.2


                    // }
                    // geometry.scale(0.025, 0.025, 0.025)
                    // geometry.rotateX(Math.PI / 2)
                    // geometry.rotateX(Math.PI)
                    // if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush')
                    // {
                    //     geometry.scale(0.025, 0.025, 0.025)
                    // }
                    // if (objects[curObjectPathInd] == '/models/Banana/banana')
                    // {
                    //     geometry.scale(0.015, 0.015, 0.015)
                    // }                        
                    // else
                    // {
                    //     geometry.scale(0.03, 0.03, 0.03)
                    // }

                    // orientate the object
                    // const loadedMesh = new THREE.Mesh(geometry, material)
                    // if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush'
                    // || objects[curObjectPathInd] == '/models/Grape/grape')
                    // {
                    //     loadedMesh.position.z = 1.2
                    // }
                    // else if (objects[curObjectPathInd] == '/models/Banana/banana')
                    // {
                    //     loadedMesh.position.x = -1
                    //     loadedMesh.position.z = 0
                    // }    
                    // else
                    // {
                    //     loadedMesh.position.z = 0.5
                    // }              
                    geometry.rotateX(Math.PI / 2)
                    geometry.rotateX(Math.PI)                
                    if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush')
                    {
                        geometry.scale(0.02, 0.02, 0.02)
                    }
                    // if (objects[curObjectPathInd] == '/models/Banana/banana')
                    //     {
                    //         geometry.scale(0.015, 0.015, 0.015)
                    //     }    
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
                    // if (objects[curObjectPathInd] == '/models/Banana/banana')
                    //     {
                    //         loadedMesh.position.x = -1
                    //         loadedMesh.position.z = 0
                    //     }  
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
                
                geometry.rotateX(Math.PI / 2)
                geometry.rotateX(Math.PI)                
                if (objects[curObjectPathInd] == '/models/Pineapple/pine' || objects[curObjectPathInd] == '/models/Mushroom/mush')
                {
                    geometry.scale(0.02, 0.02, 0.02)
                }
                // if (objects[curObjectPathInd] == '/models/Banana/banana')
                //     {
                //         geometry.scale(0.015, 0.015, 0.015)
                //     }    
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
                // if (objects[curObjectPathInd] == '/models/Banana/banana')
                //     {
                //         loadedMesh.position.x = -1
                //         loadedMesh.position.z = 0
                //     }  
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



// lights
// const ambientLight= new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

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
    // camera.position.x = Math.sin(arrowControls.x) * 2.5 
    // camera.position.y = Math.cos(arrowControls.y) * 2.5 * Math.sin((elapsedTime/2))
    // camera.position.z = Math.cos(arrowControls.x) * 2.5
    //camera.position.y = cursor.y * 3
    camera.lookAt(0, 0, 0)

    objectA.rotation.y = 0.3 * elapsedTime

    // Update objects rotation
    // sphere.rotation.y = 0.1 * elapsedTime
    // // plane.rotation.y = -0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // // plane.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = -0.15 * elapsedTime


    // Update controls
    //controls.update()

    // Render
    renderer.render(currentScene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()