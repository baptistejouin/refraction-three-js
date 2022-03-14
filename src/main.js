import './style.css'

import loadTexture from './utils/texture-loader.js'
import * as THREE from 'three'

class App {
	constructor() {
    this.render = this.render.bind(this);

		// viewport object
		this.vp = {
			width: window.innerWidth,
			height: window.innerHeight,
			dpr: Math.min(devicePixelRatio, 2 || 1)
		}

		this.setup()
	}

	async setup() {
    // Buffer where the video card draws pixels for a scene that is being rendered in the background
    this.envFbo = new THREE.WebGLRenderTarget(
      this.vp.width * this.vp.dpr,
      this.vp.height * this.vp.dpr
    );

    // Create a new scene
		this.scene = new THREE.Scene()

    // Create an orthographic camera (see: https://cutt.ly/NA3Cyzv for a comparison with perspective)
		this.orthoCamera = new THREE.OrthographicCamera(this.vp.width / -2, this.vp.width / 2, this.vp.height / 2, this.vp.height / -2, 1, 1000)

    // Create a perspective camera
		this.camera = new THREE.PerspectiveCamera(50, this.vp.width / this.vp.height, 0.1, 1000)

		// Move the camera to layer 1
		this.orthoCamera.layers.set(1)

		// Load texture.jpeg
		const tex = await loadTexture('./texture.jpeg')

		// Setup a new plane mesh from tex (texture.jpeg) material
		this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ map: tex }))

		// Scale in fullscreen (<=> 100vw, 100vh)
		this.quad.scale.set(this.vp.width, this.vp.height, 1)

		// Move the plane to layer 1 same as orthoCamera
		this.quad.layers.set(1)

		// Add to the sceane
		this.scene.add(this.quad)

    // Render with antialiasing
		this.renderer = new THREE.WebGLRenderer({ antialias: true })

    // Scale in fullscreen (<=> 100vw, 100vh)
		this.renderer.setSize(this.vp.width, this.vp.height)

    // Set the right depht pixel ration (eg. 2 on MacBook)
		this.renderer.setPixelRatio(this.vp.dpr)

    // Set if the renderer should automatically clear its output before rendering a frame
		this.renderer.autoClear = false

    // Adding the canvas to the HTML
		document.body.appendChild(this.renderer.domElement)

		console.log('INFO : ', 'Scene created.')

    // Render with RequestAnimationFrame
		this.render()
	}

	render() {
		// RequestAnimationFrame(this.render)

    // Tells the renderer to clear its color, depth or stencil drawing buffer(s)
		this.renderer.clear()

		// Render background to Fbo
		this.renderer.setRenderTarget(this.envFbo)
		this.renderer.render(this.scene, this.orthoCamera)

		// Render background to screen
		this.renderer.setRenderTarget(null)
		this.renderer.render(this.scene, this.orthoCamera)
		this.renderer.clearDepth()

		// Render geometry to screen
		this.renderer.render(this.scene, this.camera)
	}
}

new App()
