/**
 * Gestionnaire de thèmes pour Three.js Explorer
 * Permet de basculer entre les thèmes clair et sombre
 */
class ThemeManager {
    constructor(options = {}) {
        this.options = Object.assign({
            storageKey: 'threejs-explorer-theme',
            defaultTheme: 'dark',
            lightThemeClass: 'light-theme',
            selector: '.theme-toggle',
            icons: {
                light: '☀️',
                dark: '🌙'
            }
        }, options);
        
        // Create singleton instance
        if (window.themeManagerInstance) {
            return window.themeManagerInstance;
        }
        
        window.themeManagerInstance = this;
        
        this.currentTheme = this.loadThemePreference();
        this.applyTheme(this.currentTheme);
        this.setupToggleButtons();
    }
    
    /**
     * Charge la préférence de thème depuis le localStorage
     * @returns {string} - 'light' ou 'dark'
     */
    loadThemePreference() {
        const savedTheme = localStorage.getItem(this.options.storageKey);
        
        // Vérifier si l'utilisateur préfère le thème sombre au niveau du navigateur
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : this.options.defaultTheme;
        }
        
        return savedTheme;
    }
    
    /**
     * Applique le thème spécifié
     * @param {string} theme - 'light' ou 'dark'
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'light') {
            document.body.classList.add(this.options.lightThemeClass);
        } else {
            document.body.classList.remove(this.options.lightThemeClass);
        }
        
        // Sauvegarder la préférence
        localStorage.setItem(this.options.storageKey, theme);
        
        // Mettre à jour les icônes sur tous les boutons de bascule
        this.updateToggleButtons();
    }
    
    /**
     * Configure les boutons de bascule de thème
     */
    setupToggleButtons() {
        const toggleButtons = document.querySelectorAll(this.options.selector);
        
        toggleButtons.forEach(button => {
            // Définir l'icône initiale
            this.updateButtonIcon(button);
            
            // Ajouter l'événement de clic
            button.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
            });
        });
        
        // Écouter les changements de préférence de thème au niveau du navigateur
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            this.applyTheme(newTheme);
        });
    }
    
    /**
     * Met à jour les icônes sur tous les boutons de bascule
     */
    updateToggleButtons() {
        const toggleButtons = document.querySelectorAll(this.options.selector);
        toggleButtons.forEach(button => this.updateButtonIcon(button));
    }
    
    /**
     * Met à jour l'icône d'un bouton de bascule spécifique
     * @param {HTMLElement} button - Le bouton à mettre à jour
     */
    updateButtonIcon(button) {
        const icon = this.options.icons[this.currentTheme === 'dark' ? 'light' : 'dark'];
        button.innerHTML = icon;
        button.setAttribute('aria-label', `Passer au thème ${this.currentTheme === 'dark' ? 'clair' : 'sombre'}`);
        button.setAttribute('title', `Passer au thème ${this.currentTheme === 'dark' ? 'clair' : 'sombre'}`);
    }
    
    /**
     * Bascule le thème manuellement
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
}

// Create a global instance if the script is loaded directly
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.themeManagerInstance) {
            new ThemeManager();
        }
    });
}

// Exporter la classe
export default ThemeManager;
