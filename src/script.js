import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { Vector3 } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null


gltfLoader.load('models/rock2.glb', function (gltf) {
    // const mesh = gltf.scene.children;
    // const meshMaterial = mesh[0].material.vertexColors
    // console.log(meshMaterial)
    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            sampler = new MeshSurfaceSampler(obj).build()
        }
    })

    transformMesh()
})

gltfLoader.load(
    '/models/rock2.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.25, 0.25, 0.25)
        scene.add(gltf.scene)
    }
)

/**
 * Lights
 */
const light = new THREE.PointLight( 0xffffff, 25, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );

/**
 * Particles
 */

//details needed for the particles
let sampler
let pointsGeometry = new THREE.BufferGeometry()

//location
const vertices = []
const temporaryPosition = new THREE.Vector3()

//size
const scaleArray = new Float32Array(300)

//color
// const colorArray = new Uint16Array(900)
const colorArray =  []
const temporaryColor = new THREE.Vector3()
//const temporaryColor = new THREE.Color()

//const notImportantArray = []
const notImportant = new THREE.Vector3()

console.log(colorArray)
//pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
//console.log(vertices)

//Function to transform the mesh to particles
function transformMesh(){
    //Transform the mesh to particles
    for (let i = 0; i < 300; i ++){
        sampler.sample(temporaryPosition, notImportant, temporaryColor)
        vertices.push(temporaryPosition.x, temporaryPosition.y, temporaryPosition.z)
        //colorArray.push(temporaryColor.x/255, temporaryColor.y/255, temporaryColor.z/255)
        var colorR = temporaryColor.r/255
        var colorG = temporaryColor.g/255
        var colorB = temporaryColor.b/255
        //colorArray.push(temporaryColor)
        colorArray.push(colorR, colorG, colorB)
        scaleArray[i] = Math.random()

        // pointsMaterial.setAttribute('color', new THREE.Vector3(colorR, colorG, colorB))
        //pointsGeometry.setAttribute('color', new THREE.Color(colorArray, 3))
        //console.log(temporaryColor, temporaryPosition)
    
}
    //define all points positions from the array
    pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3))
    pointsGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
    // pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    // pointsGeometry.setAttribute('color', new THREE.Color(colorArray, 3))

    //define material of the points
    const pointsMaterial = new THREE.ShaderMaterial({
        //depthWrite: false,
        //blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:{
            uTime: {value: 0},
            uSize: { value: 30 * renderer.getPixelRatio()}
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    })
    
    // Create an instance of points based on the geometry & material
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    // Add them into the main group
    scene.add(points)

}

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()