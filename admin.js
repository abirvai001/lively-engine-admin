/**
 * Lively Engine - Next-Gen Studio & Supabase Realtime Control Center
 * Built by StrawHats Studios
 */

// Global State
const state = {
    // GitHub Cloud Backend (Primary)
    githubRepo: localStorage.getItem('lively_gh_repo') || 'abirvai001/lively-engine-admin',
    githubBranch: localStorage.getItem('lively_gh_branch') || 'main',
    githubPath: localStorage.getItem('lively_gh_path') || 'catalog.json',
    githubToken: localStorage.getItem('lively_gh_token') || '',
    customEffects: JSON.parse(localStorage.getItem('lively_custom_effects') || '[]'),

    // Supabase (Legacy fallback)
    supabaseUrl: localStorage.getItem('lively_sb_url') || '',
    supabaseKey: localStorage.getItem('lively_sb_key') || '',
    currentMode: 'CUSTOM_PHOTO_MOTION', // CUSTOM_PHOTO_MOTION, STATIC_IMAGE, VIDEO_LOOP
    currentEffect: 'SPRING_SAKURA',
    currentOverlay: 'clean', // clean, lockscreen, homescreen, infocard
    autoOrbit: false,
    orbitTime: 0,
    mediaDataUrl: '',
    mediaType: 'image', // 'image' or 'video'
    
    // Physics Parameters
    speedMultiplier: 0.9,
    particleDensity: 1.1,
    parallaxSensitivity: 1.2,
    glowIntensity: 1.1,
    primaryColor: '#00F2FE',
    secondaryColor: '#9D00FF',
    accentColor: '#FFFFFF',

    // Gyroscope & Mouse Tracking
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    smoothPitch: 0,
    smoothRoll: 0,
    
    // Data collections
    categories: [],
    wallpapers: [],
    banners: [],
    appUpdate: {
        latest_version_code: 1,
        latest_version_name: '1.0.0',
        min_required_version_code: 1,
        force_update: false,
        title: 'Lively Engine v1.0.0',
        changelog: '• GitHub Cloud Realtime Backend with zero server costs\n• Dynamic Particle & Effect Code Studio\n• Old Android Popular Wallpapers (Samsung S3/S4, Sony Xperia Z/Arc, Nexus Phase Beam, HTC Sense)\n• 60 FPS 3D Gyro Physics Engine',
        download_url: 'https://github.com/abirvai001/lively-engine-admin/releases/latest',
        release_date: '2026-09-07'
    },
    notifications: [],
    devInfo: {
        studio_name: 'StrawHats Studios',
        tagline: 'Crafting Next-Gen 3D Interactive & Physics Wallpapers',
        email: 'strawhats.studios@gmail.com',
        website: 'https://strawhats.studios.dev',
        github: 'https://github.com/abirvai001',
        telegram: 'https://t.me/StrawHatsStudios',
        discord: 'https://discord.gg/strawhats',
        app_version: '1.0.0 (Release)',
        package_id: 'ss.lively.engine',
        announcement: 'Welcome to Lively Engine! Enjoy real-time 3D motion wallpapers created by StrawHats Studios.'
    },

    // Particle Structs
    particles: [],
    splashes: [],
    shockwaves: [],
    nextLightningTime: 0,
    lightningAlpha: 0,
    bgImageObj: null
};

// Default Categories seeded
const DEFAULT_CATEGORIES = [
    { id: 'cat_all', name: 'ALL', display_name: 'All Wallpapers', icon_emoji: '✨', priority: 0, is_active: true },
    { id: 'cat_builtin', name: 'BUILT_IN', display_name: 'Built-in Live', icon_emoji: '⚡', priority: 1, is_active: true },
    { id: 'cat_classics', name: 'CLASSICS', display_name: 'Old Wallpapers', icon_emoji: '📱', priority: 2, is_active: true },
    { id: 'cat_anime', name: 'ANIME', display_name: 'Anime & Manga', icon_emoji: '🎌', priority: 3, is_active: true },
    { id: 'cat_cars', name: 'CARS', display_name: 'Supercars 4K', icon_emoji: '🏎️', priority: 4, is_active: true },
    { id: 'cat_cyberpunk', name: 'CYBERPUNK', display_name: 'Cyberpunk & Neon', icon_emoji: '🌆', priority: 5, is_active: true },
    { id: 'cat_nature', name: 'NATURE', display_name: 'Nature & Landscapes', icon_emoji: '🌿', priority: 6, is_active: true },
    { id: 'cat_space', name: 'SPACE', display_name: 'Deep Space & Cosmos', icon_emoji: '🌌', priority: 7, is_active: true }
];

// Preset Gallery Images
const PRESET_GALLERY = [
    { name: "🌸 Sakura Lake", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1080&q=80", effect: "SPRING_SAKURA", type: "CUSTOM_PHOTO_MOTION" },
    { name: "🌧️ Rain City", url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1080&q=80", effect: "MONSOON_RAIN", type: "CUSTOM_PHOTO_MOTION" },
    { name: "⚡ Stormy Peak", url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1080&q=80", effect: "THUNDER_LIGHTNING", type: "CUSTOM_PHOTO_MOTION" },
    { name: "❄️ Winter Alps", url: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1080&q=80", effect: "WINTER_SNOW", type: "CUSTOM_PHOTO_MOTION" },
    { name: "☀️ Firefly Woods", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&q=80", effect: "SUMMER_FIREFLIES", type: "CUSTOM_PHOTO_MOTION" },
    { name: "🍁 Maple Autumn", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80", effect: "AUTUMN_LEAVES", type: "CUSTOM_PHOTO_MOTION" },
    { name: "🌌 Deep Astral", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&q=80", effect: "COSMIC_STARLIGHT", type: "CUSTOM_PHOTO_MOTION" },
    { name: "🌫️ Mountain Mist", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80", effect: "DENSE_ROLLING_FOG", type: "CUSTOM_PHOTO_MOTION" }
];

// Initial Default Catalog
const DEFAULT_WALLPAPERS = [
    {
        id: "classic_samsung_s3_dandelion",
        title: "Samsung S3 Dandelion Ripple",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Samsung Electronics / Retro Revival",
        description: "The iconic Galaxy S3 dandelion puff with floating parachute seeds and interactive water ripple physics upon touch.",
        tags: ["Samsung", "Galaxy S3", "Dandelion", "Retro", "Water", "Ripples"],
        fps: 60,
        resolution: "4K 60FPS",
        photo_uri_string: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&q=80",
        data: {
            speedMultiplier: 0.85,
            particleDensity: 1.1,
            parallaxSensitivity: 1.25,
            glowIntensity: 1.2,
            particleEffectType: "SAMSUNG_S3_DANDELION",
            primaryColorArgb: 4294967295,
            secondaryColorArgb: 4289979900,
            accentColorArgb: 4286698666
        }
    },
    {
        id: "classic_samsung_s4_balloons",
        title: "Samsung S4 Life Companion",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Samsung Electronics / Retro Revival",
        description: "The unforgettable Galaxy S4 colorful hot-air balloons floating across vivid azure skies with 3D parallax and sun flares.",
        tags: ["Samsung", "Galaxy S4", "Life Companion", "Balloons", "Sky", "Retro"],
        fps: 60,
        resolution: "4K HDR",
        photo_uri_string: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&q=80",
        data: {
            speedMultiplier: 0.75,
            particleDensity: 1.0,
            parallaxSensitivity: 1.35,
            glowIntensity: 1.3,
            particleEffectType: "SAMSUNG_S4_BALLOONS",
            primaryColorArgb: 4294963574,
            secondaryColorArgb: 4294937216,
            accentColorArgb: 4286634239
        }
    },
    {
        id: "classic_sony_xperia_z",
        title: "Sony Xperia Z Cosmic Flow",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Sony Mobile / Retro Revival",
        description: "The legendary Xperia Z flowing chromatic silk waves undulating dynamically with floating cosmic stardust.",
        tags: ["Sony", "Xperia Z", "Silk Flow", "Waves", "Neon", "Retro"],
        fps: 60,
        resolution: "4K 60FPS",
        photo_uri_string: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1080&q=80",
        data: {
            speedMultiplier: 1.0,
            particleDensity: 1.2,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.4,
            particleEffectType: "SONY_XPERIA_Z_FLOW",
            primaryColorArgb: 4292886779,
            secondaryColorArgb: 4278257151,
            accentColorArgb: 4294918273
        }
    },
    {
        id: "classic_sony_arc_midnight",
        title: "Sony Arc Midnight Pulse",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Sony Ericsson / Retro Revival",
        description: "Deep navy ambient cosmic fluid pulse inspired by the classic Sony Ericsson Xperia Arc.",
        tags: ["Sony", "Xperia Arc", "Midnight", "Cyan", "Aura", "Retro"],
        fps: 60,
        resolution: "4K Ultra HD",
        photo_uri_string: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&q=80",
        data: {
            speedMultiplier: 0.95,
            particleDensity: 1.15,
            parallaxSensitivity: 1.15,
            glowIntensity: 1.35,
            particleEffectType: "SONY_ARC_MIDNIGHT",
            primaryColorArgb: 4279828479,
            secondaryColorArgb: 4278227434,
            accentColorArgb: 4292999162
        }
    },
    {
        id: "classic_nexus_phase_beam",
        title: "Nexus 4 Holo Phase Beam",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Google Android / Retro Revival",
        description: "The beloved Android 4.0 Ice Cream Sandwich Holo phase beam with diagonal laser beams and translucent glowing orbs.",
        tags: ["Google", "Nexus", "Android 4.0", "Holo", "Phase Beam", "Retro"],
        fps: 60,
        resolution: "4K 60FPS",
        photo_uri_string: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&q=80",
        data: {
            speedMultiplier: 1.05,
            particleDensity: 1.1,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.3,
            particleEffectType: "NEXUS_PHASE_BEAM",
            primaryColorArgb: 4281578981,
            secondaryColorArgb: 4289357516,
            accentColorArgb: 4294949683
        }
    },
    {
        id: "classic_htc_sense_weather",
        title: "HTC Sense Atmospheric Rays",
        category: "CLASSICS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "HTC Corporation / Retro Revival",
        description: "HTC Sense weather live wallpaper with volumetric golden sunbeams, rolling weather mountain clouds, and gentle raindrops.",
        tags: ["HTC", "HTC Sense", "Weather", "Sunrays", "Clouds", "Retro"],
        fps: 60,
        resolution: "4K HDR",
        photo_uri_string: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80",
        data: {
            speedMultiplier: 1.1,
            particleDensity: 1.2,
            parallaxSensitivity: 1.3,
            glowIntensity: 1.25,
            particleEffectType: "HTC_SENSE_CLOUDS",
            primaryColorArgb: 4294956367,
            secondaryColorArgb: 4286634239,
            accentColorArgb: 4293717997
        }
    },
    {
        id: "season_sakura_01",
        title: "Spring Sakura Blossom",
        category: "SEASONS",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Nature Studio",
        description: "Delicate 5-lobed pink sakura cherry blossom petals fluttering gracefully with 3D axial tumbling across gentle spring breezes.",
        tags: ["Spring", "Sakura", "Blossom", "Nature", "Relaxing"],
        fps: 60,
        resolution: "4K HDR",
        photo_uri_string: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1080&q=80",
        data: {
            speedMultiplier: 0.9,
            particleDensity: 1.1,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.1,
            particleEffectType: "SPRING_SAKURA",
            primaryColorArgb: 4294686661,
            secondaryColorArgb: 4294937249,
            accentColorArgb: 4294967295
        }
    },
    {
        id: "weather_monsoon_01",
        title: "Real Monsoon Rain & Ripples",
        category: "WEATHER",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Atmosphere Studio",
        description: "Authentic translucent falling raindrops with wind drift and expanding water splash ripples on the glass surface.",
        tags: ["Rain", "Monsoon", "Water", "Ripples", "Storm"],
        fps: 60,
        resolution: "4K Ultra HD",
        photo_uri_string: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1080&q=80",
        data: {
            speedMultiplier: 1.05,
            particleDensity: 1.25,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.2,
            particleEffectType: "MONSOON_RAIN",
            primaryColorArgb: 4291881215,
            secondaryColorArgb: 4286634239,
            accentColorArgb: 4278235391
        }
    },
    {
        id: "weather_lightning_01",
        title: "Electric Lightning Tempest",
        category: "WEATHER",
        type: "CUSTOM_PHOTO_MOTION",
        author: "Atmosphere Studio",
        description: "Photorealistic branching fractal lightning bolts with sky flashes and heavy atmospheric thunderstorm rain.",
        tags: ["Lightning", "Thunder", "Storm", "Electric", "Flash"],
        fps: 60,
        resolution: "4K HDR",
        photo_uri_string: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1080&q=80",
        data: {
            speedMultiplier: 1.15,
            particleDensity: 1.3,
            parallaxSensitivity: 1.3,
            glowIntensity: 1.4,
            particleEffectType: "THUNDER_LIGHTNING",
            primaryColorArgb: 4286629887,
            secondaryColorArgb: 4294967295,
            accentColorArgb: 4286629887
        }
    },
    {
        id: "static_matterhorn_01",
        title: "Matterhorn Twilight Sunset",
        category: "CUSTOM",
        type: "STATIC_IMAGE",
        author: "Alps Studio",
        description: "Ultra-sharp 8K static mountain landscape with deep ambient glow and subtle 3D gyroscope depth parallax.",
        tags: ["Static", "8K", "Mountains", "Sunset", "Landscape"],
        fps: 60,
        resolution: "8K Ultra",
        photo_uri_string: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80",
        data: {
            speedMultiplier: 1.0,
            particleDensity: 0.0,
            parallaxSensitivity: 1.0,
            glowIntensity: 1.0,
            particleEffectType: "NONE"
        }
    }
];

const DEFAULT_BANNERS = [
    {
        id: "banner_monsoon_01",
        title: "🌧️ Real Monsoon Rain 3D",
        subtitle: "Authentic water physics with real surface ripples & mist",
        badge: "HOT 🔥",
        wallpaper_id: "weather_monsoon_01",
        gradient_colors: [4278241279, 4278223615],
        priority: 1,
        is_active: true
    },
    {
        id: "banner_sakura_02",
        title: "🌸 Spring Sakura Blossom",
        subtitle: "4K HDR Falling Petals with 3D Axial Wind Physics",
        badge: "POPULAR",
        wallpaper_id: "season_sakura_01",
        gradient_colors: [4294931852, 4294934195],
        priority: 2,
        is_active: true
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "notif_welcome_01",
        title: "Welcome to Lively Engine! 🚀",
        body: "Enjoy high-performance 3D live wallpapers powered by StrawHats Studios. Design and broadcast your own creations with the Admin Panel!",
        category: "ANNOUNCEMENT",
        action_url: "https://strawhats.studios.dev",
        wallpaper_id: "weather_monsoon_01",
        timestamp: Date.now() - 3600000
    }
];

// ==============================================================================
// INITIALIZATION
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigationTabs();
    initPhoneSimulation();
    initMediaUploaders();
    initForms();
    initPresetsGallery();
    loadInitialData();
    initEffectStudio();
    initGitHubBackendManager();
    testSupabaseConnection(false);
    startLiveClock();
});

// Live Phone Clock
function startLiveClock() {
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${mins}`;
        
        const clockEl = document.getElementById('phone-clock');
        const lockClockEl = document.getElementById('lock-time-display');
        const lockDateEl = document.getElementById('lock-date-display');
        
        if (clockEl) clockEl.innerText = timeStr;
        if (lockClockEl) lockClockEl.innerText = timeStr;
        if (lockDateEl) {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            lockDateEl.innerText = now.toLocaleDateString('en-US', options);
        }
    }
    update();
    setInterval(update, 1000);
}

// Navigation Tabs
function initNavigationTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            switchTab(targetId);
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// ==============================================================================
// PHONE SIMULATOR, VIEWPORT & 3D GYRO PHYSICS
// ==============================================================================
function initPhoneSimulation() {
    const phone = document.getElementById('phone-mockup');
    const canvas = document.getElementById('motion-canvas');
    if (!canvas || !phone) return;

    const ctx = canvas.getContext('2d');
    initParticles(canvas.width, canvas.height);

    // Mouse & Touch 3D Tilt Tracking
    phone.addEventListener('mousemove', (e) => {
        if (state.autoOrbit) return;
        const rect = phone.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        state.targetMouseX = nx;
        state.targetMouseY = ny;

        // Apply realistic 3D perspective rotation to phone frame
        const rotY = nx * 22; // -11 to +11 deg
        const rotX = -ny * 22;
        phone.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    phone.addEventListener('mouseleave', () => {
        if (state.autoOrbit) return;
        state.targetMouseX = 0;
        state.targetMouseY = 0;
        phone.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // Touch shockwaves / interactive ripples
    phone.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        state.shockwaves.push({ x, y, radius: 4, alpha: 240 });
    });

    // Viewport Overlay Switchers
    document.querySelectorAll('.view-toggle-btn[data-overlay]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle-btn[data-overlay]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const overlay = btn.getAttribute('data-overlay');
            state.currentOverlay = overlay;

            const lock = document.getElementById('overlay-lockscreen');
            const home = document.getElementById('overlay-homescreen');
            const info = document.getElementById('overlay-infocard');

            if (lock) lock.style.display = overlay === 'lockscreen' ? 'flex' : 'none';
            if (home) home.style.display = overlay === 'homescreen' ? 'flex' : 'none';
            if (info) info.style.display = overlay === 'infocard' || overlay === 'clean' ? 'block' : 'none';
        });
    });

    // Auto-Orbit Toggle
    const orbitBtn = document.getElementById('btn-toggle-orbit');
    if (orbitBtn) {
        orbitBtn.addEventListener('click', () => {
            state.autoOrbit = !state.autoOrbit;
            orbitBtn.classList.toggle('active', state.autoOrbit);
            if (!state.autoOrbit) {
                phone.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            }
        });
    }

    // Start 60 FPS Canvas Render Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTime = performance.now();

    function renderLoop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.033);
        lastTime = now;

        // Auto-Orbit breathing tilt
        if (state.autoOrbit) {
            state.orbitTime += dt * 1.5;
            state.targetMouseX = Math.sin(state.orbitTime) * 0.45;
            state.targetMouseY = Math.cos(state.orbitTime * 0.8) * 0.35;
            const rotY = state.targetMouseX * 18;
            const rotX = -state.targetMouseY * 18;
            phone.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        }

        // Smooth Gyro Filter
        state.smoothRoll += (state.targetMouseX - state.smoothRoll) * (dt * 8.0);
        state.smoothPitch += (state.targetMouseY - state.smoothPitch) * (dt * 8.0);

        // Render Active Mode
        if (state.currentMode === 'CUSTOM_PHOTO_MOTION') {
            drawPhotoMotionEngine(ctx, canvas.width, canvas.height, dt);
        } else if (state.currentMode === 'STATIC_IMAGE') {
            drawStaticArtwork(ctx, canvas.width, canvas.height, dt);
        }

        // Calculate FPS
        frameCount++;
        if (now - fpsTime >= 1000) {
            const fpsEl = document.getElementById('canvas-fps');
            if (fpsEl) fpsEl.innerText = `${frameCount} FPS`;
            frameCount = 0;
            fpsTime = now;
        }

        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

// Particle Initialization
function initParticles(w, h) {
    state.particles = [];
    state.splashes = [];
    state.shockwaves = [];

    const density = state.particleDensity;
    let count = 60;

    switch (state.currentEffect) {
        case 'MONSOON_RAIN':
        case 'THUNDER_LIGHTNING': count = Math.floor(130 * density); break;
        case 'WINTER_SNOW': count = Math.floor(100 * density); break;
        case 'SPRING_SAKURA':
        case 'AUTUMN_LEAVES': count = Math.floor(45 * density); break;
        case 'SUMMER_FIREFLIES': count = Math.floor(50 * density); break;
        case 'DENSE_ROLLING_FOG': count = Math.floor(35 * density); break;
        case 'MYSTIC_BILLOWING_SMOKE': count = Math.floor(40 * density); break;
        case 'COSMIC_STARLIGHT': count = Math.floor(90 * density); break;
        case 'COSMIC_NEBULA': count = Math.floor(75 * density); break;
        case 'SAMSUNG_S3_DANDELION': count = Math.floor(36 * density); break;
        case 'SAMSUNG_S4_BALLOONS': count = Math.floor(18 * density); break;
        case 'SONY_XPERIA_Z_FLOW': count = Math.floor(45 * density); break;
        case 'SONY_ARC_MIDNIGHT': count = Math.floor(30 * density); break;
        case 'NEXUS_PHASE_BEAM': count = Math.floor(40 * density); break;
        case 'HTC_SENSE_CLOUDS': count = Math.floor(25 * density); break;
        default: {
            const dynFx = state.customEffects?.find(e => e.id === state.currentEffect);
            count = Math.floor((dynFx?.particleCount || 60) * density);
            break;
        }
    }

    const colors = [state.primaryColor, state.secondaryColor, state.accentColor, '#FFFFFF'];

    for (let i = 0; i < count; i++) {
        state.particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 5 + 3,
            speedX: (Math.random() - 0.5) * 20,
            speedY: Math.random() * 30 + 15,
            depth: Math.random() * 0.9 + 0.1,
            alpha: Math.random() * 0.7 + 0.3,
            phase: Math.random() * Math.PI * 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 60,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

// ==============================================================================
// 3D PHOTO MOTION CANVAS RENDERING (100% Android Parity)
// ==============================================================================
function drawPhotoMotionEngine(ctx, w, h, dt) {
    ctx.clearRect(0, 0, w, h);

    const panX = -state.smoothRoll * 80 * state.parallaxSensitivity;
    const panY = -state.smoothPitch * 65 * state.parallaxSensitivity;

    // 1. Draw 3D Tilt Background Image
    if (state.bgImageObj && state.bgImageObj.complete && state.bgImageObj.naturalWidth > 0) {
        ctx.save();
        const img = state.bgImageObj;
        const scale = Math.max((w * 1.25) / img.width, (h * 1.25) / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (w - dw) / 2 + panX;
        const dy = (h - dh) / 2 + panY;

        ctx.drawImage(img, dx, dy, dw, dh);

        // Specular ambient vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, h * 0.75);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    } else {
        // Fallback Dark Gradient
        const grad = ctx.createLinearGradient(panX * 0.5, panY * 0.5, w + panX * 0.5, h + panY * 0.5);
        grad.addColorStop(0, '#060A16');
        grad.addColorStop(0.5, hexToRgba(state.secondaryColor, 0.4));
        grad.addColorStop(1, '#05020B');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    // 2. Particle Effect Layer
    switch (state.currentEffect) {
        case 'SPRING_SAKURA': drawSakura(ctx, w, h, dt, panX, panY); break;
        case 'MONSOON_RAIN': drawMonsoonRain(ctx, w, h, dt, panX, panY); break;
        case 'THUNDER_LIGHTNING': drawThunderStorm(ctx, w, h, dt, panX, panY); break;
        case 'WINTER_SNOW': drawWinterSnow(ctx, w, h, dt, panX, panY); break;
        case 'SUMMER_FIREFLIES': drawFireflies(ctx, w, h, dt, panX, panY); break;
        case 'AUTUMN_LEAVES': drawAutumnLeaves(ctx, w, h, dt, panX, panY); break;
        case 'DENSE_ROLLING_FOG': drawRollingFog(ctx, w, h, dt, panX, panY); break;
        case 'MYSTIC_BILLOWING_SMOKE': drawMysticSmoke(ctx, w, h, dt, panX, panY); break;
        case 'COSMIC_STARLIGHT': drawStarlight(ctx, w, h, dt, panX, panY); break;
        case 'COSMIC_NEBULA': drawCosmicNebula(ctx, w, h, dt, panX, panY); break;
        case 'COSMIC_CRYSTALS': drawCrystals(ctx, w, h, dt, panX, panY); break;
        case 'OCEAN_MIST': drawOceanMist(ctx, w, h, dt, panX, panY); break;
        // Retro Android Legends
        case 'SAMSUNG_S3_DANDELION': drawSamsungDandelion(ctx, w, h, dt, panX, panY); break;
        case 'SAMSUNG_S4_BALLOONS': drawSamsungBalloons(ctx, w, h, dt, panX, panY); break;
        case 'SONY_XPERIA_Z_FLOW': drawSonyXperiaZ(ctx, w, h, dt, panX, panY); break;
        case 'SONY_ARC_MIDNIGHT': drawSonyArcMidnight(ctx, w, h, dt, panX, panY); break;
        case 'NEXUS_PHASE_BEAM': drawNexusPhaseBeam(ctx, w, h, dt, panX, panY); break;
        case 'HTC_SENSE_CLOUDS': drawHtcSenseClouds(ctx, w, h, dt, panX, panY); break;
        default: {
            const customFx = state.customEffects?.find(e => e.id === state.currentEffect);
            if (customFx) {
                drawDynamicCustomEffect(ctx, w, h, dt, panX, panY, customFx);
            } else {
                drawSakura(ctx, w, h, dt, panX, panY);
            }
            break;
        }
    }

    // 3. Interactive Touch Shockwaves
    for (let i = state.shockwaves.length - 1; i >= 0; i--) {
        const sw = state.shockwaves[i];
        sw.radius += dt * 320;
        sw.alpha -= dt * 260;

        if (sw.alpha <= 0) {
            state.shockwaves.splice(i, 1);
        } else {
            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(state.primaryColor, sw.alpha / 255);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        }
    }
}

// Static Image Mode Renderer (Clean photo without particles)
function drawStaticArtwork(ctx, w, h, dt) {
    ctx.clearRect(0, 0, w, h);
    const panX = -state.smoothRoll * 40 * state.parallaxSensitivity;
    const panY = -state.smoothPitch * 30 * state.parallaxSensitivity;

    if (state.bgImageObj && state.bgImageObj.complete && state.bgImageObj.naturalWidth > 0) {
        ctx.save();
        const img = state.bgImageObj;
        const scale = Math.max((w * 1.15) / img.width, (h * 1.15) / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (w - dw) / 2 + panX;
        const dy = (h - dh) / 2 + panY;

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
    } else {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#10152B');
        grad.addColorStop(1, '#05070F');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }
}

// --- PARTICLE EFFECT 1: SAKURA PETALS ---
function drawSakura(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;
    for (const p of state.particles) {
        p.y += dt * (45 + p.depth * 35) * spd;
        p.x += dt * 30 + Math.sin(p.phase += dt * 1.6) * 1.8;
        p.rotation += dt * p.rotSpeed;

        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * (w + 80) - 40; }
        if (p.x > w + 40) p.x = -40;

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(1.0, Math.cos(p.phase));

        const pw = 8 + p.depth * 6;
        const ph = 14 + p.depth * 8;

        ctx.beginPath();
        ctx.moveTo(0, -ph);
        ctx.bezierCurveTo(pw, -ph * 0.7, pw * 0.8, ph * 0.6, 0, ph);
        ctx.bezierCurveTo(-pw * 0.8, ph * 0.6, -pw, -ph * 0.7, 0, -ph);

        ctx.fillStyle = hexToRgba(p.depth > 0.5 ? '#FFB7C5' : '#FF8DA1', p.alpha * state.glowIntensity);
        ctx.fill();
        ctx.restore();
    }
}

// --- PARTICLE EFFECT 2: MONSOON RAIN & SURFACE SPLASHES ---
function drawMonsoonRain(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;
    const windAngle = 0.22;

    ctx.save();
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.75)';
    ctx.lineWidth = 1.8;

    for (const p of state.particles) {
        const fall = (750 + p.depth * 500) * spd;
        p.y += dt * fall;
        p.x += dt * fall * windAngle;

        if (p.y > h - 10) {
            if (state.splashes.length < 30 && Math.random() < 0.4) {
                state.splashes.push({ x: p.x, y: h - Math.random() * 30, radius: 2, alpha: 180, maxRadius: 14 + p.depth * 16 });
            }
            p.y = -40 - Math.random() * 80;
            p.x = Math.random() * (w + 160) - 80;
        }

        const px = p.x + panX * (p.depth * 1.5);
        const py = p.y + panY * (p.depth * 1.5);
        const dropLen = 26 + p.depth * 32;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + dropLen * windAngle, py + dropLen);
        ctx.stroke();
    }
    ctx.restore();

    // Splashes
    for (let i = state.splashes.length - 1; i >= 0; i--) {
        const s = state.splashes[i];
        s.radius += dt * 36;
        s.alpha -= dt * 280;

        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
            state.splashes.splice(i, 1);
        } else {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180, 230, 255, ${s.alpha / 255})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
            ctx.restore();
        }
    }
}

// --- PARTICLE EFFECT 3: THUNDER & LIGHTNING ---
function drawThunderStorm(ctx, w, h, dt, panX, panY) {
    drawMonsoonRain(ctx, w, h, dt, panX, panY);

    state.nextLightningTime -= dt;
    if (state.nextLightningTime <= 0) {
        state.lightningAlpha = 1.0;
        state.nextLightningTime = Math.random() * 3.5 + 2.0;
    }

    if (state.lightningAlpha > 0.05) {
        state.lightningAlpha -= dt * 3.5;

        // Sky flash illumination
        ctx.fillStyle = `rgba(255, 255, 255, ${state.lightningAlpha * 0.45})`;
        ctx.fillRect(0, 0, w, h);

        // Branching fractal bolt
        ctx.save();
        ctx.beginPath();
        let lx = w * (0.3 + Math.random() * 0.4);
        let ly = 0;
        ctx.moveTo(lx, ly);

        while (ly < h * 0.85) {
            lx += (Math.random() - 0.5) * 60;
            ly += Math.random() * 80 + 35;
            ctx.lineTo(lx, ly);
        }

        ctx.strokeStyle = `rgba(128, 216, 255, ${state.lightningAlpha * 0.9})`;
        ctx.lineWidth = 7;
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${state.lightningAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
    }
}

// --- PARTICLE EFFECT 4: WINTER SNOW & 6-POINTED FLAKES ---
function drawWinterSnow(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;
    for (const p of state.particles) {
        p.y += dt * (38 + p.depth * 38) * spd;
        p.x += Math.sin(p.phase += dt * 1.2) * 1.5 + dt * 10;
        p.rotation += dt * p.rotSpeed * 0.5;

        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * (w + 40) - 20; }

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);

        if (p.depth > 0.6) {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.strokeStyle = hexToRgba('#FFFFFF', p.alpha * state.glowIntensity);
            ctx.lineWidth = 1.4;

            const arm = p.size * 1.8;
            for (let a = 0; a < 6; a++) {
                ctx.rotate(Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, arm);
                ctx.moveTo(0, arm * 0.6);
                ctx.lineTo(-arm * 0.3, arm * 0.8);
                ctx.moveTo(0, arm * 0.6);
                ctx.lineTo(arm * 0.3, arm * 0.8);
                ctx.stroke();
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(px, py, p.size * p.depth * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba('#FFFFFF', p.alpha * 0.7 * state.glowIntensity);
            ctx.fill();
        }
    }
}

// --- PARTICLE EFFECT 5: SUMMER FIREFLIES ---
function drawFireflies(ctx, w, h, dt, panX, panY) {
    for (const p of state.particles) {
        p.phase += dt * (2.0 + p.depth);
        p.x += Math.cos(p.phase * 0.7) * 1.4;
        p.y += Math.sin(p.phase * 0.8) * 1.2 - dt * 8;

        if (p.y < -20) p.y = h + 20;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const px = p.x + panX * (p.depth * 2.2);
        const py = p.y + panY * (p.depth * 2.2);

        const pulse = Math.sin(p.phase * 2.5) * 0.5 + 0.5;
        const radius = (12 + p.depth * 18) * pulse;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, radius);
        glow.addColorStop(0, hexToRgba('#FFF176', 0.85 * pulse * state.glowIntensity));
        glow.addColorStop(0.4, hexToRgba(state.primaryColor, 0.4 * pulse * state.glowIntensity));
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 2.2 * p.depth, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- PARTICLE EFFECT 6: AUTUMN LEAVES ---
function drawAutumnLeaves(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;
    for (const p of state.particles) {
        p.y += dt * (40 + p.depth * 30) * spd;
        p.x += dt * 32 + Math.sin(p.phase += dt * 1.8) * 2.8;
        p.rotation += dt * p.rotSpeed * 0.8;

        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * (w + 80) - 40; }

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.fillStyle = hexToRgba(p.depth > 0.5 ? '#E65100' : '#FF8F00', p.alpha * state.glowIntensity);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(8, -4);
        ctx.lineTo(6, 4);
        ctx.lineTo(0, 10);
        ctx.lineTo(-6, 4);
        ctx.lineTo(-8, -4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// --- PARTICLE EFFECT 7: DENSE ROLLING FOG ---
function drawRollingFog(ctx, w, h, dt, panX, panY) {
    for (const p of state.particles) {
        p.x += dt * (18 + p.depth * 25) * state.speedMultiplier;
        p.y += Math.sin(p.phase += dt * 0.5) * 0.8;

        if (p.x > w + 200) { p.x = -200; p.y = Math.random() * h; }

        const px = p.x + panX * (p.depth * 1.6);
        const py = p.y + panY * (p.depth * 1.6);
        const radius = 120 + p.depth * 180;

        const fog = ctx.createRadialGradient(px, py, 0, px, py, radius);
        fog.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.25 * state.glowIntensity})`);
        fog.addColorStop(0.5, `rgba(207, 216, 220, ${p.alpha * 0.12 * state.glowIntensity})`);
        fog.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = fog;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- PARTICLE EFFECT 8: MYSTIC SMOKE ---
function drawMysticSmoke(ctx, w, h, dt, panX, panY) {
    for (const p of state.particles) {
        p.y -= dt * (45 + p.depth * 40) * state.speedMultiplier;
        p.x += Math.sin(p.phase += dt * 1.2) * 1.8;

        if (p.y < -80) { p.y = h + 40; p.x = Math.random() * w; }

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);
        const progress = Math.max(0.2, 1 - (p.y / h));
        const radius = (40 + p.depth * 60) * progress;

        const smoke = ctx.createRadialGradient(px, py, 0, px, py, radius);
        smoke.addColorStop(0, hexToRgba(state.primaryColor, p.alpha * 0.3 * state.glowIntensity));
        smoke.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = smoke;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- PARTICLE EFFECT 9: COSMIC STARLIGHT ---
function drawStarlight(ctx, w, h, dt, panX, panY) {
    for (const p of state.particles) {
        p.phase += dt * 2.5;
        const px = p.x + panX * (p.depth * 2.2);
        const py = p.y + panY * (p.depth * 2.2);

        const twinkle = Math.sin(p.phase) * 0.5 + 0.5;
        const alpha = p.alpha * twinkle * state.glowIntensity;

        ctx.fillStyle = hexToRgba('#FFFFFF', alpha);
        ctx.beginPath();
        ctx.arc(px, py, p.size * p.depth * 1.2, 0, Math.PI * 2);
        ctx.fill();

        if (p.depth > 0.75 && twinkle > 0.7) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 1.2;
            const arm = p.size * 3.5;
            ctx.beginPath();
            ctx.moveTo(px - arm, py); ctx.lineTo(px + arm, py);
            ctx.moveTo(px, py - arm); ctx.lineTo(px, py + arm);
            ctx.stroke();
        }
    }
}

// --- PARTICLE EFFECT 10: COSMIC NEBULA ---
function drawCosmicNebula(ctx, w, h, dt, panX, panY) {
    const cx = w / 2 + panX * 1.4;
    const cy = h / 2 + panY * 1.4;
    const radius = w * 0.7;

    const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    nebula.addColorStop(0, hexToRgba(state.primaryColor, 0.45 * state.glowIntensity));
    nebula.addColorStop(0.5, hexToRgba(state.secondaryColor, 0.25 * state.glowIntensity));
    nebula.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = nebula;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    drawStarlight(ctx, w, h, dt, panX, panY);
}

// --- PARTICLE EFFECT 11: 3D CRYSTALS ---
function drawCrystals(ctx, w, h, dt, panX, panY) {
    for (let i = 0; i < 8; i++) {
        const depth = 0.4 + i * 0.12;
        const cx = (w * (0.15 + (i * 0.18) % 0.8)) + panX * depth * 2.2;
        const cy = (h * (0.2 + (i * 0.17) % 0.65)) + panY * depth * 2.2;
        const size = 26 * depth;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = hexToRgba(i % 2 === 0 ? state.primaryColor : state.secondaryColor, 0.85 * state.glowIntensity);
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.rect(-size, -size, size * 2, size * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// --- PARTICLE EFFECT 12: OCEAN MIST ---
function drawOceanMist(ctx, w, h, dt, panX, panY) {
    for (const p of state.particles) {
        p.x += dt * 25 * state.speedMultiplier;
        p.y += Math.sin(p.phase += dt * 1.5) * 2.0;

        if (p.x > w + 40) p.x = -40;

        const px = p.x + panX * (p.depth * 1.8);
        const py = p.y + panY * (p.depth * 1.8);

        ctx.fillStyle = hexToRgba('#00F2FE', p.alpha * 0.5 * state.glowIntensity);
        ctx.beginPath();
        ctx.arc(px, py, p.size * p.depth * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- RETRO ANDROID LEGEND 1: SAMSUNG GALAXY S3 DANDELION & RIPPLES ---
function drawSamsungDandelion(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;

    // 1. Water touch ripples & ambient puddles
    for (let i = state.shockwaves.length - 1; i >= 0; i--) {
        const sw = state.shockwaves[i];
        sw.radius += dt * 140 * spd;
        sw.alpha -= dt * 90;

        if (sw.alpha <= 0 || sw.radius > 220) {
            state.shockwaves.splice(i, 1);
        } else {
            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180, 230, 255, ${(sw.alpha / 255) * 0.7})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, Math.max(0, sw.radius - 16), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(sw.alpha / 255) * 0.4})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }
    }

    // Auto-generate gentle ripples periodically
    if (!state.lastAutoRipple || performance.now() - state.lastAutoRipple > 3200) {
        state.lastAutoRipple = performance.now();
        state.shockwaves.push({
            x: w * (0.25 + Math.random() * 0.5),
            y: h * (0.45 + Math.random() * 0.4),
            radius: 5,
            alpha: 160
        });
    }

    // 2. Floating Dandelion Seed Tufts with Parachute Geometry
    for (const p of state.particles) {
        p.y -= dt * (26 + p.depth * 22) * spd;
        p.x += Math.sin(p.phase += dt * 1.3) * 1.6 + dt * 8.0;
        p.rotation += dt * (p.rotSpeed || 15) * 0.4;

        if (p.y < -40) { p.y = h + 40; p.x = Math.random() * (w + 60) - 30; }
        if (p.x > w + 40) p.x = -40;

        const px = p.x + panX * (p.depth * 2.2);
        const py = p.y + panY * (p.depth * 2.2);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);

        const stemLen = 14 + p.depth * 10;
        const umbrellaRad = 10 + p.depth * 7;
        const filamentAlpha = p.alpha * state.glowIntensity * 0.85;

        // Stem
        ctx.beginPath();
        ctx.moveTo(0, stemLen);
        ctx.quadraticCurveTo(2, stemLen * 0.5, 0, 0);
        ctx.strokeStyle = `rgba(235, 245, 255, ${filamentAlpha * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Seed grain at bottom
        ctx.beginPath();
        ctx.ellipse(0, stemLen, 1.8, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 160, 130, ${filamentAlpha})`;
        ctx.fill();

        // Parachute filament rays radiating from umbrella top
        ctx.strokeStyle = `rgba(255, 255, 255, ${filamentAlpha})`;
        ctx.lineWidth = 0.9;
        const rays = 8;
        for (let r = 0; r < rays; r++) {
            const angle = -Math.PI * 0.85 + (r / (rays - 1)) * Math.PI * 0.7;
            const rx = Math.cos(angle) * umbrellaRad;
            const ry = Math.sin(angle) * umbrellaRad * 0.6;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(rx, ry);
            ctx.stroke();

            // Tiny glowing seed fluffs at filament tips
            ctx.beginPath();
            ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${filamentAlpha * 0.9})`;
            ctx.fill();
        }

        ctx.restore();
    }
}

// --- RETRO ANDROID LEGEND 2: SAMSUNG GALAXY S4 LIFE COMPANION BALLOONS ---
function drawSamsungBalloons(ctx, w, h, dt, panX, panY) {
    const spd = state.speedMultiplier;

    // 1. Sun Lens Flare & Warm Radial Sky Sheen in Top-Right
    const flareX = w * 0.82 + panX * 0.5;
    const flareY = h * 0.18 + panY * 0.5;
    const flareGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, w * 0.65);
    flareGrad.addColorStop(0, 'rgba(255, 250, 220, 0.45)');
    flareGrad.addColorStop(0.3, 'rgba(255, 215, 120, 0.2)');
    flareGrad.addColorStop(0.7, 'rgba(255, 180, 80, 0.05)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Parallax Floating Hot-Air Balloons
    const balloonColors = [
        { primary: '#FF2A6D', secondary: '#FFD166', accent: '#05D5FA' },
        { primary: '#05D5FA', secondary: '#00F2FE', accent: '#FFFFFF' },
        { primary: '#FF9F1C', secondary: '#FFE494', accent: '#E71D36' },
        { primary: '#9D00FF', secondary: '#00F2FE', accent: '#FFD166' }
    ];

    for (let i = 0; i < state.particles.length; i++) {
        const p = state.particles[i];
        p.y -= dt * (14 + p.depth * 16) * spd;
        p.x += Math.sin(p.phase += dt * 0.8) * 1.1;

        if (p.y < -80) { p.y = h + 80; p.x = Math.random() * (w + 40) - 20; }

        const px = p.x + panX * (p.depth * 1.6);
        const py = p.y + panY * (p.depth * 1.6);

        const bScale = 0.6 + p.depth * 0.8;
        const bWidth = 24 * bScale;
        const bHeight = 32 * bScale;
        const col = balloonColors[i % balloonColors.length];

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(Math.sin(p.phase) * 0.06);

        // Teardrop Balloon Envelope
        ctx.beginPath();
        ctx.moveTo(0, -bHeight);
        ctx.bezierCurveTo(bWidth * 1.2, -bHeight * 0.9, bWidth * 1.1, bHeight * 0.3, bWidth * 0.35, bHeight * 0.85);
        ctx.lineTo(-bWidth * 0.35, bHeight * 0.85);
        ctx.bezierCurveTo(-bWidth * 1.1, bHeight * 0.3, -bWidth * 1.2, -bHeight * 0.9, 0, -bHeight);

        const grad = ctx.createLinearGradient(-bWidth, 0, bWidth, 0);
        grad.addColorStop(0, col.primary);
        grad.addColorStop(0.5, col.secondary);
        grad.addColorStop(1, col.accent);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Suspension Ropes & Basket
        const basketY = bHeight * 1.15;
        ctx.beginPath();
        ctx.moveTo(-bWidth * 0.25, bHeight * 0.85); ctx.lineTo(-bWidth * 0.15, basketY);
        ctx.moveTo(bWidth * 0.25, bHeight * 0.85); ctx.lineTo(bWidth * 0.15, basketY);
        ctx.strokeStyle = 'rgba(60, 40, 20, 0.7)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Basket
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(-bWidth * 0.2, basketY, bWidth * 0.4, bHeight * 0.2);

        ctx.restore();
    }
}

// --- RETRO ANDROID LEGEND 3: SONY XPERIA Z FLOWING SILK WAVES ---
function drawSonyXperiaZ(ctx, w, h, dt, panX, panY) {
    const time = performance.now() * 0.0012 * state.speedMultiplier;

    // Undulating Chromatic Silk Ribbons
    const ribbons = [
        { color: 'rgba(157, 0, 255, 0.45)', freq: 1.8, amp: 45, yOffset: 0.35, phase: 0 },
        { color: 'rgba(0, 242, 254, 0.40)', freq: 2.2, amp: 55, yOffset: 0.48, phase: 1.4 },
        { color: 'rgba(255, 42, 109, 0.35)', freq: 1.6, amp: 50, yOffset: 0.60, phase: 2.8 },
        { color: 'rgba(80, 227, 194, 0.30)', freq: 2.5, amp: 40, yOffset: 0.72, phase: 4.2 }
    ];

    ctx.save();
    for (const r of ribbons) {
        ctx.beginPath();
        const baseCy = h * r.yOffset + panY * 1.2;
        ctx.moveTo(-20, h + 20);

        for (let x = -20; x <= w + 20; x += 15) {
            const nx = x / w;
            const wave = Math.sin(nx * r.freq * Math.PI * 2 + time + r.phase) * r.amp;
            const wave2 = Math.cos(nx * 3.5 + time * 1.4) * (r.amp * 0.35);
            const y = baseCy + wave + wave2 + (nx - 0.5) * panX * 0.6;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(w + 20, h + 20);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseCy - r.amp, w, baseCy + r.amp);
        grad.addColorStop(0, r.color);
        grad.addColorStop(1, 'rgba(10, 5, 25, 0.1)');
        ctx.fillStyle = grad;
        ctx.fill();
    }
    ctx.restore();

    // Cosmic stardust motes drifting through the silk waves
    for (const p of state.particles) {
        p.x += dt * 32 * state.speedMultiplier;
        p.y += Math.sin(p.phase += dt * 1.8) * 1.6;

        if (p.x > w + 20) p.x = -20;

        const px = p.x + panX * (p.depth * 1.8);
        const py = p.y + panY * (p.depth * 1.8);

        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#FFFFFF', p.alpha * state.glowIntensity);
        ctx.fill();
    }
}

// --- RETRO ANDROID LEGEND 4: SONY XPERIA ARC MIDNIGHT ENERGY PULSE ---
function drawSonyArcMidnight(ctx, w, h, dt, panX, panY) {
    const time = performance.now() * 0.001 * state.speedMultiplier;

    // Glowing electric blue & cyan hyperbolic arcs
    const pulse = 0.55 + 0.35 * Math.sin(time * 2.2);

    ctx.save();
    for (let arc = 0; arc < 4; arc++) {
        const offset = arc * 0.18;
        const startX = -w * 0.2 + panX;
        const startY = h * (0.85 - offset) + panY;
        const ctrlX = w * (0.45 + Math.sin(time + arc) * 0.15);
        const ctrlY = h * (0.15 + offset);
        const endX = w * 1.2;
        const endY = h * (0.4 + offset * 0.5);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);

        ctx.strokeStyle = `rgba(0, 242, 254, ${(pulse - arc * 0.1) * state.glowIntensity})`;
        ctx.lineWidth = 4 - arc * 0.6;
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 18;
        ctx.stroke();
    }
    ctx.restore();

    // Drifting Cyan Energy Sparks
    for (const p of state.particles) {
        p.y -= dt * (35 + p.depth * 45) * state.speedMultiplier;
        p.x += Math.sin(p.phase += dt * 2.0) * 2.0;

        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);

        ctx.beginPath();
        ctx.arc(px, py, 2.0 + p.depth * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(state.primaryColor || '#00F2FE', p.alpha * state.glowIntensity);
        ctx.fill();
    }
}

// --- RETRO ANDROID LEGEND 5: NEXUS 4 HOLO PHASE BEAM ---
function drawNexusPhaseBeam(ctx, w, h, dt, panX, panY) {
    const time = performance.now() * 0.001 * state.speedMultiplier;
    const slantAngle = 0.52; // ~30 degrees

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // 1. Diagonal streaming light beams
    const beamCount = 6;
    for (let b = 0; b < beamCount; b++) {
        const beamPhase = (time * 0.4 + b / beamCount) % 1.0;
        const startX = (w * 1.4 * beamPhase - w * 0.3) + panX;
        const beamWidth = 35 + (b % 3) * 25;

        ctx.beginPath();
        ctx.moveTo(startX, -50);
        ctx.lineTo(startX + beamWidth, -50);
        ctx.lineTo(startX + beamWidth - h * slantAngle, h + 50);
        ctx.lineTo(startX - h * slantAngle, h + 50);
        ctx.closePath();

        const beamAlpha = (0.2 + 0.25 * Math.sin(beamPhase * Math.PI)) * state.glowIntensity;
        const grad = ctx.createLinearGradient(startX, 0, startX + beamWidth, 0);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        grad.addColorStop(0.5, b % 2 === 0 ? `rgba(0, 242, 254, ${beamAlpha})` : `rgba(157, 0, 255, ${beamAlpha})`);
        grad.addColorStop(1, 'rgba(0, 242, 254, 0)');

        ctx.fillStyle = grad;
        ctx.fill();
    }

    // 2. Floating Holo Bokeh Discs (Cyan, Amber, Purple)
    for (const p of state.particles) {
        p.y -= dt * (22 + p.depth * 30) * state.speedMultiplier;
        p.x -= dt * (22 + p.depth * 30) * slantAngle * state.speedMultiplier;

        if (p.y < -40) { p.y = h + 40; p.x = Math.random() * (w * 1.5); }

        const px = p.x + panX * (p.depth * 1.5);
        const py = p.y + panY * (p.depth * 1.5);

        ctx.beginPath();
        ctx.arc(px, py, 14 + p.depth * 22, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(p.color || '#00F2FE', p.alpha * 0.45 * state.glowIntensity);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 6 + p.depth * 8, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba('#FFFFFF', p.alpha * 0.7 * state.glowIntensity);
        ctx.fill();
    }
    ctx.restore();
}

// --- RETRO ANDROID LEGEND 6: HTC SENSE VOLUMETRIC SUNBEAMS & CLOUDS ---
function drawHtcSenseClouds(ctx, w, h, dt, panX, panY) {
    const time = performance.now() * 0.0008 * state.speedMultiplier;

    ctx.save();
    // 1. Volumetric Sunbeams Streaming from Top-Left
    const originX = w * 0.15 + panX * 0.4;
    const originY = -30 + panY * 0.4;

    for (let i = 0; i < 7; i++) {
        const rayAngle = 0.35 + (i * 0.12) + Math.sin(time + i) * 0.04;
        const raySpread = 0.09;
        const rayLen = h * 1.3;

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + Math.cos(rayAngle - raySpread) * rayLen, originY + Math.sin(rayAngle - raySpread) * rayLen);
        ctx.lineTo(originX + Math.cos(rayAngle + raySpread) * rayLen, originY + Math.sin(rayAngle + raySpread) * rayLen);
        ctx.closePath();

        const beamAlpha = (0.12 + 0.08 * Math.sin(time * 2.0 + i)) * state.glowIntensity;
        const rayGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, rayLen);
        rayGrad.addColorStop(0, `rgba(255, 235, 160, ${beamAlpha * 1.5})`);
        rayGrad.addColorStop(0.5, `rgba(255, 210, 100, ${beamAlpha})`);
        rayGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');

        ctx.fillStyle = rayGrad;
        ctx.fill();
    }

    // 2. Rolling Cloud Puffs Drifting Gently
    for (let c = 0; c < 4; c++) {
        const cloudX = ((w + 240) * ((time * 0.1 + c * 0.28) % 1.0) - 120) + panX * 0.8;
        const cloudY = h * (0.32 + c * 0.12) + panY * 0.8;
        const cloudSize = 75 + c * 15;

        const puffGrad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudSize);
        puffGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
        puffGrad.addColorStop(0.6, 'rgba(240, 248, 255, 0.18)');
        puffGrad.addColorStop(1, 'rgba(230, 240, 255, 0)');

        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
        ctx.arc(cloudX - cloudSize * 0.45, cloudY + 10, cloudSize * 0.7, 0, Math.PI * 2);
        ctx.arc(cloudX + cloudSize * 0.45, cloudY + 10, cloudSize * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = puffGrad;
        ctx.fill();
    }
    ctx.restore();

    // 3. Gentle Atmospheric Raindrops & Shimmer
    drawMonsoonRain(ctx, w, h, dt, panX, panY);
}

// --- DYNAMIC CUSTOM EFFECT RENDERER (Driven by Studio Codes) ---
function drawDynamicCustomEffect(ctx, w, h, dt, panX, panY, customFx) {
    if (!customFx) return;

    const spd = (customFx.speedMultiplier || 1.0) * state.speedMultiplier;
    const gravY = (customFx.gravityY || 0) * 120;
    const windX = (customFx.windDriftX || 0) * 120;
    const oscFreq = customFx.waveOscillationFreq || 0;
    const oscAmp = customFx.waveOscillationAmplitude || 0;
    const shape = customFx.particleShape || 'CIRCLE';
    const blendMode = customFx.blendMode || 'SCREEN';

    ctx.save();
    if (blendMode === 'ADD') ctx.globalCompositeOperation = 'lighter';
    else if (blendMode === 'SCREEN') ctx.globalCompositeOperation = 'screen';
    else ctx.globalCompositeOperation = 'source-over';

    const priCol = customFx.primaryColorArgb ? argbIntToHex(customFx.primaryColorArgb) : (customFx.primaryColor || state.primaryColor);
    const secCol = customFx.secondaryColorArgb ? argbIntToHex(customFx.secondaryColorArgb) : (customFx.secondaryColor || state.secondaryColor);
    const accCol = customFx.accentColorArgb ? argbIntToHex(customFx.accentColorArgb) : (customFx.accentColor || state.accentColor);
    const colors = [priCol, secCol, accCol, '#FFFFFF'];

    for (const p of state.particles) {
        // Physics update
        p.y += dt * ((p.speedY || 30) + gravY) * spd;
        p.x += dt * ((p.speedX || 0) + windX) * spd;

        if (oscFreq > 0 && oscAmp > 0) {
            p.x += Math.sin(p.phase += dt * oscFreq * Math.PI * 2) * (oscAmp * dt * 3);
        }

        p.rotation += dt * (p.rotSpeed || 20);

        // Screen wrap
        if (p.y > h + 50) { p.y = -50; p.x = Math.random() * (w + 80) - 40; }
        else if (p.y < -50) { p.y = h + 50; p.x = Math.random() * (w + 80) - 40; }
        if (p.x > w + 50) p.x = -50;
        else if (p.x < -50) p.x = w + 50;

        const px = p.x + panX * (p.depth * 2.0);
        const py = p.y + panY * (p.depth * 2.0);
        const pSize = (customFx.particleSize || p.size || 10) * (0.6 + p.depth * 0.7);
        const pAlpha = p.alpha * (customFx.glowIntensity || state.glowIntensity || 1.0);
        const pColor = p.color || colors[Math.floor(Math.random() * colors.length)];

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((p.rotation * Math.PI) / 180);

        switch (shape) {
            case 'STAR': {
                ctx.fillStyle = hexToRgba(pColor, pAlpha);
                ctx.beginPath();
                const spikes = 5;
                const outer = pSize;
                const inner = pSize * 0.45;
                for (let s = 0; s < spikes * 2; s++) {
                    const r = s % 2 === 0 ? outer : inner;
                    const a = (s * Math.PI) / spikes;
                    if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'SPARK': {
                ctx.strokeStyle = hexToRgba(pColor, pAlpha);
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(-pSize * 1.4, 0); ctx.lineTo(pSize * 1.4, 0);
                ctx.moveTo(0, -pSize * 1.4); ctx.lineTo(0, pSize * 1.4);
                ctx.stroke();
                break;
            }
            case 'DIAMOND': {
                ctx.fillStyle = hexToRgba(pColor, pAlpha);
                ctx.beginPath();
                ctx.moveTo(0, -pSize);
                ctx.lineTo(pSize * 0.7, 0);
                ctx.lineTo(0, pSize);
                ctx.lineTo(-pSize * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'RING': {
                ctx.strokeStyle = hexToRgba(pColor, pAlpha);
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.arc(0, 0, pSize, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
            case 'PETAL': {
                ctx.fillStyle = hexToRgba(pColor, pAlpha);
                ctx.beginPath();
                ctx.moveTo(0, -pSize * 1.2);
                ctx.quadraticCurveTo(pSize * 0.8, 0, 0, pSize * 1.2);
                ctx.quadraticCurveTo(-pSize * 0.8, 0, 0, -pSize * 1.2);
                ctx.fill();
                break;
            }
            case 'CIRCLE':
            default: {
                ctx.fillStyle = hexToRgba(pColor, pAlpha);
                ctx.beginPath();
                ctx.arc(0, 0, pSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
        }
        ctx.restore();
    }
    ctx.restore();
}

// ==============================================================================
// MEDIA UPLOADERS & PRESETS GALLERY
// ==============================================================================
function initMediaUploaders() {
    const dropzone = document.getElementById('media-dropzone');
    const imageInput = document.getElementById('media-image-input');
    const videoInput = document.getElementById('media-video-input');
    const btnPickImage = document.getElementById('btn-pick-image');
    const btnPickVideo = document.getElementById('btn-pick-video');
    const btnClearMedia = document.getElementById('btn-clear-media');
    const urlInput = document.getElementById('wp-media-url');
    const loadUrlBtn = document.getElementById('btn-apply-url');

    // 1. Explicit Pick from PC Buttons
    if (btnPickImage && imageInput) {
        btnPickImage.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleMediaFile(e.target.files[0]);
            }
        });
    }

    if (btnPickVideo && videoInput) {
        btnPickVideo.addEventListener('click', () => videoInput.click());
        videoInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleMediaFile(e.target.files[0]);
            }
        });
    }

    // 2. Drag & Drop Zone
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            if (state.currentMode === 'VIDEO_LOOP') {
                if (videoInput) videoInput.click();
            } else {
                if (imageInput) imageInput.click();
            }
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleMediaFile(e.dataTransfer.files[0]);
            }
        });
    }

    // 3. Clear Media Button
    if (btnClearMedia) {
        btnClearMedia.addEventListener('click', () => {
            state.mediaDataUrl = '';
            state.bgImageObj = null;
            const badge = document.getElementById('selected-file-badge');
            if (badge) badge.style.display = 'none';
            const dropText = document.getElementById('dropzone-text');
            if (dropText) dropText.innerText = 'Drag & Drop Image or Video File from PC Here';
            if (imageInput) imageInput.value = '';
            if (videoInput) videoInput.value = '';
            const video = document.getElementById('phone-video-player');
            if (video) { video.pause(); video.style.display = 'none'; }
            const staticImg = document.getElementById('phone-static-image');
            if (staticImg) staticImg.style.display = 'none';
            const canvas = document.getElementById('motion-canvas');
            if (canvas) canvas.style.display = 'block';
        });
    }

    // 4. URL Input Loader
    if (loadUrlBtn && urlInput) {
        loadUrlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) loadMediaUrl(url);
        });
    }
}

function handleMediaFile(file) {
    const dropText = document.getElementById('dropzone-text');
    const badge = document.getElementById('selected-file-badge');
    const fileNameEl = document.getElementById('selected-file-name');
    const fileSizeEl = document.getElementById('selected-file-size');
    const fileIconEl = document.getElementById('selected-file-icon');

    const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            state.mediaDataUrl = e.target.result;
            state.mediaType = 'image';
            if (dropText) dropText.innerText = `✅ Image Loaded: ${file.name}`;
            if (badge) badge.style.display = 'flex';
            if (fileNameEl) fileNameEl.innerText = file.name;
            if (fileSizeEl) fileSizeEl.innerText = `Image (${formattedSize}) • Live in simulator`;
            if (fileIconEl) fileIconEl.innerText = '🖼️';

            applyLoadedMedia(state.mediaDataUrl, 'image');
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(file);
        state.mediaDataUrl = videoUrl;
        state.mediaType = 'video';
        if (dropText) dropText.innerText = `✅ Video Loaded: ${file.name}`;
        if (badge) badge.style.display = 'flex';
        if (fileNameEl) fileNameEl.innerText = file.name;
        if (fileSizeEl) fileSizeEl.innerText = `Video (${formattedSize}) • Live looping in simulator`;
        if (fileIconEl) fileIconEl.innerText = '🎬';

        // Auto-switch to VIDEO_LOOP mode
        setWallpaperMode('VIDEO_LOOP');
        applyLoadedMedia(videoUrl, 'video');
    }
}

function loadMediaUrl(url) {
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('/video/');
    state.mediaDataUrl = url;
    state.mediaType = isVideo ? 'video' : 'image';

    const dropText = document.getElementById('dropzone-text');
    if (dropText) dropText.innerText = `✅ URL Active: ${url.slice(0, 35)}...`;

    if (isVideo) setWallpaperMode('VIDEO_LOOP');
    applyLoadedMedia(url, state.mediaType);
}

function applyLoadedMedia(src, type) {
    const canvas = document.getElementById('motion-canvas');
    const video = document.getElementById('phone-video-player');
    const staticImg = document.getElementById('phone-static-image');

    if (type === 'video') {
        if (canvas) canvas.style.display = 'none';
        if (staticImg) staticImg.style.display = 'none';
        if (video) {
            video.style.display = 'block';
            video.src = src;
            video.play().catch(() => {});
        }
    } else {
        if (video) {
            video.pause();
            video.style.display = 'none';
        }

        if (state.currentMode === 'STATIC_IMAGE') {
            if (canvas) canvas.style.display = 'none';
            if (staticImg) {
                staticImg.style.display = 'block';
                staticImg.src = src;
            }
        } else {
            if (staticImg) staticImg.style.display = 'none';
            if (canvas) canvas.style.display = 'block';

            // Load into 3D Canvas Background
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => { state.bgImageObj = img; };
            img.src = src;
        }
    }
}

function initPresetsGallery() {
    const gallery = document.getElementById('presets-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    PRESET_GALLERY.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-preset-card';
        card.innerHTML = `
            <img src="${item.url}" alt="${item.name}">
            <span>${item.name}</span>
        `;
        card.addEventListener('click', () => {
            loadMediaUrl(item.url);
            if (item.effect) {
                state.currentEffect = item.effect;
                document.querySelectorAll('#particle-selector .particle-chip').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-effect') === item.effect);
                });
                const canvas = document.getElementById('motion-canvas');
                if (canvas) initParticles(canvas.width, canvas.height);
            }
        });
        gallery.appendChild(card);
    });
}

// Mode Switcher (Photo Motion vs Static Image vs Video Loop)
function setWallpaperMode(mode) {
    state.currentMode = mode;
    document.querySelectorAll('#mode-selector-grid .particle-chip').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-type') === mode);
    });

    const particleGroup = document.getElementById('group-particle-selector');
    const colorGroup = document.getElementById('group-color-tuning');
    const densityBox = document.getElementById('box-slider-density');
    const glowBox = document.getElementById('box-slider-glow');

    if (mode === 'CUSTOM_PHOTO_MOTION') {
        if (particleGroup) particleGroup.style.display = 'block';
        if (colorGroup) colorGroup.style.display = 'block';
        if (densityBox) densityBox.style.display = 'flex';
        if (glowBox) glowBox.style.display = 'flex';
    } else {
        if (particleGroup) particleGroup.style.display = 'none';
        if (colorGroup) colorGroup.style.display = 'none';
        if (densityBox) densityBox.style.display = 'none';
        if (glowBox) glowBox.style.display = 'none';
    }

    if (state.mediaDataUrl) {
        applyLoadedMedia(state.mediaDataUrl, mode === 'VIDEO_LOOP' ? 'video' : 'image');
    }
}

// ==============================================================================
// FORMS, CONTROLS & REALTIME DB SYNCHRONIZATION
// ==============================================================================
function initForms() {
    // Mode selector chips
    document.querySelectorAll('#mode-selector-grid .particle-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-type');
            setWallpaperMode(mode);
        });
    });

    // Particle effect chips
    document.querySelectorAll('#particle-selector .particle-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#particle-selector .particle-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentEffect = btn.getAttribute('data-effect');
            const canvas = document.getElementById('motion-canvas');
            if (canvas) initParticles(canvas.width, canvas.height);
        });
    });

    // Color Pickers
    const cp = document.getElementById('color-primary');
    const cs = document.getElementById('color-secondary');
    const ca = document.getElementById('color-accent');

    if (cp) cp.addEventListener('input', (e) => state.primaryColor = e.target.value);
    if (cs) cs.addEventListener('input', (e) => state.secondaryColor = e.target.value);
    if (ca) ca.addEventListener('input', (e) => state.accentColor = e.target.value);

    // Color Preset Pills
    document.querySelectorAll('#color-preset-pills [data-palette]').forEach(pill => {
        pill.addEventListener('click', () => {
            const pal = pill.getAttribute('data-palette');
            if (pal === 'cyber') {
                state.primaryColor = '#00F2FE'; state.secondaryColor = '#9D00FF'; state.accentColor = '#FFFFFF';
            } else if (pal === 'sakura') {
                state.primaryColor = '#FF758C'; state.secondaryColor = '#FF7EB3'; state.accentColor = '#FFFFFF';
            } else if (pal === 'monsoon') {
                state.primaryColor = '#00C6FF'; state.secondaryColor = '#0072FF'; state.accentColor = '#FFFFFF';
            } else if (pal === 'golden') {
                state.primaryColor = '#FFB300'; state.secondaryColor = '#FF5252'; state.accentColor = '#FFFFFF';
            }
            if (cp) cp.value = state.primaryColor;
            if (cs) cs.value = state.secondaryColor;
            if (ca) ca.value = state.accentColor;
        });
    });

    // Sliders
    bindSlider('slider-speed', 'val-speed', (v) => state.speedMultiplier = parseFloat(v), 'x');
    bindSlider('slider-density', 'val-density', (v) => {
        state.particleDensity = parseFloat(v);
        const canvas = document.getElementById('motion-canvas');
        if (canvas) initParticles(canvas.width, canvas.height);
    }, 'x');
    bindSlider('slider-parallax', 'val-parallax', (v) => state.parallaxSensitivity = parseFloat(v), 'x');
    bindSlider('slider-glow', 'val-glow', (v) => state.glowIntensity = parseFloat(v), 'x');

    // Wallpaper Form Submit
    const wpForm = document.getElementById('form-wallpaper');
    if (wpForm) {
        wpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('wp-id').value || `wp_${Date.now()}`;
            const title = document.getElementById('wp-title').value;
            const category = document.getElementById('wp-category').value;
            const desc = document.getElementById('wp-desc').value;
            const fps = parseInt(document.getElementById('wp-fps').value) || 60;
            const resolution = document.getElementById('wp-resolution').value || '4K HDR';

            // Custom Thumbnail URL or auto-capture 3D preview canvas snapshot
            const customThumb = document.getElementById('wp-thumbnail-url')?.value.trim();
            let thumbnailDataUrl = null;
            const canvasEl = document.getElementById('motion-canvas');
            if (canvasEl && !customThumb) {
                try {
                    thumbnailDataUrl = canvasEl.toDataURL('image/jpeg', 0.85);
                } catch (e) {}
            }
            const finalThumb = customThumb || thumbnailDataUrl || (state.mediaType === 'image' ? state.mediaDataUrl : null);

            const wallpaperItem = {
                id,
                title,
                category,
                type: state.currentMode,
                author: 'StrawHats Studios',
                description: desc,
                tags: ['3D', 'Live', category, state.currentMode],
                fps,
                resolution,
                thumbnail_url: finalThumb,
                photo_uri_string: state.mediaType === 'image' ? state.mediaDataUrl : null,
                video_uri_string: state.mediaType === 'video' ? state.mediaDataUrl : null,
                data: {
                    thumbnailUrl: finalThumb,
                    speedMultiplier: state.speedMultiplier,
                    particleDensity: state.particleDensity,
                    parallaxSensitivity: state.parallaxSensitivity,
                    glowIntensity: state.glowIntensity,
                    particleEffectType: state.currentEffect,
                    primaryColorArgb: hexToArgbInt(state.primaryColor),
                    secondaryColorArgb: hexToArgbInt(state.secondaryColor),
                    accentColorArgb: hexToArgbInt(state.accentColor),
                    photoUriString: state.mediaType === 'image' ? state.mediaDataUrl : null,
                    videoUriString: state.mediaType === 'video' ? state.mediaDataUrl : null
                }
            };

            const idx = state.wallpapers.findIndex(w => w.id === id);
            if (idx >= 0) state.wallpapers[idx] = wallpaperItem;
            else state.wallpapers.unshift(wallpaperItem);

            localStorage.setItem('lively_wallpapers', JSON.stringify(state.wallpapers));

            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('wallpapers', 'POST', wallpaperItem);
                    alert(`✅ Wallpaper "${title}" saved & published to Supabase Realtime DB!`);
                } catch (err) {
                    alert('⚠️ Saved locally, Supabase notice: ' + err.message);
                }
            } else {
                alert('✅ Wallpaper saved locally! (Configure Supabase in the Setup tab to sync to mobile app).');
            }

            renderAllViews();
            resetWallpaperForm();
        });
    }

    document.getElementById('btn-reset-wp-form')?.addEventListener('click', resetWallpaperForm);

    // Banner Form
    const bannerForm = document.getElementById('form-banner');
    if (bannerForm) {
        bannerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('banner-id').value || `banner_${Date.now()}`;
            const title = document.getElementById('banner-title').value;
            const subtitle = document.getElementById('banner-subtitle').value;
            const badge = document.getElementById('banner-badge').value;
            const wpId = document.getElementById('banner-wallpaper-id').value || null;
            const c1 = hexToArgbInt(document.getElementById('banner-color-1').value);
            const c2 = hexToArgbInt(document.getElementById('banner-color-2').value);
            const priority = parseInt(document.getElementById('banner-priority').value) || 1;
            const isActive = document.getElementById('banner-active').value === 'true';

            const bannerItem = {
                id,
                title,
                subtitle,
                badge,
                wallpaper_id: wpId,
                gradient_colors: [c1, c2],
                priority,
                is_active: isActive
            };

            const idx = state.banners.findIndex(b => b.id === id);
            if (idx >= 0) state.banners[idx] = bannerItem;
            else state.banners.push(bannerItem);

            state.banners.sort((a, b) => a.priority - b.priority);
            localStorage.setItem('lively_banners', JSON.stringify(state.banners));

            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('banners', 'POST', bannerItem);
                    alert('✅ Trending banner published to Supabase!');
                } catch (err) {
                    alert('⚠️ Supabase error: ' + err.message);
                }
            } else {
                alert('✅ Banner saved locally!');
            }

            renderAllViews();
        });
    }

    // App Update Form
    const updateForm = document.getElementById('form-app-update');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updateItem = {
                id: 'latest_release',
                latest_version_code: parseInt(document.getElementById('up-version-code').value),
                latest_version_name: document.getElementById('up-version-name').value,
                min_required_version_code: parseInt(document.getElementById('up-min-code').value),
                force_update: document.getElementById('up-force').value === 'true',
                title: document.getElementById('up-title').value,
                download_url: document.getElementById('up-download-url').value,
                changelog: document.getElementById('up-changelog').value,
                release_date: new Date().toISOString().split('T')[0]
            };

            state.appUpdate = updateItem;
            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('app_updates', 'POST', updateItem);
                    alert('🚀 In-App Update broadcast live to mobile app users!');
                } catch (err) {
                    alert('⚠️ Supabase notice: ' + err.message);
                }
            } else {
                alert('✅ Update details saved locally!');
            }
        });
    }

    // Broadcast Notifications Form
    const notifForm = document.getElementById('form-notification');
    if (notifForm) {
        notifForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const notifItem = {
                id: `notif_${Date.now()}`,
                title: document.getElementById('notif-title').value,
                body: document.getElementById('notif-body').value,
                category: document.getElementById('notif-category').value,
                action_url: document.getElementById('notif-action-url').value || null,
                wallpaper_id: document.getElementById('notif-wallpaper-id').value || null,
                timestamp: Date.now()
            };

            state.notifications.unshift(notifItem);
            localStorage.setItem('lively_notifications', JSON.stringify(state.notifications));

            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('notifications', 'POST', notifItem);
                    alert(`🔔 Broadcast notification "${notifItem.title}" sent live!`);
                } catch (err) {
                    alert('⚠️ Supabase error: ' + err.message);
                }
            } else {
                alert('🔔 Notification saved locally!');
            }

            document.getElementById('notif-title').value = '';
            document.getElementById('notif-body').value = '';
            renderAllViews();
        });
    }

    // Category Form
    const categoryForm = document.getElementById('form-category');
    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idInput = document.getElementById('cat-id').value.trim();
            const nameInput = document.getElementById('cat-name').value.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
            const displayName = document.getElementById('cat-display-name').value.trim();
            const emoji = document.getElementById('cat-emoji').value.trim() || '✨';
            const priority = parseInt(document.getElementById('cat-priority').value) || 1;
            const active = document.getElementById('cat-active').value === 'true';

            const catId = idInput || `cat_${nameInput.toLowerCase()}`;
            const catItem = {
                id: catId,
                name: nameInput,
                display_name: displayName,
                icon_emoji: emoji,
                priority: priority,
                is_active: active
            };

            const existingIdx = state.categories.findIndex(c => c.id === catId || c.name === nameInput);
            if (existingIdx >= 0) {
                state.categories[existingIdx] = catItem;
            } else {
                state.categories.push(catItem);
            }
            state.categories.sort((a, b) => (a.priority || 0) - (b.priority || 0));

            localStorage.setItem('lively_categories', JSON.stringify(state.categories));

            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('categories', 'POST', catItem);
                    alert(`✅ Category "${displayName}" published live to Supabase & Mobile App!`);
                } catch (err) {
                    alert('⚠️ Supabase sync notice: ' + err.message);
                }
            } else {
                alert(`✅ Category "${displayName}" saved locally!`);
            }

            resetCategoryForm();
            renderAllViews();
        });
    }

    document.querySelectorAll('#quick-emoji-picker .emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('cat-emoji').value = btn.innerText;
        });
    });

    document.getElementById('btn-reset-category-form')?.addEventListener('click', resetCategoryForm);

    // Dev Info Form
    const devForm = document.getElementById('form-devinfo');
    if (devForm) {
        devForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const devItem = {
                id: 'studio_info',
                studio_name: document.getElementById('dev-studio-name').value,
                tagline: document.getElementById('dev-tagline').value,
                email: document.getElementById('dev-email').value,
                website: document.getElementById('dev-website').value,
                github: document.getElementById('dev-github').value,
                telegram: document.getElementById('dev-telegram').value,
                discord: 'https://discord.gg/strawhats',
                app_version: '1.0.0 (Release)',
                package_id: document.getElementById('dev-package-id').value,
                announcement: document.getElementById('dev-announcement').value
            };

            state.devInfo = devItem;
            if (state.supabaseUrl && state.supabaseKey) {
                try {
                    await supabaseRequest('dev_info', 'POST', devItem);
                    alert('✅ Dev Info synced live to Android App bottom Dev Info screen!');
                } catch (err) {
                    alert('⚠️ Supabase notice: ' + err.message);
                }
            } else {
                alert('✅ Dev info saved locally!');
            }
        });
    }

    // Supabase Credentials Save & Test
    document.getElementById('btn-save-sb-config')?.addEventListener('click', () => {
        const url = document.getElementById('sb-config-url').value.trim();
        const key = document.getElementById('sb-config-key').value.trim();
        state.supabaseUrl = url;
        state.supabaseKey = key;
        localStorage.setItem('lively_sb_url', url);
        localStorage.setItem('lively_sb_key', key);
        testSupabaseConnection(true);
    });

    document.getElementById('btn-test-sb-conn')?.addEventListener('click', () => testSupabaseConnection(true));
    document.getElementById('btn-quick-test-conn')?.addEventListener('click', () => testSupabaseConnection(true));

    // Copy SQL Script
    document.getElementById('btn-copy-sql')?.addEventListener('click', () => {
        const snippet = document.getElementById('sql-code-snippet').innerText;
        navigator.clipboard.writeText(snippet);
        alert('📋 SQL migration script copied to clipboard! Paste it into Supabase SQL Editor.');
    });

    // Export Catalog JSON
    document.getElementById('btn-export-catalog')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state.wallpapers, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `lively-wallpapers-catalog-${Date.now()}.json`;
        a.click();
    });

    // Sync All to Supabase
    document.getElementById('btn-publish-all')?.addEventListener('click', async () => {
        if (!state.supabaseUrl || !state.supabaseKey) {
            alert('Please configure your Supabase Project URL & Anon Key in the Supabase Setup tab first.');
            switchTab('tab-setup');
            return;
        }

        try {
            // 1. Sync Categories
            for (const cat of state.categories) await supabaseRequest('categories', 'POST', cat);
            
            // 2. Sync Wallpapers
            for (const wp of state.wallpapers) await supabaseRequest('wallpapers', 'POST', wp);
            
            const existingWpIds = new Set(state.wallpapers.map(w => w.id));

            // 3. Sync Banners (sanitize wallpaper_id if referenced wallpaper is missing)
            for (const b of state.banners) {
                const bannerPayload = { ...b };
                if (bannerPayload.wallpaper_id && !existingWpIds.has(bannerPayload.wallpaper_id)) {
                    bannerPayload.wallpaper_id = null;
                }
                await supabaseRequest('banners', 'POST', bannerPayload);
            }

            // 4. Sync Notifications (sanitize wallpaper_id if missing)
            for (const n of state.notifications) {
                const notifPayload = { ...n };
                if (notifPayload.wallpaper_id && !existingWpIds.has(notifPayload.wallpaper_id)) {
                    notifPayload.wallpaper_id = null;
                }
                await supabaseRequest('notifications', 'POST', notifPayload);
            }

            // 5. Sync App Updates & Studio Dev Info
            await supabaseRequest('app_updates', 'POST', state.appUpdate);
            await supabaseRequest('dev_info', 'POST', state.devInfo);

            alert('⚡ All Categories, Wallpapers, Trending Banners, OTA Update, and Studio Info successfully synced to Supabase!');
        } catch (e) {
            alert('⚠️ Sync error: ' + e.message);
        }
    });
}

function bindSlider(id, valId, callback, unit = '') {
    const slider = document.getElementById(id);
    const display = document.getElementById(valId);
    if (!slider || !display) return;

    slider.addEventListener('input', (e) => {
        display.innerText = `${e.target.value}${unit}`;
        callback(e.target.value);
    });
}

function resetWallpaperForm() {
    document.getElementById('wp-id').value = '';
    document.getElementById('wp-title').value = '';
    document.getElementById('wp-desc').value = '';
    document.getElementById('wp-media-url').value = '';
    const thumbInput = document.getElementById('wp-thumbnail-url');
    if (thumbInput) thumbInput.value = '';
    document.getElementById('form-mode-badge').innerText = 'New Wallpaper';
}

function resetCategoryForm() {
    const catId = document.getElementById('cat-id');
    if (catId) catId.value = '';
    const catName = document.getElementById('cat-name');
    if (catName) catName.value = '';
    const catDisp = document.getElementById('cat-display-name');
    if (catDisp) catDisp.value = '';
    const catEmoji = document.getElementById('cat-emoji');
    if (catEmoji) catEmoji.value = '✨';
    const catPriority = document.getElementById('cat-priority');
    if (catPriority) catPriority.value = '1';
    const catActive = document.getElementById('cat-active');
    if (catActive) catActive.value = 'true';
    const catBadge = document.getElementById('cat-mode-badge');
    if (catBadge) catBadge.innerText = 'CREATE';
    const catTitle = document.getElementById('category-form-title');
    if (catTitle) catTitle.innerText = '🏷️ Add New Category Type';
}

function editCategory(id) {
    const cat = state.categories.find(c => c.id === id);
    if (!cat) return;

    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-name').value = cat.name;
    document.getElementById('cat-display-name').value = cat.display_name;
    document.getElementById('cat-emoji').value = cat.icon_emoji || '✨';
    document.getElementById('cat-priority').value = cat.priority || 1;
    document.getElementById('cat-active').value = cat.is_active !== false ? 'true' : 'false';
    document.getElementById('cat-mode-badge').innerText = 'EDITING';
    document.getElementById('category-form-title').innerText = `🏷️ Edit Category: ${cat.display_name}`;

    switchTab('tab-categories');
}

async function deleteCategory(id) {
    const cat = state.categories.find(c => c.id === id);
    if (!cat) return;

    if (cat.name === 'ALL' || cat.name === 'BUILT_IN') {
        alert(`Cannot delete default "${cat.display_name}" category.`);
        return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.display_name}"?`)) return;

    state.categories = state.categories.filter(c => c.id !== id);
    localStorage.setItem('lively_categories', JSON.stringify(state.categories));

    if (state.supabaseUrl && state.supabaseKey) {
        try {
            await supabaseRequest(`categories?id=eq.${id}`, 'DELETE');
        } catch (e) {}
    }
    renderAllViews();
}

function editWallpaper(id) {
    const wp = state.wallpapers.find(w => w.id === id);
    if (!wp) return;

    document.getElementById('wp-id').value = wp.id;
    document.getElementById('wp-title').value = wp.title;
    document.getElementById('wp-category').value = wp.category;
    document.getElementById('wp-desc').value = wp.description || '';
    const thumbInput = document.getElementById('wp-thumbnail-url');
    if (thumbInput) thumbInput.value = wp.thumbnail_url || wp.data?.thumbnailUrl || '';
    document.getElementById('form-mode-badge').innerText = `Editing: ${wp.title}`;

    if (wp.type) setWallpaperMode(wp.type);

    const mediaSrc = wp.photo_uri_string || wp.video_uri_string || wp.data?.photoUriString || wp.data?.videoUriString;
    if (mediaSrc) {
        document.getElementById('wp-media-url').value = mediaSrc;
        loadMediaUrl(mediaSrc);
    }

    if (wp.data?.particleEffectType) {
        state.currentEffect = wp.data.particleEffectType;
        document.querySelectorAll('#particle-selector .particle-chip').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-effect') === state.currentEffect);
        });
    }

    switchTab('tab-wallpapers');
}

async function deleteWallpaper(id) {
    if (!confirm('Are you sure you want to delete this wallpaper?')) return;
    state.wallpapers = state.wallpapers.filter(w => w.id !== id);
    localStorage.setItem('lively_wallpapers', JSON.stringify(state.wallpapers));

    if (state.supabaseUrl && state.supabaseKey) {
        try {
            await supabaseRequest(`wallpapers?id=eq.${id}`, 'DELETE');
        } catch (e) {}
    }
    renderAllViews();
}

// ==============================================================================
// SUPABASE REST CLIENT & DATA LOADING
// ==============================================================================
function loadInitialData() {
    const cachedCats = localStorage.getItem('lively_categories');
    let loadedCats = cachedCats ? JSON.parse(cachedCats) : [...DEFAULT_CATEGORIES];
    DEFAULT_CATEGORIES.forEach(defCat => {
        if (!loadedCats.some(c => c.name === defCat.name)) {
            loadedCats.push(defCat);
        }
    });
    state.categories = loadedCats;

    const cachedWp = localStorage.getItem('lively_wallpapers');
    let loadedWp = cachedWp ? JSON.parse(cachedWp) : [...DEFAULT_WALLPAPERS];
    DEFAULT_WALLPAPERS.forEach(defWp => {
        if (!loadedWp.some(w => w.id === defWp.id)) {
            loadedWp.push(defWp);
        }
    });
    state.wallpapers = loadedWp;

    const cachedBanners = localStorage.getItem('lively_banners');
    state.banners = cachedBanners ? JSON.parse(cachedBanners) : DEFAULT_BANNERS;

    const cachedNotifs = localStorage.getItem('lively_notifications');
    state.notifications = cachedNotifs ? JSON.parse(cachedNotifs) : DEFAULT_NOTIFICATIONS;

    // Load or seed custom dynamic effects
    const cachedFx = localStorage.getItem('lively_custom_effects');
    if (cachedFx) {
        state.customEffects = JSON.parse(cachedFx);
    } else if (!state.customEffects || state.customEffects.length === 0) {
        state.customEffects = [
            {
                id: "fx_neon_cyber_rain",
                name: "Cyber Neon Matrix Rain",
                particleCount: 55,
                particleShape: "SPARK",
                speedMultiplier: 1.3,
                gravityY: 0.6,
                windDriftX: 0.0,
                waveOscillationFreq: 0.0,
                waveOscillationAmplitude: 0,
                particleSize: 12,
                glowIntensity: 1.4,
                blendMode: "ADD",
                touchReaction: "SCATTER",
                primaryColor: "#00F2FE",
                secondaryColor: "#00E676",
                accentColor: "#FFFFFF",
                primaryColorArgb: 4278252286,
                secondaryColorArgb: 4278257270,
                accentColorArgb: 4294967295
            },
            {
                id: "fx_plasma_arc_spark",
                name: "Tesla Plasma Electric Arc",
                particleCount: 40,
                particleShape: "STAR",
                speedMultiplier: 1.1,
                gravityY: -0.1,
                windDriftX: 0.15,
                waveOscillationFreq: 2.2,
                waveOscillationAmplitude: 24,
                particleSize: 14,
                glowIntensity: 1.5,
                blendMode: "ADD",
                touchReaction: "BURST",
                primaryColor: "#9D00FF",
                secondaryColor: "#00F2FE",
                accentColor: "#FF2A6D",
                primaryColorArgb: 4288479487,
                secondaryColorArgb: 4278252286,
                accentColorArgb: 4294912621
            },
            {
                id: "fx_hyper_ring",
                name: "Quantum Hyper Rings",
                particleCount: 30,
                particleShape: "RING",
                speedMultiplier: 0.9,
                gravityY: -0.2,
                windDriftX: 0.05,
                waveOscillationFreq: 1.2,
                waveOscillationAmplitude: 18,
                particleSize: 16,
                glowIntensity: 1.3,
                blendMode: "SCREEN",
                touchReaction: "RIPPLE",
                primaryColor: "#FFB300",
                secondaryColor: "#FF2A6D",
                accentColor: "#00F2FE",
                primaryColorArgb: 4294947584,
                secondaryColorArgb: 4294912621,
                accentColorArgb: 4278252286
            }
        ];
        localStorage.setItem('lively_custom_effects', JSON.stringify(state.customEffects));
    }

    if (document.getElementById('sb-config-url')) {
        document.getElementById('sb-config-url').value = state.supabaseUrl;
    }
    if (document.getElementById('sb-config-key')) {
        document.getElementById('sb-config-key').value = state.supabaseKey;
    }

    // Set first wallpaper as active
    if (state.wallpapers.length > 0) {
        const first = state.wallpapers[0];
        const src = first.photo_uri_string || first.data?.photoUriString;
        if (src) loadMediaUrl(src);
    }

    renderAllViews();
}

async function supabaseRequest(endpoint, method = 'GET', body = null) {
    if (!state.supabaseUrl || !state.supabaseKey) {
        throw new Error('Supabase URL or Key not configured.');
    }

    const cleanUrl = state.supabaseUrl.replace(/\/$/, '');
    const url = `${cleanUrl}/rest/v1/${endpoint}`;

    const headers = {
        'apikey': state.supabaseKey,
        'Authorization': `Bearer ${state.supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'resolution=merge-duplicates,return=representation' : 'return=representation'
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Supabase API error (${response.status}): ${err}`);
    }
    return response.json();
}

async function testSupabaseConnection(showAlert = true) {
    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');
    const overviewUrl = document.getElementById('overview-db-url');

    if (!state.supabaseUrl || !state.supabaseKey) {
        if (statusText) statusText.innerText = '🟡 Local Offline Mode';
        if (statusDot) statusDot.style.backgroundColor = '#FFB300';
        if (overviewUrl) overviewUrl.innerText = 'Local Offline Cache';
        if (showAlert) alert('Please enter your Supabase Project URL & Anon Key in the Supabase Setup tab.');
        return false;
    }

    try {
        if (statusText) statusText.innerText = 'Connecting...';
        await supabaseRequest('wallpapers?select=id&limit=1', 'GET');
        
        if (statusText) statusText.innerText = '🟢 Supabase Connected';
        if (statusDot) statusDot.style.backgroundColor = '#00E676';
        if (overviewUrl) overviewUrl.innerText = state.supabaseUrl;

        if (showAlert) alert('✅ Successfully connected to Supabase Realtime DB!');
        fetchRemoteData();
        return true;
    } catch (e) {
        if (statusText) statusText.innerText = '🔴 Connection Failed';
        if (statusDot) statusDot.style.backgroundColor = '#FF5252';
        if (overviewUrl) overviewUrl.innerText = 'Error: ' + e.message;
        if (showAlert) alert('❌ Failed to connect to Supabase: ' + e.message);
        return false;
    }
}

async function fetchRemoteData() {
    try {
        const remoteCats = await supabaseRequest('categories?select=*&order=priority.asc');
        if (Array.isArray(remoteCats) && remoteCats.length > 0) {
            state.categories = remoteCats;
            localStorage.setItem('lively_categories', JSON.stringify(state.categories));
        }

        const remoteWp = await supabaseRequest('wallpapers?select=*&order=created_at.desc');
        if (Array.isArray(remoteWp) && remoteWp.length > 0) {
            state.wallpapers = remoteWp;
            localStorage.setItem('lively_wallpapers', JSON.stringify(state.wallpapers));
        }
        renderAllViews();
    } catch (e) {}
}

// Render All Views
function renderAllViews() {
    renderStats();
    renderCategoriesGrid();
    renderWallpapersTable();
    renderBannersGrid();
    renderNotificationsList();
    populateSelects();
}

function renderStats() {
    document.getElementById('stat-wallpapers-count').innerText = state.wallpapers.length;
    document.getElementById('stat-banners-count').innerText = state.banners.length;
    document.getElementById('stat-notif-count').innerText = state.notifications.length;
    document.getElementById('badge-notif-count').innerText = state.notifications.length;
    const catBadge = document.getElementById('badge-cat-count');
    if (catBadge) catBadge.innerText = state.categories.length;
}

function renderCategoriesGrid() {
    const container = document.getElementById('categories-list-container');
    if (!container) return;

    container.innerHTML = '';
    state.categories.forEach(cat => {
        const wpCount = state.wallpapers.filter(w => w.category === cat.name || (cat.name === 'ALL')).length;
        const card = document.createElement('div');
        card.className = 'card-panel';
        card.style.padding = '16px';
        card.style.background = 'rgba(255,255,255,0.03)';
        card.style.border = '1px solid var(--border-glass)';
        card.style.borderRadius = '16px';
        card.style.position = 'relative';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div style="font-size: 26px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border-radius: 12px; border: 1px solid var(--border-glass);">
                    ${cat.icon_emoji || '✨'}
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="tab-badge" style="background: ${cat.is_active !== false ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 82, 82, 0.2)'}; color: ${cat.is_active !== false ? 'var(--success-green)' : 'var(--cyber-pink)'};">
                        ${cat.is_active !== false ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                    <span style="font-size: 11px; color: var(--text-muted);">#${cat.priority || 0}</span>
                </div>
            </div>
            <h4 style="color: #FFF; font-size: 15px; font-weight: 800; margin-bottom: 2px;">${escapeHtml(cat.display_name)}</h4>
            <div style="font-size: 11px; color: var(--neon-cyan); font-weight: 600; text-transform: uppercase; margin-bottom: 12px;">KEY: ${escapeHtml(cat.name)}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; margin-top: 6px;">
                <span style="font-size: 12px; color: var(--text-secondary);">${wpCount} Wallpapers</span>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="editCategory('${cat.id}')">✏️</button>
                    ${(cat.name !== 'ALL' && cat.name !== 'BUILT_IN') ? `<button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')">🗑️</button>` : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderWallpapersTable() {
    const tbody = document.getElementById('wallpapers-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    state.wallpapers.forEach(wp => {
        const tr = document.createElement('tr');
        const imgUrl = wp.photo_uri_string || wp.data?.photoUriString || 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&q=80';
        tr.innerHTML = `
            <td>
                <img src="${imgUrl}" style="width: 44px; height: 58px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
            </td>
            <td>
                <strong style="color: #FFF; font-size: 13px;">${escapeHtml(wp.title)}</strong><br>
                <span style="color: var(--text-muted); font-size: 11px;">${escapeHtml(wp.resolution || '4K HDR')} • ${wp.fps || 60} FPS</span>
            </td>
            <td>
                <span class="tab-badge" style="background: rgba(0, 242, 254, 0.15); color: var(--neon-cyan);">${escapeHtml(wp.category)}</span>
            </td>
            <td>
                <span style="font-size: 12px; color: ${wp.type === 'VIDEO_LOOP' ? 'var(--plasma-amber)' : 'var(--success-green)'}; font-weight: 600;">
                    ${wp.type === 'VIDEO_LOOP' ? '🎬 Video' : (wp.type === 'STATIC_IMAGE' ? '🖼️ Static' : '⚡ 3D Motion')}
                </span>
            </td>
            <td>
                <span style="font-size: 11px; color: var(--text-secondary);">${wp.data?.particleEffectType || 'None'}</span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editWallpaper('${wp.id}')">✏️ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteWallpaper('${wp.id}')">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderBannersGrid() {
    const container = document.getElementById('banners-list-container');
    if (!container) return;

    container.innerHTML = '';
    state.banners.forEach(b => {
        const card = document.createElement('div');
        card.className = 'banner-item-card';
        card.style.background = `linear-gradient(135deg, ${argbIntToHex(b.gradient_colors?.[0] || 4278252286)}33, ${argbIntToHex(b.gradient_colors?.[1] || 4283416318)}33)`;
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <span class="tab-badge" style="background: var(--neon-cyan); color: #000; font-weight: 800;">${escapeHtml(b.badge)}</span>
                <span style="font-size: 11px; color: var(--text-muted);">Priority #${b.priority}</span>
            </div>
            <h3 style="color: #FFF; font-size: 16px; font-weight: 800; margin-bottom: 4px;">${escapeHtml(b.title)}</h3>
            <p style="color: var(--text-secondary); font-size: 12px;">${escapeHtml(b.subtitle)}</p>
        `;
        container.appendChild(card);
    });
}

function renderNotificationsList() {
    const list = document.getElementById('notifications-history-list');
    if (!list) return;

    list.innerHTML = '';
    state.notifications.forEach(n => {
        const item = document.createElement('div');
        item.style.background = 'rgba(0,0,0,0.3)';
        item.style.border = '1px solid var(--border-glass)';
        item.style.borderRadius = '12px';
        item.style.padding = '12px';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="color: #FFF; font-size: 13px;">${escapeHtml(n.title)}</strong>
                <span class="tab-badge" style="background: rgba(255, 42, 109, 0.2); color: var(--cyber-pink);">${escapeHtml(n.category)}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 6px;">${escapeHtml(n.body)}</p>
            <span style="color: var(--text-muted); font-size: 10px;">${new Date(n.timestamp).toLocaleString()}</span>
        `;
        list.appendChild(item);
    });
}

function populateSelects() {
    const wpCategorySelect = document.getElementById('wp-category');
    if (wpCategorySelect) {
        const currentVal = wpCategorySelect.value;
        wpCategorySelect.innerHTML = '';
        state.categories.filter(c => c.name !== 'ALL').forEach(c => {
            wpCategorySelect.innerHTML += `<option value="${c.name}">${c.icon_emoji || '✨'} ${escapeHtml(c.display_name)}</option>`;
        });
        if (currentVal && state.categories.some(c => c.name === currentVal)) {
            wpCategorySelect.value = currentVal;
        }
    }

    const bannerSelect = document.getElementById('banner-wallpaper-id');
    const notifSelect = document.getElementById('notif-wallpaper-id');

    if (bannerSelect) {
        bannerSelect.innerHTML = '<option value="">None (General Highlight)</option>';
        state.wallpapers.forEach(w => {
            bannerSelect.innerHTML += `<option value="${w.id}">${escapeHtml(w.title)}</option>`;
        });
    }

    if (notifSelect) {
        notifSelect.innerHTML = '<option value="">None</option>';
        state.wallpapers.forEach(w => {
            notifSelect.innerHTML += `<option value="${w.id}">${escapeHtml(w.title)}</option>`;
        });
    }
}

// Utilities
function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function hexToArgbInt(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    return (0xFF000000 | parseInt(c, 16)) >>> 0;
}

function argbIntToHex(argb) {
    return '#' + (argb & 0x00FFFFFF).toString(16).padStart(6, '0');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}

// ==============================================================================
// DYNAMIC PARTICLE & EFFECT CODE STUDIO
// ==============================================================================
const fxStudioState = {
    canvas: null,
    ctx: null,
    animId: null,
    particles: [],
    shockwaves: [],
    sparks: [],
    targetMouseX: 0,
    targetMouseY: 0,
    smoothRoll: 0,
    smoothPitch: 0,
    autoOrbit: false,
    orbitTime: 0,
    bgImage: null,

    // Active Model
    id: "fx_samsung_dandelion",
    name: "Samsung S3 Dandelion Seeds",
    particleShape: "PETAL",
    particleCount: 40,
    speedMultiplier: 0.9,
    gravityY: -0.15,
    windDriftX: 0.20,
    waveOscillationFreq: 0.8,
    waveOscillationAmplitude: 15,
    particleSize: 14,
    glowIntensity: 1.2,
    blendMode: "SCREEN",
    touchReaction: "RIPPLE",
    primaryColor: "#FFFFFF",
    secondaryColor: "#B3E5FC",
    accentColor: "#81D4FA"
};

const FX_TEMPLATES = {
    samsung_dandelion: {
        id: "fx_samsung_dandelion",
        name: "Samsung S3 Dandelion Seeds",
        particleShape: "PETAL",
        particleCount: 40,
        speedMultiplier: 0.9,
        gravityY: -0.15,
        windDriftX: 0.20,
        waveOscillationFreq: 0.8,
        waveOscillationAmplitude: 15,
        particleSize: 14,
        glowIntensity: 1.2,
        blendMode: "SCREEN",
        touchReaction: "RIPPLE",
        primaryColor: "#FFFFFF",
        secondaryColor: "#B3E5FC",
        accentColor: "#81D4FA"
    },
    sony_silk_waves: {
        id: "fx_sony_silk_waves",
        name: "Sony Xperia Z Silk Waves",
        particleShape: "STAR",
        particleCount: 45,
        speedMultiplier: 1.0,
        gravityY: 0.0,
        windDriftX: 0.35,
        waveOscillationFreq: 1.6,
        waveOscillationAmplitude: 28,
        particleSize: 12,
        glowIntensity: 1.4,
        blendMode: "ADD",
        touchReaction: "SCATTER",
        primaryColor: "#9D00FF",
        secondaryColor: "#00F2FE",
        accentColor: "#FF2A6D"
    },
    nexus_phase_laser: {
        id: "fx_nexus_phase_laser",
        name: "Nexus 4 Holo Phase Laser",
        particleShape: "SPARK",
        particleCount: 50,
        speedMultiplier: 1.2,
        gravityY: -0.4,
        windDriftX: -0.25,
        waveOscillationFreq: 0.0,
        waveOscillationAmplitude: 0,
        particleSize: 16,
        glowIntensity: 1.5,
        blendMode: "ADD",
        touchReaction: "BURST",
        primaryColor: "#00F2FE",
        secondaryColor: "#FFB300",
        accentColor: "#FFFFFF"
    },
    cyber_matrix: {
        id: "fx_cyber_matrix_rain",
        name: "Matrix Cyber Neon Rain",
        particleShape: "SPARK",
        particleCount: 65,
        speedMultiplier: 1.4,
        gravityY: 0.7,
        windDriftX: 0.0,
        waveOscillationFreq: 0.0,
        waveOscillationAmplitude: 0,
        particleSize: 14,
        glowIntensity: 1.3,
        blendMode: "ADD",
        touchReaction: "SCATTER",
        primaryColor: "#00E676",
        secondaryColor: "#00F2FE",
        accentColor: "#FFFFFF"
    },
    tesla_plasma: {
        id: "fx_tesla_plasma_spark",
        name: "Tesla Plasma Electric Spark",
        particleShape: "STAR",
        particleCount: 42,
        speedMultiplier: 1.15,
        gravityY: -0.05,
        windDriftX: 0.15,
        waveOscillationFreq: 2.4,
        waveOscillationAmplitude: 26,
        particleSize: 15,
        glowIntensity: 1.5,
        blendMode: "ADD",
        touchReaction: "BURST",
        primaryColor: "#9D00FF",
        secondaryColor: "#00F2FE",
        accentColor: "#FF2A6D"
    },
    sakura_bloom: {
        id: "fx_sakura_bloom",
        name: "Spring Sakura Blossom Petals",
        particleShape: "PETAL",
        particleCount: 40,
        speedMultiplier: 0.85,
        gravityY: 0.25,
        windDriftX: 0.25,
        waveOscillationFreq: 1.2,
        waveOscillationAmplitude: 18,
        particleSize: 14,
        glowIntensity: 1.1,
        blendMode: "SCREEN",
        touchReaction: "SCATTER",
        primaryColor: "#FFB7C5",
        secondaryColor: "#FF8DA1",
        accentColor: "#FFFFFF"
    },
    quantum_rings: {
        id: "fx_quantum_hyper_ring",
        name: "Quantum Hyper Rings",
        particleShape: "RING",
        particleCount: 32,
        speedMultiplier: 0.95,
        gravityY: -0.15,
        windDriftX: 0.05,
        waveOscillationFreq: 1.4,
        waveOscillationAmplitude: 20,
        particleSize: 18,
        glowIntensity: 1.35,
        blendMode: "SCREEN",
        touchReaction: "RIPPLE",
        primaryColor: "#FFB300",
        secondaryColor: "#FF2A6D",
        accentColor: "#00F2FE"
    },
    summer_fireflies: {
        id: "fx_golden_fireflies",
        name: "Golden Summer Fireflies",
        particleShape: "CIRCLE",
        particleCount: 45,
        speedMultiplier: 0.7,
        gravityY: -0.05,
        windDriftX: 0.05,
        waveOscillationFreq: 1.8,
        waveOscillationAmplitude: 15,
        particleSize: 10,
        glowIntensity: 1.4,
        blendMode: "ADD",
        touchReaction: "ATTRACT",
        primaryColor: "#FFD54F",
        secondaryColor: "#FF9800",
        accentColor: "#FFFFFF"
    }
};

function initEffectStudio() {
    const canvas = document.getElementById('fx-studio-canvas');
    const phone = document.getElementById('fx-studio-mockup');
    if (!canvas || !phone) return;

    fxStudioState.canvas = canvas;
    fxStudioState.ctx = canvas.getContext('2d');

    // 1. Mouse & Tilt Tracking
    phone.addEventListener('mousemove', (e) => {
        if (fxStudioState.autoOrbit) return;
        const rect = phone.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        fxStudioState.targetMouseX = nx;
        fxStudioState.targetMouseY = ny;

        const rotY = nx * 24;
        const rotX = -ny * 24;
        phone.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    phone.addEventListener('mouseleave', () => {
        if (fxStudioState.autoOrbit) return;
        fxStudioState.targetMouseX = 0;
        fxStudioState.targetMouseY = 0;
        phone.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Touch / Click Reaction on Canvas
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const reaction = fxStudioState.touchReaction;

        if (reaction === 'RIPPLE') {
            fxStudioState.shockwaves.push({ x, y, radius: 4, alpha: 240 });
        } else if (reaction === 'BURST') {
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 220 + 80;
                fxStudioState.sparks.push({
                    x, y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    alpha: 1.0,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.5 ? fxStudioState.primaryColor : fxStudioState.secondaryColor
                });
            }
        } else if (reaction === 'SCATTER') {
            fxStudioState.particles.forEach(p => {
                const dx = p.x - x;
                const dy = p.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140 && dist > 1) {
                    p.x += (dx / dist) * 60;
                    p.y += (dy / dist) * 60;
                }
            });
        } else if (reaction === 'ATTRACT') {
            fxStudioState.particles.forEach(p => {
                const dx = x - p.x;
                const dy = y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    p.x += (dx / dist) * 35;
                    p.y += (dy / dist) * 35;
                }
            });
        }
    });

    // Orbit button
    document.getElementById('btn-fx-orbit')?.addEventListener('click', () => {
        fxStudioState.autoOrbit = !fxStudioState.autoOrbit;
        document.getElementById('btn-fx-orbit').classList.toggle('active', fxStudioState.autoOrbit);
        if (!fxStudioState.autoOrbit) {
            phone.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
    });

    // Reset button
    document.getElementById('btn-fx-reset-view')?.addEventListener('click', () => {
        fxStudioState.autoOrbit = false;
        fxStudioState.targetMouseX = 0;
        fxStudioState.targetMouseY = 0;
        phone.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        resetFxStudioParticles();
    });

    // 2. Background Selector
    document.getElementById('fx-preview-bg')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'DARK') {
            fxStudioState.bgImage = null;
        } else {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { fxStudioState.bgImage = img; };
            if (val === 'DANDELION') img.src = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&q=80';
            else if (val === 'SKY') img.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&q=80';
            else if (val === 'NEON') img.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1080&q=80';
            else if (val === 'NATURE') img.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80';
        }
    });

    // 3. Preset Template Loader
    document.getElementById('fx-template-select')?.addEventListener('change', (e) => {
        const tpl = FX_TEMPLATES[e.target.value];
        if (tpl) {
            applyFxObjectToStudio(tpl);
        }
    });

    // 4. Sliders & Inputs Binding (Two-Way Sync with Code Editor)
    bindFxSlider('fx-count', 'val-fx-count', v => fxStudioState.particleCount = parseInt(v), '', resetFxStudioParticles);
    bindFxSlider('fx-speed', 'val-fx-speed', v => fxStudioState.speedMultiplier = parseFloat(v), 'x');
    bindFxSlider('fx-gravity-y', 'val-fx-gravity-y', v => fxStudioState.gravityY = parseFloat(v));
    bindFxSlider('fx-wind', 'val-fx-wind', v => fxStudioState.windDriftX = parseFloat(v));
    bindFxSlider('fx-osc-freq', 'val-fx-osc-freq', v => fxStudioState.waveOscillationFreq = parseFloat(v));
    bindFxSlider('fx-osc-amp', 'val-fx-osc-amp', v => fxStudioState.waveOscillationAmplitude = parseInt(v), 'px');
    bindFxSlider('fx-size', 'val-fx-size', v => fxStudioState.particleSize = parseInt(v), 'px');
    bindFxSlider('fx-glow', 'val-fx-glow', v => fxStudioState.glowIntensity = parseFloat(v), 'x');

    document.getElementById('fx-shape')?.addEventListener('change', (e) => {
        fxStudioState.particleShape = e.target.value;
        syncFxStateToCodeEditor();
    });

    document.getElementById('fx-blend')?.addEventListener('change', (e) => {
        fxStudioState.blendMode = e.target.value;
        syncFxStateToCodeEditor();
    });

    document.getElementById('fx-touch-reaction')?.addEventListener('change', (e) => {
        fxStudioState.touchReaction = e.target.value;
        syncFxStateToCodeEditor();
    });

    document.getElementById('fx-custom-id')?.addEventListener('input', (e) => {
        fxStudioState.id = e.target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        syncFxStateToCodeEditor();
    });

    document.getElementById('fx-custom-name')?.addEventListener('input', (e) => {
        fxStudioState.name = e.target.value.trim();
        syncFxStateToCodeEditor();
    });

    document.getElementById('fx-color-pri')?.addEventListener('input', (e) => {
        fxStudioState.primaryColor = e.target.value;
        syncFxStateToCodeEditor();
    });
    document.getElementById('fx-color-sec')?.addEventListener('input', (e) => {
        fxStudioState.secondaryColor = e.target.value;
        syncFxStateToCodeEditor();
    });
    document.getElementById('fx-color-acc')?.addEventListener('input', (e) => {
        fxStudioState.accentColor = e.target.value;
        syncFxStateToCodeEditor();
    });

    // 5. Code Editor Actions
    document.getElementById('btn-fx-format-code')?.addEventListener('click', () => {
        try {
            const raw = document.getElementById('fx-code-editor').value;
            const parsed = JSON.parse(raw);
            document.getElementById('fx-code-editor').value = JSON.stringify(parsed, null, 2);
        } catch (err) {
            alert('⚠️ Invalid JSON: ' + err.message);
        }
    });

    document.getElementById('btn-fx-copy-code')?.addEventListener('click', () => {
        const raw = document.getElementById('fx-code-editor').value;
        navigator.clipboard.writeText(raw);
        alert('📋 Effect JSON copied to clipboard!');
    });

    document.getElementById('btn-fx-apply-code')?.addEventListener('click', () => {
        try {
            const raw = document.getElementById('fx-code-editor').value;
            const parsed = JSON.parse(raw);
            applyFxObjectToStudio(parsed);
            alert('⚡ Code successfully applied to live preview and studio controls!');
        } catch (err) {
            alert('⚠️ Code error: ' + err.message);
        }
    });

    // 6. Action Hub Buttons
    document.getElementById('btn-fx-save-library')?.addEventListener('click', () => {
        saveCurrentFxToLibrary();
    });

    document.getElementById('btn-fx-create-wp')?.addEventListener('click', () => {
        createWallpaperWithCurrentFx();
    });

    document.getElementById('btn-fx-push-github')?.addEventListener('click', async () => {
        await pushEffectsToGitHub();
    });

    // 7. Initial setup
    resetFxStudioParticles();
    syncFxStateToCodeEditor();
    renderCustomEffectsLibrary();

    // 8. Start Studio 60 FPS Render Loop
    startFxStudioLoop();
}

function bindFxSlider(id, valId, callback, unit = '', onFinish = null) {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (!el || !valEl) return;

    el.addEventListener('input', (e) => {
        valEl.innerText = `${e.target.value}${unit}`;
        callback(e.target.value);
        syncFxStateToCodeEditor();
        if (onFinish) onFinish();
    });
}

function resetFxStudioParticles() {
    const w = fxStudioState.canvas?.width || 360;
    const h = fxStudioState.canvas?.height || 720;
    fxStudioState.particles = [];
    fxStudioState.shockwaves = [];
    fxStudioState.sparks = [];

    const count = fxStudioState.particleCount || 40;
    const colors = [fxStudioState.primaryColor, fxStudioState.secondaryColor, fxStudioState.accentColor, '#FFFFFF'];

    for (let i = 0; i < count; i++) {
        fxStudioState.particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: fxStudioState.particleSize * (0.7 + Math.random() * 0.6),
            speedX: (Math.random() - 0.5) * 20,
            speedY: Math.random() * 30 + 15,
            depth: Math.random() * 0.9 + 0.1,
            alpha: Math.random() * 0.7 + 0.3,
            phase: Math.random() * Math.PI * 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 60,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function syncFxStateToCodeEditor() {
    const model = {
        id: fxStudioState.id,
        name: fxStudioState.name,
        particleCount: fxStudioState.particleCount,
        particleShape: fxStudioState.particleShape,
        speedMultiplier: fxStudioState.speedMultiplier,
        gravityY: fxStudioState.gravityY,
        windDriftX: fxStudioState.windDriftX,
        waveOscillationFreq: fxStudioState.waveOscillationFreq,
        waveOscillationAmplitude: fxStudioState.waveOscillationAmplitude,
        particleSize: fxStudioState.particleSize,
        glowIntensity: fxStudioState.glowIntensity,
        blendMode: fxStudioState.blendMode,
        touchReaction: fxStudioState.touchReaction,
        primaryColor: fxStudioState.primaryColor,
        secondaryColor: fxStudioState.secondaryColor,
        accentColor: fxStudioState.accentColor,
        primaryColorArgb: hexToArgbInt(fxStudioState.primaryColor),
        secondaryColorArgb: hexToArgbInt(fxStudioState.secondaryColor),
        accentColorArgb: hexToArgbInt(fxStudioState.accentColor)
    };

    const editor = document.getElementById('fx-code-editor');
    if (editor && document.activeElement !== editor) {
        editor.value = JSON.stringify(model, null, 2);
    }
}

function applyFxObjectToStudio(obj) {
    if (!obj) return;
    if (obj.id) fxStudioState.id = obj.id;
    if (obj.name) fxStudioState.name = obj.name;
    if (obj.particleCount) fxStudioState.particleCount = obj.particleCount;
    if (obj.particleShape) fxStudioState.particleShape = obj.particleShape;
    if (obj.speedMultiplier !== undefined) fxStudioState.speedMultiplier = obj.speedMultiplier;
    if (obj.gravityY !== undefined) fxStudioState.gravityY = obj.gravityY;
    if (obj.windDriftX !== undefined) fxStudioState.windDriftX = obj.windDriftX;
    if (obj.waveOscillationFreq !== undefined) fxStudioState.waveOscillationFreq = obj.waveOscillationFreq;
    if (obj.waveOscillationAmplitude !== undefined) fxStudioState.waveOscillationAmplitude = obj.waveOscillationAmplitude;
    if (obj.particleSize !== undefined) fxStudioState.particleSize = obj.particleSize;
    if (obj.glowIntensity !== undefined) fxStudioState.glowIntensity = obj.glowIntensity;
    if (obj.blendMode) fxStudioState.blendMode = obj.blendMode;
    if (obj.touchReaction) fxStudioState.touchReaction = obj.touchReaction;
    if (obj.primaryColor) fxStudioState.primaryColor = obj.primaryColor;
    else if (obj.primaryColorArgb) fxStudioState.primaryColor = argbIntToHex(obj.primaryColorArgb);
    if (obj.secondaryColor) fxStudioState.secondaryColor = obj.secondaryColor;
    else if (obj.secondaryColorArgb) fxStudioState.secondaryColor = argbIntToHex(obj.secondaryColorArgb);
    if (obj.accentColor) fxStudioState.accentColor = obj.accentColor;
    else if (obj.accentColorArgb) fxStudioState.accentColor = argbIntToHex(obj.accentColorArgb);

    // Update UI controls
    setSliderVal('fx-count', 'val-fx-count', fxStudioState.particleCount, '');
    setSliderVal('fx-speed', 'val-fx-speed', fxStudioState.speedMultiplier, 'x');
    setSliderVal('fx-gravity-y', 'val-fx-gravity-y', fxStudioState.gravityY, '');
    setSliderVal('fx-wind', 'val-fx-wind', fxStudioState.windDriftX, '');
    setSliderVal('fx-osc-freq', 'val-fx-osc-freq', fxStudioState.waveOscillationFreq, '');
    setSliderVal('fx-osc-amp', 'val-fx-osc-amp', fxStudioState.waveOscillationAmplitude, 'px');
    setSliderVal('fx-size', 'val-fx-size', fxStudioState.particleSize, 'px');
    setSliderVal('fx-glow', 'val-fx-glow', fxStudioState.glowIntensity, 'x');

    const shapeSelect = document.getElementById('fx-shape');
    if (shapeSelect) shapeSelect.value = fxStudioState.particleShape;
    const blendSelect = document.getElementById('fx-blend');
    if (blendSelect) blendSelect.value = fxStudioState.blendMode;
    const touchSelect = document.getElementById('fx-touch-reaction');
    if (touchSelect) touchSelect.value = fxStudioState.touchReaction;

    const idInput = document.getElementById('fx-custom-id');
    if (idInput) idInput.value = fxStudioState.id;
    const nameInput = document.getElementById('fx-custom-name');
    if (nameInput) nameInput.value = fxStudioState.name;

    const priCol = document.getElementById('fx-color-pri');
    if (priCol) priCol.value = fxStudioState.primaryColor;
    const secCol = document.getElementById('fx-color-sec');
    if (secCol) secCol.value = fxStudioState.secondaryColor;
    const accCol = document.getElementById('fx-color-acc');
    if (accCol) accCol.value = fxStudioState.accentColor;

    resetFxStudioParticles();
    syncFxStateToCodeEditor();
}

function setSliderVal(id, valId, val, unit = '') {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (el) el.value = val;
    if (valEl) valEl.innerText = `${val}${unit}`;
}

function saveCurrentFxToLibrary() {
    const item = {
        id: fxStudioState.id || `fx_${Date.now()}`,
        name: fxStudioState.name || 'Untitled Custom Effect',
        particleCount: fxStudioState.particleCount,
        particleShape: fxStudioState.particleShape,
        speedMultiplier: fxStudioState.speedMultiplier,
        gravityY: fxStudioState.gravityY,
        windDriftX: fxStudioState.windDriftX,
        waveOscillationFreq: fxStudioState.waveOscillationFreq,
        waveOscillationAmplitude: fxStudioState.waveOscillationAmplitude,
        particleSize: fxStudioState.particleSize,
        glowIntensity: fxStudioState.glowIntensity,
        blendMode: fxStudioState.blendMode,
        touchReaction: fxStudioState.touchReaction,
        primaryColor: fxStudioState.primaryColor,
        secondaryColor: fxStudioState.secondaryColor,
        accentColor: fxStudioState.accentColor,
        primaryColorArgb: hexToArgbInt(fxStudioState.primaryColor),
        secondaryColorArgb: hexToArgbInt(fxStudioState.secondaryColor),
        accentColorArgb: hexToArgbInt(fxStudioState.accentColor),
        updated_at: Date.now()
    };

    if (!state.customEffects) state.customEffects = [];
    const idx = state.customEffects.findIndex(e => e.id === item.id);
    if (idx >= 0) state.customEffects[idx] = item;
    else state.customEffects.unshift(item);

    localStorage.setItem('lively_custom_effects', JSON.stringify(state.customEffects));
    renderCustomEffectsLibrary();
    alert(`💾 Effect "${item.name}" saved to your local studio library!`);
}

function renderCustomEffectsLibrary() {
    const container = document.getElementById('fx-library-container');
    const countEl = document.getElementById('fx-library-count');
    if (!container) return;

    const list = state.customEffects || [];
    if (countEl) countEl.innerText = list.length;
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; grid-column: 1/-1;">No custom effects saved yet. Customize parameters above and click "Save to Library"!</div>';
        return;
    }

    list.forEach(fx => {
        const card = document.createElement('div');
        card.style.background = 'rgba(0, 0, 0, 0.35)';
        card.style.border = '1px solid rgba(0, 242, 254, 0.2)';
        card.style.borderRadius = '12px';
        card.style.padding = '14px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        card.style.gap = '8px';

        card.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #FFF; font-size: 13px;">${escapeHtml(fx.name)}</strong>
                    <span class="tab-badge" style="background: rgba(0,242,254,0.15); color: var(--neon-cyan);">${escapeHtml(fx.particleShape)}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-muted); line-height: 1.5;">
                    • ID: <code>${escapeHtml(fx.id)}</code><br>
                    • Count: ${fx.particleCount} • Speed: ${fx.speedMultiplier}x<br>
                    • Blend: ${escapeHtml(fx.blendMode)}
                </div>
                <div style="display: flex; gap: 4px; margin-top: 6px;">
                    <span style="width: 14px; height: 14px; border-radius: 50%; background: ${fx.primaryColor || '#FFF'}; display: inline-block;"></span>
                    <span style="width: 14px; height: 14px; border-radius: 50%; background: ${fx.secondaryColor || '#00F2FE'}; display: inline-block;"></span>
                    <span style="width: 14px; height: 14px; border-radius: 50%; background: ${fx.accentColor || '#9D00FF'}; display: inline-block;"></span>
                </div>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 8px;">
                <button type="button" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="loadCustomEffectIntoStudio('${fx.id}')">⚡ Load</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="exportSingleFxJson('${fx.id}')">📥 JSON</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteCustomEffect('${fx.id}')">✕</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Also update dynamic chips in Wallpaper Studio particle selector
    updateWallpaperParticleChips();
}

window.loadCustomEffectIntoStudio = function(id) {
    const fx = state.customEffects?.find(e => e.id === id);
    if (fx) {
        applyFxObjectToStudio(fx);
        switchTab('tab-effect-studio');
    }
};

window.exportSingleFxJson = function(id) {
    const fx = state.customEffects?.find(e => e.id === id);
    if (!fx) return;
    const blob = new Blob([JSON.stringify(fx, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fx.id}.json`;
    a.click();
};

window.deleteCustomEffect = function(id) {
    if (!confirm('Are you sure you want to delete this custom effect?')) return;
    state.customEffects = state.customEffects.filter(e => e.id !== id);
    localStorage.setItem('lively_custom_effects', JSON.stringify(state.customEffects));
    renderCustomEffectsLibrary();
};

function updateWallpaperParticleChips() {
    const selector = document.getElementById('particle-selector');
    if (!selector) return;

    // Remove existing custom chips
    selector.querySelectorAll('.custom-dyn-chip').forEach(el => el.remove());

    // Append dynamic chips
    (state.customEffects || []).forEach(fx => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'particle-chip custom-dyn-chip';
        chip.setAttribute('data-effect', fx.id);
        chip.innerText = `✨ ${fx.name}`;
        chip.addEventListener('click', () => {
            selector.querySelectorAll('.particle-chip').forEach(b => b.classList.remove('active'));
            chip.classList.add('active');
            state.currentEffect = fx.id;
            const canvas = document.getElementById('motion-canvas');
            if (canvas) initParticles(canvas.width, canvas.height);
        });
        selector.appendChild(chip);
    });
}

function createWallpaperWithCurrentFx() {
    saveCurrentFxToLibrary();
    switchTab('tab-wallpapers');

    const wpTitleInput = document.getElementById('wp-title');
    if (wpTitleInput) wpTitleInput.value = `${fxStudioState.name} Live`;

    setWallpaperMode('CUSTOM_PHOTO_MOTION');
    state.currentEffect = fxStudioState.id;

    state.primaryColor = fxStudioState.primaryColor;
    state.secondaryColor = fxStudioState.secondaryColor;
    state.accentColor = fxStudioState.accentColor;

    const cp = document.getElementById('color-primary');
    if (cp) cp.value = state.primaryColor;
    const cs = document.getElementById('color-secondary');
    if (cs) cs.value = state.secondaryColor;
    const ca = document.getElementById('color-accent');
    if (ca) ca.value = state.accentColor;

    updateWallpaperParticleChips();

    const targetChip = document.querySelector(`#particle-selector .particle-chip[data-effect="${fxStudioState.id}"]`);
    if (targetChip) {
        document.querySelectorAll('#particle-selector .particle-chip').forEach(b => b.classList.remove('active'));
        targetChip.classList.add('active');
    }

    const canvas = document.getElementById('motion-canvas');
    if (canvas) initParticles(canvas.width, canvas.height);
}

function startFxStudioLoop() {
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTime = performance.now();

    function loop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.033);
        lastTime = now;

        const canvas = fxStudioState.canvas;
        const ctx = fxStudioState.ctx;
        if (!canvas || !ctx) {
            requestAnimationFrame(loop);
            return;
        }

        // Auto Orbit
        if (fxStudioState.autoOrbit) {
            fxStudioState.orbitTime += dt * 1.5;
            fxStudioState.targetMouseX = Math.sin(fxStudioState.orbitTime) * 0.45;
            fxStudioState.targetMouseY = Math.cos(fxStudioState.orbitTime * 0.8) * 0.35;
            const rotY = fxStudioState.targetMouseX * 20;
            const rotX = -fxStudioState.targetMouseY * 20;
            const phone = document.getElementById('fx-studio-mockup');
            if (phone) phone.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        }

        // Smooth Gyro
        fxStudioState.smoothRoll += (fxStudioState.targetMouseX - fxStudioState.smoothRoll) * (dt * 8.0);
        fxStudioState.smoothPitch += (fxStudioState.targetMouseY - fxStudioState.smoothPitch) * (dt * 8.0);

        const panX = -fxStudioState.smoothRoll * 70;
        const panY = -fxStudioState.smoothPitch * 55;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // 1. Background
        if (fxStudioState.bgImage && fxStudioState.bgImage.complete) {
            ctx.save();
            const img = fxStudioState.bgImage;
            const scale = Math.max((w * 1.2) / img.width, (h * 1.2) / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            ctx.drawImage(img, (w - dw) / 2 + panX, (h - dh) / 2 + panY, dw, dh);
            ctx.restore();
        } else {
            const grad = ctx.createLinearGradient(panX * 0.5, panY * 0.5, w + panX * 0.5, h + panY * 0.5);
            grad.addColorStop(0, '#060A16');
            grad.addColorStop(0.5, hexToRgba(fxStudioState.secondaryColor, 0.35));
            grad.addColorStop(1, '#05020B');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        // 2. Draw Effect using Custom Dynamic Drawer
        drawDynamicCustomEffect(ctx, w, h, dt, panX, panY, fxStudioState);

        // 3. Draw Shockwaves
        for (let i = fxStudioState.shockwaves.length - 1; i >= 0; i--) {
            const sw = fxStudioState.shockwaves[i];
            sw.radius += dt * 320;
            sw.alpha -= dt * 260;
            if (sw.alpha <= 0) {
                fxStudioState.shockwaves.splice(i, 1);
            } else {
                ctx.save();
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(fxStudioState.primaryColor, sw.alpha / 255);
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.restore();
            }
        }

        // 4. Draw Burst Sparks
        for (let i = fxStudioState.sparks.length - 1; i >= 0; i--) {
            const sp = fxStudioState.sparks[i];
            sp.x += sp.vx * dt;
            sp.y += sp.vy * dt;
            sp.alpha -= dt * 1.8;
            if (sp.alpha <= 0) {
                fxStudioState.sparks.splice(i, 1);
            } else {
                ctx.save();
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(sp.color, sp.alpha);
                ctx.fill();
                ctx.restore();
            }
        }

        // FPS
        frameCount++;
        if (now - fpsTime >= 1000) {
            const fpsEl = document.getElementById('fx-fps');
            if (fpsEl) fpsEl.innerText = `${frameCount} FPS`;
            frameCount = 0;
            fpsTime = now;
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// ==============================================================================
// GITHUB CLOUD REALTIME BACKEND & API SYNC
// ==============================================================================
function initGitHubBackendManager() {
    const repoInput = document.getElementById('gh-repo');
    const branchInput = document.getElementById('gh-branch');
    const pathInput = document.getElementById('gh-path');
    const tokenInput = document.getElementById('gh-token');

    if (repoInput) repoInput.value = state.githubRepo || 'abirvai001/lively-engine-admin';
    if (branchInput) branchInput.value = state.githubBranch || 'main';
    if (pathInput) pathInput.value = state.githubPath || 'catalog.json';
    if (tokenInput) tokenInput.value = state.githubToken || '';

    // Save Settings
    document.getElementById('btn-gh-save-config')?.addEventListener('click', () => {
        state.githubRepo = repoInput.value.trim();
        state.githubBranch = branchInput.value.trim() || 'main';
        state.githubPath = pathInput.value.trim() || 'catalog.json';
        state.githubToken = tokenInput.value.trim();

        localStorage.setItem('lively_gh_repo', state.githubRepo);
        localStorage.setItem('lively_gh_branch', state.githubBranch);
        localStorage.setItem('lively_gh_path', state.githubPath);
        localStorage.setItem('lively_gh_token', state.githubToken);

        const ind = document.getElementById('gh-status-indicator');
        if (ind) {
            ind.innerText = 'Settings Saved';
            ind.style.color = 'var(--success-green)';
        }
        alert('💾 GitHub Backend settings saved locally!');
    });

    // Test Connection
    document.getElementById('btn-gh-test')?.addEventListener('click', async () => {
        await testGitHubConnection();
    });

    // 1-Click Sync All to GitHub
    document.getElementById('btn-gh-sync-all')?.addEventListener('click', async () => {
        await commitCatalogToGitHub();
    });

    // Download catalog.json
    document.getElementById('btn-gh-download-catalog')?.addEventListener('click', () => {
        const bundle = generateFullCatalogBundle();
        downloadJsonFile(bundle, 'catalog.json');
    });

    // Download effects.json
    document.getElementById('btn-gh-download-effects')?.addEventListener('click', () => {
        downloadJsonFile(state.customEffects || [], 'effects.json');
    });

    updateGitHubStatusDisplay();
}

function updateGitHubStatusDisplay() {
    const details = document.getElementById('gh-status-details');
    if (!details) return;

    const rawUrl = `https://raw.githubusercontent.com/${state.githubRepo || 'abirvai001/lively-engine-admin'}/${state.githubBranch || 'main'}/${state.githubPath || 'catalog.json'}`;
    const wpCount = state.wallpapers?.length || 0;
    const fxCount = state.customEffects?.length || 0;

    details.innerHTML = `
        • Target Raw CDN: <a href="${rawUrl}" target="_blank" style="color: var(--neon-cyan); word-break: break-all;">${rawUrl}</a><br>
        • Ready to deploy: <strong>${wpCount}</strong> Wallpapers (incl. Retro Legends) & <strong>${fxCount}</strong> Dynamic Effects.<br>
        • Auth: ${state.githubToken ? '<span style="color: var(--success-green);">PAT Configured (Commit API Ready)</span>' : '<span style="color: var(--plasma-amber);">No PAT (Read-Only / Manual Download)</span>'}
    `;
}

async function testGitHubConnection() {
    const repo = document.getElementById('gh-repo')?.value.trim() || state.githubRepo;
    const token = document.getElementById('gh-token')?.value.trim() || state.githubToken;
    const ind = document.getElementById('gh-status-indicator');
    const details = document.getElementById('gh-status-details');

    if (!repo || !repo.includes('/')) {
        alert('Please enter a valid GitHub repository in "owner/repo" format (e.g. abirvai001/lively-engine-admin).');
        return;
    }

    if (ind) {
        ind.innerText = 'Connecting...';
        ind.style.color = 'var(--plasma-amber)';
    }

    try {
        const headers = { 'Accept': 'application/vnd.github.v3+json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
        if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (ind) {
            ind.innerText = 'Connected & Active';
            ind.style.color = 'var(--success-green)';
        }

        if (details) {
            details.innerHTML = `
                • Repo: <strong>${escapeHtml(data.full_name)}</strong> (${data.private ? '🔒 Private' : '🌍 Public'})<br>
                • Default Branch: <code>${escapeHtml(data.default_branch)}</code> • Stars: ${data.stargazers_count}<br>
                • Push Permission: <strong>${data.permissions?.push ? '✅ YES (Can Commit via API)' : (token ? '⚠️ Limited Permissions' : '❌ Read-Only (Token required to push)')}</strong><br>
                • Raw CDN Target: https://raw.githubusercontent.com/${repo}/${state.githubBranch}/${state.githubPath}
            `;
        }

        alert(`✅ Connected to GitHub repository "${data.full_name}"!`);
    } catch (err) {
        if (ind) {
            ind.innerText = 'Connection Failed';
            ind.style.color = 'var(--cyber-pink)';
        }
        if (details) {
            details.innerHTML = `• Error: <span style="color: var(--cyber-pink);">${escapeHtml(err.message)}</span><br>• Check repository name and personal access token permissions.`;
        }
        alert(`❌ GitHub connection failed: ${err.message}`);
    }
}

function generateFullCatalogBundle() {
    return {
        version: 1,
        generated_by: "Lively Engine Studio",
        last_updated: new Date().toISOString(),
        categories: state.categories,
        wallpapers: state.wallpapers,
        banners: state.banners,
        app_updates: [state.appUpdate],
        notifications: state.notifications,
        dev_info: state.devInfo,
        effects: state.customEffects || []
    };
}

async function commitCatalogToGitHub() {
    const repo = state.githubRepo || document.getElementById('gh-repo')?.value.trim();
    const branch = state.githubBranch || document.getElementById('gh-branch')?.value.trim() || 'main';
    const path = state.githubPath || document.getElementById('gh-path')?.value.trim() || 'catalog.json';
    const token = state.githubToken || document.getElementById('gh-token')?.value.trim();

    if (!token) {
        if (confirm('A GitHub Personal Access Token (PAT) is required to commit directly through the API. Would you like to download catalog.json offline instead?')) {
            downloadJsonFile(generateFullCatalogBundle(), 'catalog.json');
        }
        return;
    }

    const ind = document.getElementById('gh-status-indicator');
    if (ind) {
        ind.innerText = 'Pushing to GitHub...';
        ind.style.color = 'var(--plasma-amber)';
    }

    try {
        const bundle = generateFullCatalogBundle();
        const jsonStr = JSON.stringify(bundle, null, 2);
        // Base64 UTF-8 safe encode
        const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 1. Get existing file SHA if present
        let existingSha = null;
        try {
            const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, { headers });
            if (getRes.ok) {
                const fileData = await getRes.json();
                existingSha = fileData.sha;
            }
        } catch (e) {}

        // 2. Commit file via PUT
        const putPayload = {
            message: `Update Lively Engine catalog & particle effects via Admin Studio (${new Date().toLocaleTimeString()})`,
            content: base64Content,
            branch: branch
        };
        if (existingSha) putPayload.sha = existingSha;

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(putPayload)
        });

        if (!putRes.ok) {
            const errData = await putRes.json().catch(() => ({}));
            throw new Error(errData.message || `HTTP ${putRes.status}`);
        }

        const resData = await putRes.json();
        if (ind) {
            ind.innerText = '✅ Synced to GitHub!';
            ind.style.color = 'var(--success-green)';
        }

        const commitUrl = resData.commit?.html_url || `https://github.com/${repo}/commits/${branch}`;
        const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;

        const details = document.getElementById('gh-status-details');
        if (details) {
            details.innerHTML = `
                • Commit: <a href="${commitUrl}" target="_blank" style="color: var(--neon-cyan); font-weight: 700;">View Commit on GitHub ↗</a><br>
                • Synced At: <strong>${new Date().toLocaleTimeString()}</strong> • File: <code>${path}</code><br>
                • Live CDN: <a href="${rawUrl}" target="_blank" style="color: var(--neon-cyan);">${rawUrl}</a><br>
                • Client mobile app will automatically stream these updates instantly!
            `;
        }

        alert(`🚀 Success! Catalog and particle effects pushed directly to GitHub!\nCommit: ${commitUrl}`);
    } catch (err) {
        if (ind) {
            ind.innerText = 'Push Failed';
            ind.style.color = 'var(--cyber-pink)';
        }
        alert(`❌ Failed to push to GitHub: ${err.message}`);
    }
}

async function pushEffectsToGitHub() {
    await commitCatalogToGitHub();
}

function downloadJsonFile(dataObj, filename) {
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}


