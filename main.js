import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

// Classe ControlPanel pour gérer l'interface utilisateur
class ControlPanel {
    constructor(options = {}) {
        this.position = options.position || 'right';
        this.title = options.title || 'Control Panel';
        this.collapsed = options.collapsed !== undefined ? options.collapsed : false;
        
        // Création du panneau
        this.panel = document.createElement('div');
        this.panel.className = 'control-panel';
        this.panel.style.position = 'absolute';
        this.panel.style.padding = '15px';
        this.panel.style.width = '250px';
        
        // Positionnement
        if (this.position === 'right') {
            this.panel.style.right = '20px';
            this.panel.style.top = '80px';
        } else if (this.position === 'left') {
            this.panel.style.left = '20px';
            this.panel.style.top = '80px';
        }
        
        // Poignée de déplacement
        const dragHandle = document.createElement('div');
        dragHandle.className = 'control-panel-drag-handle';
        this.panel.appendChild(dragHandle);
        
        // En-tête avec titre et bouton de bascule
        const header = document.createElement('div');
        header.className = 'control-panel-header';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = this.title;
        
        const toggleButton = document.createElement('span');
        toggleButton.className = 'control-panel-toggle';
        toggleButton.textContent = this.collapsed ? '+' : '−';
        
        header.appendChild(titleElement);
        header.appendChild(toggleButton);
        
        // Conteneur de contenu
        this.content = document.createElement('div');
        this.content.className = 'control-panel-content';
        
        if (this.collapsed) {
            this.content.style.display = 'none';
        }
        
        this.panel.appendChild(header);
        this.panel.appendChild(this.content);
        
        // Basculer le panneau lorsque l'en-tête est cliqué
        header.addEventListener('click', () => {
            this.collapsed = !this.collapsed;
            this.content.style.display = this.collapsed ? 'none' : 'block';
            toggleButton.textContent = this.collapsed ? '+' : '−';
        });
        
        // Rendre le panneau déplaçable
        this.makeDraggable(this.panel);
        
        document.body.appendChild(this.panel);
    }
    
    // Rendre un élément déplaçable
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        const dragHandle = element.querySelector('.control-panel-drag-handle');
        if (dragHandle) {
            dragHandle.style.cursor = 'move';
            dragHandle.addEventListener('mousedown', dragMouseDown);
        } else {
            element.style.cursor = 'move';
            element.addEventListener('mousedown', dragMouseDown);
        }
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Obtenir la position de la souris au démarrage
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }
        
        function elementDrag(e) {
            e.preventDefault();
            // Calculer la nouvelle position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Définir la nouvelle position de l'élément
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Arrêter de déplacer lorsque le bouton de la souris est relâché
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }
    
    // Ajouter un curseur
    addSlider(id, options = {}) {
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        
        const label = document.createElement('label');
        label.textContent = options.label || id;
        label.htmlFor = id;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = id;
        slider.min = options.min !== undefined ? options.min : 0;
        slider.max = options.max !== undefined ? options.max : 1;
        slider.step = options.step !== undefined ? options.step : 0.01;
        slider.value = options.value !== undefined ? options.value : 0.5;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = slider.value;
        valueDisplay.style.marginLeft = '10px';
        valueDisplay.style.fontSize = '12px';
        
        slider.addEventListener('input', () => {
            if (options.onChange) {
                options.onChange(parseFloat(slider.value));
            }
            valueDisplay.textContent = slider.value;
        });
        
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        this.content.appendChild(container);
        
        return slider;
    }
    
    // Ajouter une case à cocher
    addCheckbox(id, options = {}) {
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = options.checked !== undefined ? options.checked : false;
        checkbox.style.marginRight = '10px';
        
        const label = document.createElement('label');
        label.textContent = options.label || id;
        label.htmlFor = id;
        label.style.cursor = 'pointer';
        
        checkbox.addEventListener('change', () => {
            if (options.onChange) {
                options.onChange(checkbox.checked);
            }
        });
        
        container.appendChild(checkbox);
        container.appendChild(label);
        this.content.appendChild(container);
        
        return checkbox;
    }
    
    // Ajouter un bouton
    addButton(id, options = {}) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = options.label || id;
        button.style.marginBottom = '15px';
        button.style.width = '100%';
        
        button.addEventListener('click', () => {
            if (options.onClick) {
                options.onClick();
            }
        });
        
        this.content.appendChild(button);
        
        return button;
    }
    
    // Ajouter un sélecteur de couleur
    addColorPicker(id, options = {}) {
        const container = document.createElement('div');
        container.style.marginBottom = '15px';
        
        const label = document.createElement('label');
        label.textContent = options.label || id;
        label.htmlFor = id;
        
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = id;
        colorPicker.value = options.value || '#ffffff';
        colorPicker.style.marginLeft = '10px';
        colorPicker.style.cursor = 'pointer';
        
        colorPicker.addEventListener('input', () => {
            if (options.onChange) {
                options.onChange(colorPicker.value);
            }
        });
        
        container.appendChild(label);
        container.appendChild(colorPicker);
        this.content.appendChild(container);
        
        return colorPicker;
    }
}

// Création de la scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a);

// Ajout de brouillard pour un effet de profondeur
scene.fog = new THREE.FogExp2(0x2a2a2a, 0.02);

// Création de la caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Création du renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Ajout des contrôles de navigation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI * 0.85;

// Ajout d'une grille
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Ajout du cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    flatShading: true
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Création d'un fond d'étoiles
function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 5000; i++) {
        // Créer des étoiles en position aléatoire
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        
        vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    
    return stars;
}

// Création du système de particules
function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        // Couleur
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    return particles;
}

// Création de formes 3D
function createShapes() {
    // Liste pour stocker toutes les formes
    const shapes = [];
    
    // Tore
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x220000
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(3, 0, 0);
    torus.castShadow = true;
    scene.add(torus);
    shapes.push(torus);
    
    // Sphère
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1e90ff,
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-3, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);
    shapes.push(sphere);
    
    // Octaèdre
    const octahedronGeometry = new THREE.OctahedronGeometry(1);
    const octahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0x7cfc00,
        metalness: 0.3,
        roughness: 0.5,
        emissive: 0x002200
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(0, 0, 3);
    octahedron.castShadow = true;
    scene.add(octahedron);
    shapes.push(octahedron);
    
    // Nœud de tore
    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.6, 0.25, 100, 16);
    const torusKnotMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff1493,
        metalness: 0.5,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.set(0, 0, -3);
    torusKnot.castShadow = true;
    scene.add(torusKnot);
    shapes.push(torusKnot);
    
    return shapes;
}

// Amélioration de l'éclairage
function enhanceLighting() {
    // Ajout d'une lumière ponctuelle rouge
    const redLight = new THREE.PointLight(0xff0000, 1, 10);
    redLight.position.set(5, 3, 0);
    redLight.castShadow = true;
    scene.add(redLight);
    
    // Ajout d'une lumière ponctuelle bleue
    const blueLight = new THREE.PointLight(0x0000ff, 1, 10);
    blueLight.position.set(-5, 3, 0);
    blueLight.castShadow = true;
    scene.add(blueLight);
    
    // Ajout d'une spotlight pour l'effet dramatique
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 8, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    spotLight.decay = 2;
    spotLight.distance = 20;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    
    return { redLight, blueLight, spotLight };
}

// Création d'un sol texturé
function createTexturedGround() {
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
    
    // Créer une texture quadrillée
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Dessiner le quadrillage
    context.fillStyle = '#333';
    context.fillRect(0, 0, 512, 512);
    context.fillStyle = '#3c3c3c';
    const squareSize = 64;
    
    for (let x = 0; x < 512; x += squareSize) {
        for (let y = 0; y < 512; y += squareSize) {
            if ((x / squareSize + y / squareSize) % 2 === 0) {
                context.fillRect(x, y, squareSize, squareSize);
            }
        }
    }
    
    // Créer la texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.2
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    
    scene.add(ground);
    
    return ground;
}

// Ajout des lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Stats FPS
const stats = new Stats();
stats.dom.style.position = 'absolute';
stats.dom.style.left = '10px';
stats.dom.style.top = '60px';
const statsContainer = document.getElementById('stats-container');
statsContainer.appendChild(stats.dom);

// Initialisation des éléments améliorés
const starfield = createStarfield();
const particles = createParticleSystem();
const additionalShapes = createShapes();
const enhancedLights = enhanceLighting();
const ground = createTexturedGround();

// Animations avancées pour les matériaux
function setupMaterialAnimations() {
    // Créer un objet pour stocker les cibles d'animation
    const animations = {
        isActive: true,
        targets: []
    };
    
    // Animation de couleur pour le cube
    animations.targets.push({
        object: cube.material,
        property: 'color',
        colors: [
            new THREE.Color(0x00ff00), // vert
            new THREE.Color(0x0000ff), // bleu
            new THREE.Color(0xff0000), // rouge
            new THREE.Color(0xffff00), // jaune
            new THREE.Color(0x00ffff), // cyan
            new THREE.Color(0xff00ff), // magenta
        ],
        currentIndex: 0,
        duration: 5000, // ms
        lastChange: Date.now(),
        enabled: false,
        lerp: 0.02 // facteur de lissage (linear interpolation)
    });
    
    // Animation de métallisation pour la sphère
    animations.targets.push({
        object: additionalShapes[1].material,
        property: 'metalness',
        min: 0,
        max: 1,
        speed: 0.005,
        direction: 1,
        enabled: false
    });
    
    // Animation d'émissivité pour l'octaèdre
    animations.targets.push({
        object: additionalShapes[2].material,
        property: 'emissiveIntensity',
        min: 0,
        max: 1,
        speed: 0.01,
        direction: 1,
        enabled: false,
        setup: () => {
            additionalShapes[2].material.emissive = new THREE.Color(0x00ff00);
            additionalShapes[2].material.emissiveIntensity = 0;
        }
    });
    
    // Animation de rugosité pour le tore
    animations.targets.push({
        object: additionalShapes[0].material,
        property: 'roughness',
        min: 0,
        max: 1,
        speed: 0.008,
        direction: 1,
        enabled: false
    });
    
    // Animation de clearcoat pour le nœud de tore
    animations.targets.push({
        object: additionalShapes[3].material,
        property: 'clearcoat',
        min: 0,
        max: 1,
        speed: 0.015,
        direction: 1,
        enabled: false
    });
    
    // Initialisation des animations qui ont besoin d'un setup
    animations.targets.forEach(target => {
        if (target.setup) {
            target.setup();
        }
    });
    
    return animations;
}

// Animation de la caméra le long d'un chemin
function setupCameraAnimation() {
    // Créer un chemin 3D pour la caméra
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(10, 5, 10),
        new THREE.Vector3(10, 5, -10),
        new THREE.Vector3(-10, 5, -10),
        new THREE.Vector3(-10, 5, 10),
        new THREE.Vector3(10, 5, 10) // Boucle au début
    ]);
    
    curve.closed = true;
    
    // Visualiser le chemin avec une ligne (optionnel)
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
    
    return {
        enabled: false,
        curve: curve,
        progress: 0,
        speed: 0.0005,
        cameraTarget: new THREE.Vector3(0, 0, 0),
        visualPath: curveObject
    };
}

// Système d'animation sonore
function setupAudioReactiveAnimation() {
    let audioContext, analyser, dataArray;
    let isSetup = false;
    let isPlaying = false;
    let audio = new Audio();
    
    function setupAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            // Charger un son d'ambiance
            audio.src = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=ambient-piano-amp-strings-10711.mp3';
            audio.loop = true;
            audio.volume = 0.3;
            
            isSetup = true;
        } catch (error) {
            console.error("WebAudio API non prise en charge ou erreur:", error);
        }
    }
    
    function toggleAudio() {
        if (!isSetup) {
            setupAudio();
        }
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            // WebAudio needs to be resumed on user interaction
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            audio.play().catch(e => console.error("Erreur de lecture audio:", e));
            isPlaying = true;
        }
        
        return isPlaying;
    }
    
    function getAudioData() {
        if (isSetup && isPlaying) {
            analyser.getByteFrequencyData(dataArray);
            return dataArray;
        }
        return null;
    }
    
    function applyAudioAnimation(objects) {
        const data = getAudioData();
        if (!data) return;
        
        // Utiliser différentes bandes de fréquence pour animer différents objets
        const bass = data[2] / 255; // basses fréquences
        const mid = data[10] / 255; // fréquences moyennes
        const treble = data[20] / 255; // hautes fréquences
        
        // Animer les échelles des objets en fonction des fréquences
        objects.forEach((obj, index) => {
            if (!obj) return;
            
            switch (index % 3) {
                case 0: // Basses
                    obj.scale.set(1 + bass * 0.5, 1 + bass * 0.5, 1 + bass * 0.5);
                    break;
                case 1: // Moyennes
                    obj.scale.set(1 + mid * 0.3, 1 + mid * 0.3, 1 + mid * 0.3);
                    break;
                case 2: // Aiguës
                    obj.scale.set(1 + treble * 0.2, 1 + treble * 0.2, 1 + treble * 0.2);
                    break;
            }
        });
        
        // Modifier l'intensité des lumières en fonction de l'audio
        enhancedLights.redLight.intensity = 0.5 + bass * 2;
        enhancedLights.blueLight.intensity = 0.5 + treble * 2;
        enhancedLights.spotLight.intensity = 0.5 + mid * 2;
    }
    
    return {
        setup: setupAudio,
        toggle: toggleAudio,
        getData: getAudioData,
        apply: applyAudioAnimation,
        isPlaying: () => isPlaying,
        enabled: false
    };
}

// Animation de morphing pour créer des formes qui se transforment
function createMorphingShape() {
    // Créer un maillage avec une forme de base (cube)
    const baseGeometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
    const targetGeometries = [
        new THREE.SphereGeometry(0.8, 8, 8),    // sphère
        new THREE.ConeGeometry(0.7, 1.5, 8),    // cône
        new THREE.TorusGeometry(0.6, 0.2, 8, 16) // tore
    ];
    
    // Convertir toutes les géométries en BufferGeometry avec le même nombre de vertices
    const morphTargets = [];
    targetGeometries.forEach(geometry => {
        const positionAttribute = geometry.attributes.position;
        morphTargets.push(positionAttribute);
    });
    
    // Créer le matériau permettant le morphing
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        morphTargets: true,
        metalness: 0.3,
        roughness: 0.4,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2
    });
    
    // Créer le maillage avec les cibles de morphing
    const mesh = new THREE.Mesh(baseGeometry, material);
    mesh.position.set(0, 3, 0);
    mesh.castShadow = true;
    scene.add(mesh);
    
    return {
        mesh: mesh,
        morphTargets: morphTargets,
        currentTarget: 0,
        morphInfluence: 0,
        direction: 0.01,
        enabled: false,
        switchTarget: function() {
            this.currentTarget = (this.currentTarget + 1) % this.morphTargets.length;
        }
    };
}

// Initialisation des systèmes d'animation
const materialAnimations = setupMaterialAnimations();
const cameraAnimation = setupCameraAnimation();
const audioAnimation = setupAudioReactiveAnimation();
const morphingShape = createMorphingShape();

// Animation
let rotationSpeed = 0.005;
function animate() {
    requestAnimationFrame(animate);
    
    stats.update();
    
    // Animation standard de rotation
    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;
    
    // Animer les formes additionnelles
    additionalShapes[0].rotation.x += rotationSpeed * 0.5; // torus
    additionalShapes[1].rotation.y += rotationSpeed * 0.3; // sphere
    additionalShapes[2].rotation.z += rotationSpeed * 0.7; // octahedron
    additionalShapes[3].rotation.x += rotationSpeed * 0.9; // torusKnot
    
    // Animation des particules
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    // Animation des lumières colorées
    enhancedLights.redLight.position.x = Math.sin(Date.now() * 0.001) * 5;
    enhancedLights.redLight.position.z = Math.cos(Date.now() * 0.001) * 5;
    
    enhancedLights.blueLight.position.x = Math.sin(Date.now() * 0.001 + Math.PI) * 5;
    enhancedLights.blueLight.position.z = Math.cos(Date.now() * 0.001 + Math.PI) * 5;
    
    // Animations des matériaux
    if (materialAnimations.isActive) {
        materialAnimations.targets.forEach(target => {
            if (!target.enabled) return;
            
            if (target.colors) {
                // Animation de couleur
                const now = Date.now();
                if (now - target.lastChange > target.duration) {
                    target.lastChange = now;
                    target.currentIndex = (target.currentIndex + 1) % target.colors.length;
                }
                
                const currentColor = target.object[target.property];
                const targetColor = target.colors[target.currentIndex];
                
                currentColor.r += (targetColor.r - currentColor.r) * target.lerp;
                currentColor.g += (targetColor.g - currentColor.g) * target.lerp;
                currentColor.b += (targetColor.b - currentColor.b) * target.lerp;
            } else {
                // Animation de propriété numérique (metalness, roughness, etc.)
                const value = target.object[target.property];
                const newValue = value + (target.speed * target.direction);
                
                if (newValue > target.max) {
                    target.object[target.property] = target.max;
                    target.direction = -1;
                } else if (newValue < target.min) {
                    target.object[target.property] = target.min;
                    target.direction = 1;
                } else {
                    target.object[target.property] = newValue;
                }
            }
        });
    }
    
    // Animation de la caméra
    if (cameraAnimation.enabled) {
        cameraAnimation.progress += cameraAnimation.speed;
        if (cameraAnimation.progress > 1) cameraAnimation.progress = 0;
        
        const point = cameraAnimation.curve.getPointAt(cameraAnimation.progress);
        camera.position.copy(point);
        
        // Regarder toujours vers le centre
        camera.lookAt(cameraAnimation.cameraTarget);
        
        // Mettre à jour les contrôles
        controls.target.copy(cameraAnimation.cameraTarget);
        controls.update();
    }
    
    // Animation réactive au son
    if (audioAnimation.enabled) {
        audioAnimation.apply([...additionalShapes, cube]);
    }
    
    // Animation de morphing
    if (morphingShape.enabled) {
        morphingShape.mesh.morphTargetInfluences[morphingShape.currentTarget] += morphingShape.direction;
        
        if (morphingShape.mesh.morphTargetInfluences[morphingShape.currentTarget] >= 1) {
            morphingShape.mesh.morphTargetInfluences[morphingShape.currentTarget] = 1;
            morphingShape.direction = -morphingShape.direction;
        } else if (morphingShape.mesh.morphTargetInfluences[morphingShape.currentTarget] <= 0) {
            morphingShape.mesh.morphTargetInfluences[morphingShape.currentTarget] = 0;
            morphingShape.switchTarget();
            morphingShape.direction = Math.abs(morphingShape.direction);
        }
        
        morphingShape.mesh.rotation.y += rotationSpeed * 0.5;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Fonction pour réinitialiser la vue de la caméra
function resetView() {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Configurer le panneau de contrôle
function setupControlPanel() {
    const controlPanel = new ControlPanel({
        position: 'right',
        title: 'Contrôles de la scène',
        collapsed: true // Fermé par défaut
    });
    
    // Vitesse de rotation
    controlPanel.addSlider('rotation-speed', {
        label: 'Vitesse de rotation',
        min: 0,
        max: 0.05,
        value: rotationSpeed,
        step: 0.001,
        onChange: (val) => {
            rotationSpeed = val;
        }
    });
    
    // Rotation automatique
    controlPanel.addCheckbox('auto-rotate', {
        label: 'Rotation automatique',
        checked: false,
        onChange: (val) => {
            controls.autoRotate = val;
        }
    });
    
    // Bouton de réinitialisation
    controlPanel.addButton('reset-view', {
        label: 'Réinitialiser la vue',
        onClick: resetView
    });
    
    // Couleur de fond
    controlPanel.addColorPicker('background-color', {
        label: 'Couleur de fond',
        value: '#2a2a2a',
        onChange: (val) => {
            scene.background = new THREE.Color(val);
            scene.fog.color = new THREE.Color(val);
        }
    });
    
    // Couleur du cube
    controlPanel.addColorPicker('cube-color', {
        label: 'Couleur du cube',
        value: '#00ff00',
        onChange: (val) => {
            cube.material.color.set(val);
        }
    });
    
    // Intensité du brouillard
    controlPanel.addSlider('fog-density', {
        label: 'Densité du brouillard',
        min: 0,
        max: 0.05,
        value: 0.02,
        step: 0.001,
        onChange: (val) => {
            scene.fog.density = val;
        }
    });
    
    // Taille des étoiles
    controlPanel.addSlider('star-size', {
        label: 'Taille des étoiles',
        min: 0.1,
        max: 3,
        value: 1.5,
        step: 0.1,
        onChange: (val) => {
            starfield.material.size = val;
        }
    });
    
    // Visibilité des éléments
    controlPanel.addCheckbox('show-stars', {
        label: 'Afficher les étoiles',
        checked: true,
        onChange: (val) => {
            starfield.visible = val;
        }
    });
    
    controlPanel.addCheckbox('show-particles', {
        label: 'Afficher les particules',
        checked: true,
        onChange: (val) => {
            particles.visible = val;
        }
    });
    
    controlPanel.addCheckbox('show-shapes', {
        label: 'Afficher les formes',
        checked: true,
        onChange: (val) => {
            additionalShapes.forEach(shape => shape.visible = val);
        }
    });

    // Ajouter une section pour les animations avancées
    const animSectionTitle = document.createElement('div');
    animSectionTitle.className = 'control-section-title';
    animSectionTitle.textContent = 'Animations avancées';
    controlPanel.content.appendChild(animSectionTitle);
    
    // Animation des matériaux
    controlPanel.addCheckbox('material-animations', {
        label: 'Animation des couleurs',
        checked: false,
        onChange: (val) => {
            materialAnimations.targets[0].enabled = val; // Animation de couleur du cube
        }
    });
    
    controlPanel.addCheckbox('material-metalness', {
        label: 'Animation métallique',
        checked: false,
        onChange: (val) => {
            materialAnimations.targets[1].enabled = val; // Animation de metalness
        }
    });
    
    controlPanel.addCheckbox('material-emissive', {
        label: 'Animation luminosité',
        checked: false,
        onChange: (val) => {
            materialAnimations.targets[2].enabled = val; // Animation d'émissivité
        }
    });
    
    // Animation de caméra
    controlPanel.addCheckbox('camera-animation', {
        label: 'Animation de caméra',
        checked: false,
        onChange: (val) => {
            cameraAnimation.enabled = val;
            cameraAnimation.visualPath.visible = val;
            
            // Désactiver les contrôles manuels pendant l'animation
            controls.enabled = !val;
        }
    });
    
    controlPanel.addSlider('camera-speed', {
        label: 'Vitesse de caméra',
        min: 0.0001,
        max: 0.003,
        value: cameraAnimation.speed,
        step: 0.0001,
        onChange: (val) => {
            cameraAnimation.speed = val;
        }
    });
    
    // Animation audio
    controlPanel.addCheckbox('audio-reactive', {
        label: 'Réaction au son',
        checked: false,
        onChange: (val) => {
            audioAnimation.enabled = val;
            if (val && !audioAnimation.isPlaying()) {
                audioAnimation.toggle();
            }
        }
    });
    
    controlPanel.addButton('toggle-audio', {
        label: 'Activer/Désactiver le son',
        onClick: () => {
            const isPlaying = audioAnimation.toggle();
            audioAnimation.enabled = isPlaying;
            // Mettre à jour la case à cocher de réaction au son
            const checkbox = document.getElementById('audio-reactive');
            if (checkbox) checkbox.checked = isPlaying;
        }
    });
    
    // Animation de morphing
    controlPanel.addCheckbox('morphing-animation', {
        label: 'Forme morphing',
        checked: false,
        onChange: (val) => {
            morphingShape.enabled = val;
            morphingShape.mesh.visible = val;
        }
    });
    
    // Animation d'ambiance générale
    controlPanel.addButton('animate-all', {
        label: 'Activer toutes les animations',
        onClick: () => {
            // Activer toutes les animations
            materialAnimations.targets.forEach(target => target.enabled = true);
            const checkboxes = document.querySelectorAll('.control-panel input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('change'));
            });
        }
    });
    
    controlPanel.addButton('stop-all', {
        label: 'Arrêter toutes les animations',
        onClick: () => {
            // Désactiver toutes les animations
            materialAnimations.targets.forEach(target => target.enabled = false);
            cameraAnimation.enabled = false;
            audioAnimation.enabled = false;
            if (audioAnimation.isPlaying()) audioAnimation.toggle();
            morphingShape.enabled = false;
            
            const checkboxes = document.querySelectorAll('.control-panel input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb.id === 'auto-rotate' || cb.id === 'show-stars' || 
                    cb.id === 'show-particles' || cb.id === 'show-shapes') return;
                cb.checked = false;
                cb.dispatchEvent(new Event('change'));
            });
            
            controls.enabled = true;
        }
    });
    
    return controlPanel;
}

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

// Initialiser le panneau de contrôle
const controlPanel = setupControlPanel();

// Démarrage de l'animation
animate();
