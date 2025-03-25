import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class SceneManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId) || document.createElement('canvas');
        if (!document.getElementById(canvasId)) {
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true
        });
        
        this.setDefaults();
        this.setupEventListeners();
    }
    
    setDefaults() {
        // Configurer le renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Configurer la caméra
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        
        // Configurer la scène
        this.scene.background = new THREE.Color(0x2a2a2a);
        
        // Configurer les contrôles
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.render();
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    load(sceneName) {
        // Cette méthode pourrait charger différentes scènes/démos
        console.log(`Loading scene: ${sceneName}`);
        // Implémentation spécifique à ajouter
    }
}

export default SceneManager;
