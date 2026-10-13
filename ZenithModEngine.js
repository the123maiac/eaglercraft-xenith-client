window.ZenithModEngine = {
    mods: new Map(),
    enabledMods: new Set(),
    gameState: {
        player: { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, health: 20, isSprinting: false, isSneaking: false },
        entities: [],
        gamma: 1.0,
        fps: 60
    },
    init() {
        this.loadStoredMods();
        this.createModManagerUI();
    },
    register(modDefinition) {
        if (!modDefinition.id) return;
        const mod = {
            id: modDefinition.id,
            name: modDefinition.name || modDefinition.id,
            version: modDefinition.version || "1.0.0",
            description: modDefinition.description || "",
            onEnable: modDefinition.onEnable || (() => {}),
            onDisable: modDefinition.onDisable || (() => {}),
            onTick: modDefinition.onTick || (() => {}),
            onRenderHUD: modDefinition.onRenderHUD || (() => {}),
            onChat: modDefinition.onChat || ((msg) => msg)
        };
        this.mods.set(mod.id, mod);
        const savedState = localStorage.getItem("zenith_mod_" + mod.id);
        if (savedState === null || savedState === "true") {
            this.enableMod(mod.id);
        }
        this.refreshModListUI();
    },
    enableMod(id) {
        const mod = this.mods.get(id);
        if (mod && !this.enabledMods.has(id)) {
            mod.onEnable(this.createAPI(mod));
            this.enabledMods.add(id);
            localStorage.setItem("zenith_mod_" + id, "true");
        }
    },
    disableMod(id) {
        const mod = this.mods.get(id);
        if (mod && this.enabledMods.has(id)) {
            mod.onDisable();
            this.enabledMods.delete(id);
            localStorage.setItem("zenith_mod_" + id, "false");
        }
    },
    createAPI(mod) {
        return {
            getPlayer: () => ({ ...this.gameState.player }),
            setGamma: (val) => { this.gameState.gamma = val; },
            sendChat: (msg) => window.dispatchEvent(new CustomEvent("zenith_send_chat", { detail: msg }))
        };
    },
    dispatchTick() {
        this.enabledMods.forEach(id => this.mods.get(id).onTick(this.gameState));
    },
    loadCustomScript(jsCode, fileName) {
        try {
            new Function(jsCode)();
            const savedScripts = JSON.parse(localStorage.getItem("zenith_custom_scripts") || "[]");
            if (!savedScripts.includes(jsCode)) {
                savedScripts.push(jsCode);
                localStorage.setItem("zenith_custom_scripts", JSON.stringify(savedScripts));
            }
            alert("Loaded: " + fileName);
        } catch (e) {
            alert("Failed to load mod: " + e.message);
        }
    },
    loadStoredMods() {
        const savedScripts = JSON.parse(localStorage.getItem("zenith_custom_scripts") || "[]");
        savedScripts.forEach(code => {
            try { new Function(code)(); } catch (e) {}
        });
    },
    createModManagerUI() {
        const modal = document.createElement("div");
        modal.id = "zenith-mod-modal";
        modal.style.cssText = "display:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:85vw;max-width:480px;height:75vh;background:#11141c;border:1px solid #232c3d;border-radius:12px;z-index:99999;color:white;font-family:sans-serif;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,0.8);";
        modal.innerHTML = `
            <div style="padding:16px;border-bottom:1px solid #232c3d;display:flex;justify-content:space-between;align-items:center;">
                <h3 style="margin:0;color:#00ff66;">Zenith Mod Manager</h3>
                <button onclick="window.ZenithModEngine.toggleUI()" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer;">&times;</button>
            </div>
            <div id="zenith-mod-list" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;"></div>
            <div style="padding:14px;border-top:1px solid #232c3d;">
                <label style="display:block;background:#1a2233;text-align:center;padding:10px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:bold;">
                    + Import .JS Mod
                    <input type="file" accept=".js" id="zenith-file-input" style="display:none;">
                </label>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById("zenith-file-input").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => this.loadCustomScript(evt.target.result, file.name);
            reader.readAsText(file);
        });
    },
    toggleUI() {
        const modal = document.getElementById("zenith-mod-modal");
        const isOpen = modal.style.display === "flex";
        modal.style.display = isOpen ? "none" : "flex";
        if (!isOpen) this.refreshModListUI();
    },
    refreshModListUI() {
        const list = document.getElementById("zenith-mod-list");
        if (!list) return;
        list.innerHTML = "";
        this.mods.forEach((mod, id) => {
            const isEnabled = this.enabledMods.has(id);
            const item = document.createElement("div");
            item.style.cssText = "background:#181d28;padding:12px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;";
            item.innerHTML = `
                <div>
                    <div style="font-weight:bold;font-size:14px;">${mod.name}</div>
                    <div style="font-size:12px;color:#8c97a8;">${mod.description}</div>
                </div>
                <button id="toggle-btn-${id}" style="background:${isEnabled ? '#00ff66' : '#2c3345'};color:${isEnabled ? '#000' : '#fff'};border:none;padding:6px 14px;border-radius:20px;font-weight:bold;cursor:pointer;">
                    ${isEnabled ? 'ON' : 'OFF'}
                </button>`;
            list.appendChild(item);
            item.querySelector("#toggle-btn-" + id).addEventListener("click", () => {
                if (this.enabledMods.has(id)) this.disableMod(id);
                else this.enableMod(id);
                this.refreshModListUI();
            });
        });
    }
};