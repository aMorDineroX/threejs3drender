class PerformanceMonitor {
    constructor(options = {}) {
        this.options = Object.assign({
            container: document.body,
            samples: 60, // Nombre d'échantillons pour la moyenne
            showFPS: true,
            showMemory: true,
            position: 'top-left' // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        }, options);
        
        this.frames = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.fpsHistory = Array(this.options.samples).fill(0);
        this.fpsIndex = 0;
        
        this.panel = this.createPanel();
        this.options.container.appendChild(this.panel);
        
        this.update();
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'performance-monitor';
        
        // Positionnement
        panel.style.position = 'absolute';
        panel.style.zIndex = '9999';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        panel.style.color = '#0f0';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '12px';
        panel.style.padding = '5px 10px';
        panel.style.borderRadius = '3px';
        panel.style.pointerEvents = 'none';
        
        switch(this.options.position) {
            case 'top-right':
                panel.style.top = '10px';
                panel.style.right = '10px';
                break;
            case 'bottom-left':
                panel.style.bottom = '10px';
                panel.style.left = '10px';
                break;
            case 'bottom-right':
                panel.style.bottom = '10px';
                panel.style.right = '10px';
                break;
            case 'top-left':
            default:
                panel.style.top = '10px';
                panel.style.left = '10px';
                break;
        }
        
        // Contenu initial
        this.fpsDisplay = document.createElement('div');
        panel.appendChild(this.fpsDisplay);
        
        if (this.options.showMemory && window.performance && window.performance.memory) {
            this.memoryDisplay = document.createElement('div');
            panel.appendChild(this.memoryDisplay);
        }
        
        return panel;
    }
    
    update() {
        // Calculer les FPS
        this.frames++;
        const time = performance.now();
        if (time >= this.lastTime + 1000) {
            this.fps = this.frames * 1000 / (time - this.lastTime);
            this.fpsHistory[this.fpsIndex] = this.fps;
            this.fpsIndex = (this.fpsIndex + 1) % this.options.samples;
            
            this.frames = 0;
            this.lastTime = time;
            
            // Mettre à jour l'affichage
            if (this.options.showFPS) {
                const avgFps = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / 
                               this.fpsHistory.filter(fps => fps > 0).length;
                this.fpsDisplay.textContent = `FPS: ${avgFps.toFixed(1)}`;
                
                // Changer la couleur en fonction des FPS
                if (avgFps < 30) {
                    this.fpsDisplay.style.color = '#f44';
                } else if (avgFps < 50) {
                    this.fpsDisplay.style.color = '#ff4';
                } else {
                    this.fpsDisplay.style.color = '#0f0';
                }
            }
            
            if (this.options.showMemory && window.performance && window.performance.memory) {
                const memory = performance.memory;
                const usedHeap = memory.usedJSHeapSize / (1024 * 1024);
                const totalHeap = memory.jsHeapSizeLimit / (1024 * 1024);
                this.memoryDisplay.textContent = `MEM: ${usedHeap.toFixed(1)} / ${totalHeap.toFixed(0)} MB`;
            }
        }
        
        requestAnimationFrame(() => this.update());
    }
}

export default PerformanceMonitor;
