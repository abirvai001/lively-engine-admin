/**
 * MotionCraft Web Admin Panel & Live Particle Simulator
 */

// Default Showcase Wallpapers
const DEFAULT_CATALOG = [
    {
        id: "season_sakura_01",
        title: "Spring Sakura Blossom",
        category: "SEASONS",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Delicate 5-lobed pink sakura cherry blossom petals fluttering gracefully with 3D wind aerodynamics.",
        resolution: "4K HDR",
        tags: ["Spring", "Sakura", "Blossom", "Nature"],
        photoDataUri: null,
        config: {
            speedMultiplier: 0.9,
            particleDensity: 1.1,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.1,
            primaryColorArgb: 0xFFFFB7C5,
            secondaryColorArgb: 0xFFFF8DA1,
            accentColorArgb: 0xFFFF4081,
            particleEffectType: "SPRING_SAKURA",
            touchInteractive: true
        }
    },
    {
        id: "season_fireflies_01",
        title: "Summer Twilight Fireflies",
        category: "SEASONS",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Warm golden twilight sunbeams with glowing bioluminescent fireflies pulsating softly in summer dusk.",
        resolution: "4K Ultra HD",
        tags: ["Summer", "Fireflies", "Golden", "Twilight"],
        photoDataUri: null,
        config: {
            speedMultiplier: 0.95,
            particleDensity: 1.1,
            parallaxSensitivity: 1.3,
            glowIntensity: 1.3,
            primaryColorArgb: 0xFFFFF176,
            secondaryColorArgb: 0xFFFFB300,
            accentColorArgb: 0xFFFF8F00,
            particleEffectType: "SUMMER_FIREFLIES",
            touchInteractive: true
        }
    },
    {
        id: "weather_monsoon_01",
        title: "Real Monsoon Rain & Ripples",
        category: "WEATHER",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Authentic translucent falling raindrops with dynamic glass splash ripples.",
        resolution: "4K Ultra HD",
        tags: ["Rain", "Monsoon", "Water", "Ripples"],
        photoDataUri: null,
        config: {
            speedMultiplier: 1.05,
            particleDensity: 1.25,
            parallaxSensitivity: 1.2,
            glowIntensity: 1.2,
            primaryColorArgb: 0xFFD0E8FF,
            secondaryColorArgb: 0xFF80D8FF,
            accentColorArgb: 0xFF00B0FF,
            particleEffectType: "MONSOON_RAIN",
            touchInteractive: true
        }
    },
    {
        id: "weather_lightning_01",
        title: "Thunder Tempest & Lightning",
        category: "WEATHER",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Fractal branching electrical bolts with whole-screen ambient sky flash.",
        resolution: "4K 60FPS",
        tags: ["Lightning", "Thunder", "Storm", "Electric"],
        photoDataUri: null,
        config: {
            speedMultiplier: 1.2,
            particleDensity: 1.1,
            parallaxSensitivity: 1.3,
            glowIntensity: 1.4,
            primaryColorArgb: 0xFFE0E0FF,
            secondaryColorArgb: 0xFF00E5FF,
            accentColorArgb: 0xFF9D4EDD,
            particleEffectType: "THUNDER_LIGHTNING",
            touchInteractive: true
        }
    },
    {
        id: "mist_mountain_01",
        title: "Dense Rolling Mountain Fog",
        category: "MIST",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Multi-layered undulating harmonic fog layers with smooth continuous drift.",
        resolution: "4K Ultra HD",
        tags: ["Fog", "Mist", "Mountain", "Atmosphere"],
        photoDataUri: null,
        config: {
            speedMultiplier: 0.75,
            particleDensity: 1.0,
            parallaxSensitivity: 0.9,
            glowIntensity: 1.0,
            primaryColorArgb: 0xFFE0E8F0,
            secondaryColorArgb: 0xFF90A4AE,
            accentColorArgb: 0xFFB0BEC5,
            particleEffectType: "DENSE_ROLLING_FOG",
            touchInteractive: true
        }
    },
    {
        id: "mist_mystic_smoke_01",
        title: "Mystic Billowing Smoke",
        category: "MIST",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Organic rising smoke plumes that expand and diffuse with turbulent eddy dispersion.",
        resolution: "4K Ultra HD",
        tags: ["Smoke", "Mystic", "Ethereal", "Wisps"],
        photoDataUri: null,
        config: {
            speedMultiplier: 0.85,
            particleDensity: 1.15,
            parallaxSensitivity: 1.1,
            glowIntensity: 1.2,
            primaryColorArgb: 0xFFD8BFD8,
            secondaryColorArgb: 0xFF9370DB,
            accentColorArgb: 0xFF8A2BE2,
            particleEffectType: "MYSTIC_BILLOWING_SMOKE",
            touchInteractive: true
        }
    },
    {
        id: "cosmic_starlight_01",
        title: "Astral Starlight Dust",
        category: "COSMIC",
        type: "CUSTOM_PHOTO_MOTION",
        description: "Multi-depth diamond starbursts with cross-flare glints and galaxy pulsar aura.",
        resolution: "4K HDR",
        tags: ["Space", "Stars", "Starlight", "Cosmic"],
        photoDataUri: null,
        config: {
            speedMultiplier: 0.9,
            particleDensity: 1.2,
            parallaxSensitivity: 1.4,
            glowIntensity: 1.35,
            primaryColorArgb: 0xFFE0F7FA,
            secondaryColorArgb: 0xFF00E5FF,
            accentColorArgb: 0xFF7C4DFF,
            particleEffectType: "COSMIC_STARLIGHT",
            touchInteractive: true
        }
    }
];

// App State
let catalog = [];
let editingId = null;
let currentConfig = { ...DEFAULT_CATALOG[0].config };
let currentArtworkData = null;

// Gyro Simulation Coordinates
let mouseRoll = 0;
let mousePitch = 0;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadStoredCatalog();
    initUI();
    initCanvasEngine();
    renderCatalogTable();
});

function loadStoredCatalog() {
    const stored = localStorage.getItem("motioncraft_admin_catalog");
    if (stored) {
        try {
            catalog = JSON.parse(stored);
        } catch (e) {
            catalog = [...DEFAULT_CATALOG];
        }
    } else {
        catalog = [...DEFAULT_CATALOG];
        saveCatalog();
    }
}

function saveCatalog() {
    localStorage.setItem("motioncraft_admin_catalog", JSON.stringify(catalog));
}

// UI Setup & Event Listeners
function initUI() {
    // Sliders
    const bindSlider = (id, labelId, prop, unit = "x") => {
        const el = document.getElementById(id);
        const lbl = document.getElementById(labelId);
        el.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            currentConfig[prop] = val;
            lbl.textContent = `${val.toFixed(2)}${unit}`;
        });
    };

    bindSlider("input-speed", "val-speed", "speedMultiplier");
    bindSlider("input-density", "val-density", "particleDensity");
    bindSlider("input-parallax", "val-parallax", "parallaxSensitivity");
    bindSlider("input-glow", "val-glow", "glowIntensity");

    // Colors
    const bindColor = (id, prop) => {
        const el = document.getElementById(id);
        el.addEventListener("input", (e) => {
            const hex = e.target.value.replace("#", "");
            currentConfig[prop] = parseInt("FF" + hex, 16);
        });
    };

    bindColor("input-color-pri", "primaryColorArgb");
    bindColor("input-color-sec", "secondaryColorArgb");
    bindColor("input-color-acc", "accentColorArgb");

    // Particle Effect Chips
    const chips = document.querySelectorAll(".particle-chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            const fx = chip.getAttribute("data-effect");
            currentConfig.particleEffectType = fx;
            updatePresetColorsForEffect(fx);
        });
    });

    // File Upload / Dropzone
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("input-file");
    const browseBtn = document.getElementById("btn-browse-file");
    const removeBtn = document.getElementById("btn-remove-img");
    const dropLabel = document.getElementById("dropzone-label");

    browseBtn.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("click", (e) => {
        if (e.target !== removeBtn) fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });

    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentArtworkData = null;
        fileInput.value = "";
        dropLabel.textContent = "Click or drag portrait artwork here";
        removeBtn.style.display = "none";
    });

    // Form Submit (Save to Catalog)
    document.getElementById("wallpaper-form").addEventListener("submit", (e) => {
        e.preventDefault();
        savePresetFromForm();
    });

    // Reset Button
    document.getElementById("btn-reset-form").addEventListener("click", () => {
        resetForm();
    });

    // Export Single .motion
    document.getElementById("btn-export-single").addEventListener("click", () => {
        const item = buildItemFromForm();
        downloadJSON(`${item.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.motion`, item);
    });

    // Export Catalog JSON
    document.getElementById("btn-export-catalog").addEventListener("click", () => {
        downloadJSON("catalog.json", {
            version: 1,
            timestamp: new Date().toISOString(),
            wallpapers: catalog
        });
    });

    // Import JSON File
    const importInput = document.getElementById("import-json-file");
    document.getElementById("btn-import-json").addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (Array.isArray(parsed)) {
                        catalog = [...parsed, ...catalog];
                    } else if (parsed.wallpapers && Array.isArray(parsed.wallpapers)) {
                        catalog = [...parsed.wallpapers, ...catalog];
                    } else if (parsed.id && parsed.config) {
                        catalog.unshift(parsed);
                    }
                    saveCatalog();
                    renderCatalogTable();
                    alert("Import successful!");
                } catch (err) {
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    });

    // Modal Events - Setup Guide
    const modal = document.getElementById("modal-free-tier");
    document.getElementById("btn-free-tier-setup").addEventListener("click", () => modal.style.display = "flex");
    document.getElementById("btn-close-modal").addEventListener("click", () => modal.style.display = "none");
    document.getElementById("btn-modal-ok").addEventListener("click", () => modal.style.display = "none");

    // Cloud Config Modal Events
    const cloudModal = document.getElementById("modal-cloud-config");
    document.getElementById("btn-cloud-config").addEventListener("click", () => {
        loadCloudCredentials();
        cloudModal.style.display = "flex";
    });
    document.getElementById("btn-push-cloud").addEventListener("click", () => {
        loadCloudCredentials();
        cloudModal.style.display = "flex";
    });
    document.getElementById("btn-close-cloud-modal").addEventListener("click", () => cloudModal.style.display = "none");

    const providerSelect = document.getElementById("cloud-provider");
    providerSelect.addEventListener("change", (e) => {
        const prov = e.target.value;
        document.getElementById("config-fields-github").style.display = (prov === "github") ? "block" : "none";
        document.getElementById("config-fields-supabase").style.display = (prov === "supabase") ? "block" : "none";
    });

    document.getElementById("btn-save-cloud-config").addEventListener("click", () => {
        saveCloudCredentials();
        alert("Credentials saved locally!");
    });

    document.getElementById("btn-sync-now").addEventListener("click", () => {
        syncToCloudDatabase();
    });
}

function loadCloudCredentials() {
    document.getElementById("gh-repo").value = localStorage.getItem("lively_gh_repo") || "abirvai001/Lively-Engine";
    document.getElementById("gh-path").value = localStorage.getItem("lively_gh_path") || "main/catalog.json";
    document.getElementById("gh-token").value = localStorage.getItem("lively_gh_token") || "";
    document.getElementById("sb-url").value = localStorage.getItem("lively_sb_url") || "";
    document.getElementById("sb-key").value = localStorage.getItem("lively_sb_key") || "";
}

function saveCloudCredentials() {
    localStorage.setItem("lively_gh_repo", document.getElementById("gh-repo").value.trim());
    localStorage.setItem("lively_gh_path", document.getElementById("gh-path").value.trim());
    localStorage.setItem("lively_gh_token", document.getElementById("gh-token").value.trim());
    localStorage.setItem("lively_sb_url", document.getElementById("sb-url").value.trim());
    localStorage.setItem("lively_sb_key", document.getElementById("sb-key").value.trim());
}

async function syncToCloudDatabase() {
    saveCloudCredentials();
    const provider = document.getElementById("cloud-provider").value;
    const btnSync = document.getElementById("btn-sync-now");
    btnSync.textContent = "⏳ Syncing...";
    btnSync.disabled = true;

    try {
        if (provider === "github") {
            const repo = document.getElementById("gh-repo").value.trim();
            const token = document.getElementById("gh-token").value.trim();
            let path = document.getElementById("gh-path").value.trim();
            if (path.startsWith("main/")) path = path.replace("main/", "");

            if (!repo || !token) {
                alert("Please enter your GitHub Repository and Personal Access Token.");
                return;
            }

            const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
            // 1. Check if file exists to get SHA
            let sha = null;
            const getRes = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            });
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }

            // 2. Put file
            const payload = {
                message: `Update catalog.json with ${catalog.length} wallpapers [Lively Engine]`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify({ version: 1, wallpapers: catalog }, null, 2)))),
                branch: "main"
            };
            if (sha) payload.sha = sha;

            const putRes = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.github+json"
                },
                body: JSON.stringify(payload)
            });

            if (putRes.ok) {
                alert(`✅ Successfully published ${catalog.length} wallpapers to GitHub!`);
                document.getElementById("modal-cloud-config").style.display = "none";
            } else {
                const err = await putRes.json();
                alert(`GitHub Error: ${err.message || putRes.statusText}`);
            }
        } else if (provider === "supabase") {
            const sbUrl = document.getElementById("sb-url").value.trim().replace(/\/$/, "");
            const sbKey = document.getElementById("sb-key").value.trim();

            if (!sbUrl || !sbKey) {
                alert("Please enter your Supabase Project URL and Anon/Service Key.");
                return;
            }

            const restUrl = `${sbUrl}/rest/v1/wallpapers`;
            const rows = catalog.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                data: item
            }));

            const res = await fetch(restUrl, {
                method: "POST",
                headers: {
                    "apikey": sbKey,
                    "Authorization": `Bearer ${sbKey}`,
                    "Content-Type": "application/json",
                    "Prefer": "resolution=merge-duplicates"
                },
                body: JSON.stringify(rows)
            });

            if (res.ok) {
                alert(`✅ Successfully synced ${catalog.length} wallpapers to Supabase database!`);
                document.getElementById("modal-cloud-config").style.display = "none";
            } else {
                const err = await res.text();
                alert(`Supabase Error: ${err}`);
            }
        }
    } catch (e) {
        alert(`Sync Error: ${e.message}`);
    } finally {
        btnSync.textContent = "⚡ Sync Catalog to Cloud Now";
        btnSync.disabled = false;
    }
}

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        currentArtworkData = event.target.result;
        document.getElementById("dropzone-label").textContent = `✓ ${file.name} loaded`;
        document.getElementById("btn-remove-img").style.display = "inline-block";
    };
    reader.readAsDataURL(file);
}

function updatePresetColorsForEffect(fx) {
    const paletteMap = {
        "SPRING_SAKURA": ["#FFB7C5", "#FF8DA1", "#FF4081"],
        "SUMMER_FIREFLIES": ["#FFF176", "#FFB300", "#FF8F00"],
        "AUTUMN_LEAVES": ["#E65100", "#BF360C", "#FF8F00"],
        "WINTER_SNOW": ["#FFFFFF", "#80D8FF", "#00E5FF"],
        "MONSOON_RAIN": ["#D0E8FF", "#80D8FF", "#00B0FF"],
        "THUNDER_LIGHTNING": ["#E0E0FF", "#00E5FF", "#9D4EDD"],
        "DENSE_ROLLING_FOG": ["#E0E8F0", "#90A4AE", "#B0BEC5"],
        "MYSTIC_BILLOWING_SMOKE": ["#D8BFD8", "#9370DB", "#8A2BE2"],
        "COSMIC_STARLIGHT": ["#E0F7FA", "#00E5FF", "#7C4DFF"],
        "COSMIC_NEBULA": ["#00F2FE", "#8A2387", "#FF5E3A"]
    };

    if (paletteMap[fx]) {
        const [p, s, a] = paletteMap[fx];
        document.getElementById("input-color-pri").value = p;
        document.getElementById("input-color-sec").value = s;
        document.getElementById("input-color-acc").value = a;
        currentConfig.primaryColorArgb = parseInt("FF" + p.slice(1), 16);
        currentConfig.secondaryColorArgb = parseInt("FF" + s.slice(1), 16);
        currentConfig.accentColorArgb = parseInt("FF" + a.slice(1), 16);
    }
}

function buildItemFromForm() {
    const title = document.getElementById("input-title").value || "Untitled Motion";
    const category = document.getElementById("input-category").value;
    const desc = document.getElementById("input-desc").value;

    return {
        id: editingId || `custom_${Date.now()}`,
        title: title,
        category: category,
        type: "CUSTOM_PHOTO_MOTION",
        description: desc,
        resolution: "4K Ultra HD",
        tags: [category, currentConfig.particleEffectType],
        photoUriString: currentArtworkData,
        config: { ...currentConfig }
    };
}

function savePresetFromForm() {
    const item = buildItemFromForm();
    if (editingId) {
        const idx = catalog.findIndex(c => c.id === editingId);
        if (idx >= 0) catalog[idx] = item;
    } else {
        catalog.unshift(item);
    }
    saveCatalog();
    renderCatalogTable();
    resetForm();
    alert(`Saved "${item.title}" to catalog!`);
}

function resetForm() {
    editingId = null;
    document.getElementById("wallpaper-form").reset();
    document.getElementById("mode-badge").textContent = "Creating New Wallpaper";
    document.getElementById("dropzone-label").textContent = "Click or drag portrait artwork here";
    document.getElementById("btn-remove-img").style.display = "none";
    currentArtworkData = null;
}

function renderCatalogTable() {
    const tbody = document.getElementById("catalog-table-body");
    tbody.innerHTML = "";

    catalog.forEach(item => {
        const tr = document.createElement("tr");
        const priColor = "#" + (item.config?.primaryColorArgb ? (item.config.primaryColorArgb & 0xFFFFFF).toString(16).padStart(6, '0') : "00f2fe");

        tr.innerHTML = `
            <td>
                <div class="table-preview-orb" style="background: ${priColor}22; border: 1px solid ${priColor};">
                    ⚡
                </div>
            </td>
            <td><strong>${item.title}</strong></td>
            <td><span style="color: var(--neon-cyan)">${item.category}</span></td>
            <td>${item.config?.particleEffectType || "SPRING_SAKURA"}</td>
            <td>${item.config?.speedMultiplier || 1.0}x / ${item.config?.particleDensity || 1.0}x</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-secondary btn-load" data-id="${item.id}">Edit</button>
                    <button class="btn btn-sm btn-outline btn-dl" data-id="${item.id}">Export</button>
                    <button class="btn btn-sm btn-danger btn-del" data-id="${item.id}">Delete</button>
                </div>
            </td>
        `;

        tr.querySelector(".btn-load").addEventListener("click", () => loadItemIntoEditor(item));
        tr.querySelector(".btn-dl").addEventListener("click", () => downloadJSON(`${item.title}.motion`, item));
        tr.querySelector(".btn-del").addEventListener("click", () => {
            if (confirm(`Delete "${item.title}"?`)) {
                catalog = catalog.filter(c => c.id !== item.id);
                saveCatalog();
                renderCatalogTable();
            }
        });

        tbody.appendChild(tr);
    });
}

function loadItemIntoEditor(item) {
    editingId = item.id;
    document.getElementById("mode-badge").textContent = `Editing: ${item.title}`;
    document.getElementById("input-title").value = item.title;
    document.getElementById("input-category").value = item.category || "SEASONS";
    document.getElementById("input-desc").value = item.description || "";

    if (item.config) {
        currentConfig = { ...item.config };
        document.getElementById("input-speed").value = item.config.speedMultiplier || 1.0;
        document.getElementById("val-speed").textContent = `${item.config.speedMultiplier || 1.0}x`;
        document.getElementById("input-density").value = item.config.particleDensity || 1.0;
        document.getElementById("val-density").textContent = `${item.config.particleDensity || 1.0}x`;
        document.getElementById("input-parallax").value = item.config.parallaxSensitivity || 1.2;
        document.getElementById("val-parallax").textContent = `${item.config.parallaxSensitivity || 1.2}x`;
        document.getElementById("input-glow").value = item.config.glowIntensity || 1.2;
        document.getElementById("val-glow").textContent = `${item.config.glowIntensity || 1.2}x`;

        // Update active chip
        document.querySelectorAll(".particle-chip").forEach(chip => {
            if (chip.getAttribute("data-effect") === item.config.particleEffectType) {
                chip.classList.add("active");
            } else {
                chip.classList.remove("active");
            }
        });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// Interactive HTML5 Canvas Particle Physics Simulator
// -------------------------------------------------------------
function initCanvasEngine() {
    const canvas = document.getElementById("motion-canvas");
    const ctx = canvas.getContext("2d");

    // Mouse Gyro Tracking
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;
        mouseRoll = (normX - 0.5) * 2.0;
        mousePitch = (normY - 0.5) * 2.0;
    });

    canvas.addEventListener("mouseleave", () => {
        mouseRoll = 0;
        mousePitch = 0;
    });

    // Particle System
    const PARTICLE_COUNT = 60;
    let particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 2 + Math.random() * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 1.0 + Math.random() * 2.5,
            phase: Math.random() * Math.PI * 2,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05
        });
    }

    let lastTime = performance.now();

    function render(time) {
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        const w = canvas.width;
        const h = canvas.height;
        const effect = currentConfig.particleEffectType || "SPRING_SAKURA";
        const speed = currentConfig.speedMultiplier || 1.0;
        const parallax = currentConfig.parallaxSensitivity || 1.2;

        // Clear Canvas
        ctx.fillStyle = "#07090e";
        ctx.fillRect(0, 0, w, h);

        // Draw Background Image if loaded
        if (currentArtworkData) {
            // Draw Parallax Photo
            const imgOffset = mouseRoll * parallax * 15;
            ctx.save();
            ctx.fillStyle = "rgba(0, 242, 254, 0.15)";
            ctx.fillRect(20 + imgOffset, 40, w - 40, h - 80);
            ctx.restore();
        }

        // Draw Ambient Sky Glow
        const pri = "#" + (currentConfig.primaryColorArgb ? (currentConfig.primaryColorArgb & 0xFFFFFF).toString(16).padStart(6, '0') : "00f2fe");
        const sec = "#" + (currentConfig.secondaryColorArgb ? (currentConfig.secondaryColorArgb & 0xFFFFFF).toString(16).padStart(6, '0') : "8a2387");

        const grad = ctx.createRadialGradient(w / 2 + mouseRoll * 30, h / 3 + mousePitch * 30, 10, w / 2, h / 2, w);
        grad.addColorStop(0, `${pri}22`);
        grad.addColorStop(0.6, `${sec}11`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw Particles based on selected engine
        ctx.save();
        particles.forEach(p => {
            // Physics Update
            p.phase += dt * speed * 2;
            p.rot += p.rotSpeed * speed;

            const windDrift = mouseRoll * parallax * 60;

            if (effect === "MONSOON_RAIN") {
                p.y += (p.vy * 8 + 6) * speed;
                p.x += (p.vx + windDrift * 0.05);

                ctx.strokeStyle = pri;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - windDrift * 0.05, p.y + 16 * speed);
                ctx.stroke();
            } else if (effect === "THUNDER_LIGHTNING") {
                p.y += (p.vy * 7) * speed;
                p.x += p.vx;
                ctx.fillStyle = "#fff";
                ctx.fillRect(p.x, p.y, 2, 8);
            } else if (effect === "SPRING_SAKURA") {
                p.y += (p.vy * 1.5 + 0.8) * speed;
                p.x += Math.sin(p.phase) * 1.5 + (windDrift * 0.03);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = pri;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (effect === "WINTER_SNOW") {
                p.y += (p.vy * 1.2 + 0.5) * speed;
                p.x += Math.cos(p.phase) * 0.8;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Cosmic / Fireflies / Smoke
                p.y += (Math.sin(p.phase) * 0.8 - 0.5) * speed;
                p.x += (Math.cos(p.phase) * 0.8 + windDrift * 0.02);
                ctx.fillStyle = pri;
                ctx.shadowColor = pri;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }

            // Wrap boundaries
            if (p.y > h + 20) p.y = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.x < -20) p.x = w + 20;
        });
        ctx.restore();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
