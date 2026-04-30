// --- DATA STORE ---
*/
const projectsData = {
    1: {
        title: "Project Alpha",
        category: "Immersive Environment",
        description: "A high-fidelity environment currently under construction. Featuring advanced lighting techniques and optimized geometry.",
        features: ["Advanced Lighting", "Optimized Geometry", "Atmospheric Effects"],
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600"
    },
    2: {
        title: "Neon Horizon",
        category: "Visual Design",
        description: "A visual design system focusing on UI and neon aesthetics. Currently in the prototyping phase.",
        features: ["Custom UI System", "Neon Aesthetics", "Interactive Elements"],
        image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1600"
    },
    3: {
        title: "Void Structure",
        category: "Architectural Build",
        description: "An architectural marvel exploring void spaces and geometric shapes. Work in progress.",
        features: ["Geometric Modeling", "Void Spaces", "Structural Design"],
        image: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=1600"
    }
};
*/

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initAnimations();
    initProjectCards();
});

// --- 1. SMOOTH SCROLL (LENIS) ---
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// --- 2. ANIMATIONS (GSAP) - Links Section Animation Removed ---
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach(t => t.kill());

    const heroTitle = document.querySelector(".hero-title");
    if(heroTitle) {
        gsap.from(".hero-badge", { y: 20, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.from(".hero-title", { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
        gsap.from(".hero-subtitle", { y: 30, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
        gsap.from(".hero-cta", { y: 30, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
    }

    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.1
        });
    });

    gsap.utils.toArray('.stat-number').forEach((stat) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 80%",
            },
            opacity: 0,
            y: 20,
            duration: 1
        });
    });
    
    gsap.from(".reviews-section", {
        scrollTrigger: {
            trigger: ".reviews-section",
            start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 1
    });

    // Links Section - NO SCROLL ANIMATION (cards appear immediately)
    // Only hover animations are active via CSS
}

// --- 3. DYNAMIC ROUTING SIMULATION ---
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = card.getAttribute('data-project-id') || '1';
            navigateTo('project', projectId);
        });
    });
}

function navigateTo(view, projectId = null) {
    const homeView = document.getElementById('home-view');
    const projectView = document.getElementById('project-view');
    
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (view === 'home') {
        projectView.classList.remove('active');
        setTimeout(() => {
            homeView.classList.add('active');
            ScrollTrigger.refresh();
            initAnimations();
        }, 100);
    } else if (view === 'project' && projectId) {
        const data = projectsData[projectId];
        
        if(!data) return;

        const pTitle = document.getElementById('p-title');
        const pCategory = document.getElementById('p-category');
        const pDesc = document.getElementById('p-desc');
        const pImage = document.getElementById('p-image');
        const pFeatures = document.getElementById('p-features');

        if(pTitle) pTitle.innerText = data.title;
        if(pCategory) pCategory.innerText = data.category;
        if(pDesc) pDesc.innerText = data.description;
        if(pImage) pImage.src = data.image;
        
        if(pFeatures) {
            pFeatures.innerHTML = '';
            data.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerText = feature;
                pFeatures.appendChild(li);
            });
        }

        homeView.classList.remove('active');
        
        setTimeout(() => {
            projectView.classList.add('active');
            
            gsap.from("#project-view .project-hero-content", {
                y: 50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2
            });
            gsap.from("#project-view .project-body", {
                y: 50, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out"
            });
            
            ScrollTrigger.refresh();
        }, 100);
    }
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyDiscord() {
    const user = "enderman_cool";
    navigator.clipboard.writeText(user).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.background = "#22C55E";
        btn.style.color = "white";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.color = "";
        }, 2000);
    });
}
