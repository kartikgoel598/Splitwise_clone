// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Landing page loaded! 🚀');
    
    // Create more particles dynamically
    function createParticles() {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 100 + 40 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = Math.random() * 10 + 12 + 's';
            document.body.appendChild(particle);
        }
    }
    
    createParticles();
    
});