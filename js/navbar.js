/**
 * Script pour gérer le menu de navigation responsive
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    // Si les éléments n'existent pas, sortir de la fonction
    if (!menuToggle || !navbarLinks) return;
    
    // Fonction pour basculer le menu
    function toggleMenu() {
        navbarLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Accessibilité: indiquer si le menu est ouvert ou fermé
        const isExpanded = navbarLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Empêcher le défilement du body lorsque le menu est ouvert sur mobile
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Configurer l'accessibilité du bouton de menu
    menuToggle.setAttribute('aria-label', 'Menu principal');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'navbar-links');
    
    // Ajouter l'événement de clic
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Empêcher la propagation pour éviter la fermeture immédiate
        toggleMenu();
    });
    
    // Fermer le menu lorsqu'un lien est cliqué
    const links = navbarLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Fermer le menu lorsque l'utilisateur clique en dehors
    document.addEventListener('click', function(event) {
        const isClickInside = menuToggle.contains(event.target) || navbarLinks.contains(event.target);
        if (!isClickInside && navbarLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Fermer le menu lorsque l'utilisateur redimensionne la fenêtre au-delà de 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navbarLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Support des touches clavier pour l'accessibilité
    menuToggle.addEventListener('keydown', function(e) {
        // Ouvrir/fermer avec Espace ou Entrée
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // Permettre la fermeture avec Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Initialisation du gestionnaire de thème si le script est chargé
    initThemeToggle();
});

/**
 * Initialise le bouton de bascule de thème dans la barre de navigation
 */
function initThemeToggle() {
    // Vérifier si le bouton de thème existe déjà
    let themeToggle = document.querySelector('.navbar .theme-toggle');
    
    // Si le bouton n'existe pas et que le ThemeManager est disponible, créer le bouton
    if (!themeToggle) {
        // Créer le bouton de thème
        themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = '🌙'; // L'icône sera mise à jour par ThemeManager
        
        // Trouver l'emplacement approprié dans la navbar (avant le menu hamburger)
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navbar && menuToggle) {
            navbar.insertBefore(themeToggle, menuToggle);
        }
    }
    
    // Dynamically load the ThemeManager if it's not already loaded
    if (typeof window.ThemeManager === 'undefined') {
        import('./ThemeManager.js').then(module => {
            window.ThemeManager = module.default;
            new window.ThemeManager();
        }).catch(err => {
            console.warn('Could not load ThemeManager:', err);
        });
    }
}
