class ControlPanel {
    constructor(options = {}) {
        this.options = Object.assign({
            position: 'right', // 'left', 'right'
            title: 'Paramètres',
            container: document.body,
            collapsed: true // Fermé par défaut
        }, options);
        
        this.controls = {};
        this.panel = this.createPanel();
        this.content = this.createContent();
        this.panel.appendChild(this.content);
        this.options.container.appendChild(this.panel);
        
        // Si le panneau doit être fermé par défaut
        if (this.options.collapsed) {
            this.togglePanel(false);
        }
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        panel.style.position = 'absolute';
        panel.style.top = '60px';
        panel.style.width = '250px';
        panel.style[this.options.position] = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '1000';
        panel.style.maxHeight = 'calc(100vh - 80px)';
        panel.style.overflowY = 'auto';
        panel.style.backdropFilter = 'blur(5px)';
        panel.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        panel.style.transition = 'all 0.3s ease';
        
        return panel;
    }
    
    createContent() {
        const content = document.createElement('div');
        
        // Titre avec un bouton pour replier/déplier
        const titleBar = document.createElement('div');
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.marginBottom = '10px';
        titleBar.style.padding = '0 0 5px 0';
        titleBar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        titleBar.style.cursor = 'pointer';
        
        const title = document.createElement('h3');
        title.textContent = this.options.title;
        title.style.margin = '0';
        
        const toggleButton = document.createElement('span');
        toggleButton.innerHTML = '−'; // Caractère moins
        toggleButton.style.fontSize = '20px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.lineHeight = '1';
        
        titleBar.appendChild(title);
        titleBar.appendChild(toggleButton);
        
        // Créer un conteneur pour le contenu pouvant être masqué
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'control-panel-content';
        
        // Ajouter l'événement pour plier/déplier
        titleBar.addEventListener('click', () => {
            this.togglePanel();
        });
        
        content.appendChild(titleBar);
        content.appendChild(this.contentContainer);
        
        // Conserver les références pour l'état ouvert/fermé
        this.titleBar = titleBar;
        this.toggleButton = toggleButton;
        
        return content;
    }
    
    togglePanel(show = undefined) {
        const isCurrentlyVisible = this.contentContainer.style.display !== 'none';
        const shouldShow = show !== undefined ? show : !isCurrentlyVisible;
        
        if (shouldShow) {
            // Ouvrir le panneau
            this.contentContainer.style.display = 'block';
            this.toggleButton.innerHTML = '−'; // Caractère moins
            this.panel.style.opacity = '1';
        } else {
            // Fermer le panneau
            this.contentContainer.style.display = 'none';
            this.toggleButton.innerHTML = '+'; // Caractère plus
            this.panel.style.opacity = '0.85';
        }
    }
    
    addSlider(id, options) {
        const { label, min, max, value, step, onChange } = Object.assign({
            min: 0,
            max: 100,
            value: 50,
            step: 1,
            onChange: () => {}
        }, options);
        
        const controlGroup = document.createElement('div');
        controlGroup.style.marginBottom = '10px';
        
        // Label
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.display = 'block';
        labelEl.style.marginBottom = '5px';
        
        // Slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;
        slider.style.width = '100%';
        
        // Value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = value;
        valueDisplay.style.marginLeft = '10px';
        valueDisplay.style.fontSize = '12px';
        
        // Change event
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valueDisplay.textContent = val;
            onChange(val);
        });
        
        controlGroup.appendChild(labelEl);
        controlGroup.appendChild(slider);
        labelEl.appendChild(valueDisplay);
        
        this.contentContainer.appendChild(controlGroup);
        this.controls[id] = { slider, valueDisplay };
        
        return this;
    }
    
    addCheckbox(id, options) {
        const { label, checked, onChange } = Object.assign({
            checked: false,
            onChange: () => {}
        }, options);
        
        const controlGroup = document.createElement('div');
        controlGroup.style.marginBottom = '10px';
        
        // Checkbox container
        const checkboxContainer = document.createElement('label');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.cursor = 'pointer';
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.style.marginRight = '8px';
        
        // Label
        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        
        // Change event
        checkbox.addEventListener('change', (e) => {
            onChange(e.target.checked);
        });
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(labelEl);
        controlGroup.appendChild(checkboxContainer);
        
        this.contentContainer.appendChild(controlGroup);
        this.controls[id] = checkbox;
        
        return this;
    }
    
    addButton(id, options) {
        const { label, onClick } = Object.assign({
            onClick: () => {}
        }, options);
        
        const button = document.createElement('button');
        button.textContent = label;
        button.style.width = '100%';
        button.style.padding = '8px';
        button.style.marginBottom = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', onClick);
        
        this.contentContainer.appendChild(button);
        this.controls[id] = button;
        
        return this;
    }
    
    // Mettre à jour la valeur d'un contrôle existant
    setValue(id, value) {
        const control = this.controls[id];
        if (!control) return;
        
        if (control.slider) {
            control.slider.value = value;
            control.valueDisplay.textContent = value;
        } else if (control.type === 'checkbox') {
            control.checked = value;
        } else if (control.value !== undefined) {
            control.value = value;
        }
        
        return this;
    }
    
    // Obtenir la valeur d'un contrôle
    getValue(id) {
        const control = this.controls[id];
        if (!control) return null;
        
        if (control.slider) {
            return parseFloat(control.slider.value);
        } else if (control.type === 'checkbox') {
            return control.checked;
        } else if (control.value !== undefined) {
            return control.value;
        }
        
        return null;
    }
}

export default ControlPanel;
