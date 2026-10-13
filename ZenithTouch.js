window.ZenithTouch = {
    init() {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:absolute;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
        overlay.innerHTML = `
            <div id="btn-jump" style="position:absolute;bottom:40px;right:30px;width:65px;height:65px;background:rgba(0,255,100,0.3);border-radius:50%;pointer-events:auto;line-height:65px;text-align:center;font-weight:bold;color:white;">JUMP</div>
            <div id="btn-sneak" style="position:absolute;bottom:120px;right:30px;width:55px;height:55px;background:rgba(255,255,255,0.2);border-radius:50%;pointer-events:auto;line-height:55px;text-align:center;color:white;">SNEAK</div>`;
        document.body.appendChild(overlay);

        const bind = (id, key, code) => {
            const el = document.getElementById(id);
            el.addEventListener("touchstart", (e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent("keydown", { key, code })); });
            el.addEventListener("touchend", (e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent("keyup", { key, code })); });
        };
        bind("btn-jump", " ", "Space");
        bind("btn-sneak", "Shift", "ShiftLeft");
    }
};