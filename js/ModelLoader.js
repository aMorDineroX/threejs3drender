import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

class ModelLoader {
    constructor() {
        // Configurer le loader GLTF
        this.gltfLoader = new GLTFLoader();
        
        // Configurer le loader DRACO pour la décompression des modèles
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
        this.gltfLoader.setDRACOLoader(dracoLoader);
        
        // Configurer d'autres loaders
        this.fbxLoader = new FBXLoader();
        this.objLoader = new OBJLoader();
        
        // Manager de chargement pour suivre le progrès
        this.loadingManager = new THREE.LoadingManager();
        this.setupLoadingManager();
    }
    
    setupLoadingManager() {
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log(`Started loading: ${url} (${itemsLoaded}/${itemsTotal})`);
            this.showProgressBar();
        };
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = itemsLoaded / itemsTotal * 100;
            console.log(`Loading: ${progress.toFixed(2)}% (${itemsLoaded}/${itemsTotal})`);
            this.updateProgressBar(progress);
        };
        
        this.loadingManager.onLoad = () => {
            console.log('Loading complete!');
            this.hideProgressBar();
        };
        
        this.loadingManager.onError = (url) => {
            console.error(`Error loading: ${url}`);
            this.showErrorMessage(`Échec du chargement: ${url}`);
        };
        
        // Configurer les loaders pour utiliser le manager
        this.gltfLoader.manager = this.loadingManager;
        this.fbxLoader.manager = this.loadingManager;
        this.objLoader.manager = this.loadingManager;
    }
    
    // Interface UI pour le chargement
    showProgressBar() {
        if (this.progressContainer) return;
        
        this.progressContainer = document.createElement('div');
        this.progressContainer.style.position = 'fixed';
        this.progressContainer.style.top = '50%';
        this.progressContainer.style.left = '50%';
        this.progressContainer.style.transform = 'translate(-50%, -50%)';
        this.progressContainer.style.width = '250px';
        this.progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.progressContainer.style.padding = '20px';
        this.progressContainer.style.borderRadius = '8px';
        this.progressContainer.style.zIndex = '9999';
        
        const label = document.createElement('div');
        label.textContent = 'Chargement du modèle...';
        label.style.color = 'white';
        label.style.marginBottom = '10px';
        label.style.textAlign = 'center';
        
        this.progressBar = document.createElement('div');
        this.progressBar.style.width = '100%';
        this.progressBar.style.height = '10px';
        this.progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        this.progressBar.style.borderRadius = '5px';
        this.progressBar.style.overflow = 'hidden';
        
        this.progressFill = document.createElement('div');
        this.progressFill.style.width = '0%';
        this.progressFill.style.height = '100%';
        this.progressFill.style.backgroundColor = '#4CAF50';
        this.progressFill.style.transition = 'width 0.2s';
        
        this.progressBar.appendChild(this.progressFill);
        this.progressContainer.appendChild(label);
        this.progressContainer.appendChild(this.progressBar);
        document.body.appendChild(this.progressContainer);
    }
    
    updateProgressBar(progress) {
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    hideProgressBar() {
        if (this.progressContainer) {
            document.body.removeChild(this.progressContainer);
            this.progressContainer = null;
        }
    }
    
    showErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.style.position = 'fixed';
        errorContainer.style.top = '10px';
        errorContainer.style.left = '50%';
        errorContainer.style.transform = 'translateX(-50%)';
        errorContainer.style.backgroundColor = 'rgba(255, 50, 50, 0.9)';
        errorContainer.style.color = 'white';
        errorContainer.style.padding = '10px 20px';
        errorContainer.style.borderRadius = '5px';
        errorContainer.style.zIndex = '9999';
        errorContainer.textContent = message;
        
        document.body.appendChild(errorContainer);
        
        setTimeout(() => {
            document.body.removeChild(errorContainer);
        }, 5000);
    }
    
    // Méthodes de chargement pour différents formats
    loadGLTF(url, onLoad, onProgress) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    if (onLoad) onLoad(gltf);
                    resolve(gltf);
                },
                onProgress,
                (error) => {
                    console.error('Error loading GLTF model:', error);
                    reject(error);
                }
            );
        });
    }
    
    loadFBX(url, onLoad, onProgress) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(
                url,
                (fbx) => {
                    if (onLoad) onLoad(fbx);
                    resolve(fbx);
                },
                onProgress,
                (error) => {
                    console.error('Error loading FBX model:', error);
                    reject(error);
                }
            );
        });
    }
    
    loadOBJ(url, onLoad, onProgress) {
        return new Promise((resolve, reject) => {
            this.objLoader.load(
                url,
                (obj) => {
                    if (onLoad) onLoad(obj);
                    resolve(obj);
                },
                onProgress,
                (error) => {
                    console.error('Error loading OBJ model:', error);
                    reject(error);
                }
            );
        });
    }
    
    // Détecte automatiquement le format et charge le modèle
    loadModel(url, onLoad, onProgress) {
        const extension = url.split('.').pop().toLowerCase();
        
        switch(extension) {
            case 'gltf':
            case 'glb':
                return this.loadGLTF(url, onLoad, onProgress);
            case 'fbx':
                return this.loadFBX(url, onLoad, onProgress);
            case 'obj':
                return this.loadOBJ(url, onLoad, onProgress);
            default:
                const error = `Format de fichier non pris en charge: ${extension}`;
                this.showErrorMessage(error);
                return Promise.reject(new Error(error));
        }
    }
}

export default ModelLoader;
