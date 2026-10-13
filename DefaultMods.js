window.ZenithModEngine.register({
    id: "fullbright",
    name: "Fullbright (Night Vision)",
    description: "Sets gamma to maximum for visibility in caves.",
    onEnable(api) { api.setGamma(15.0); },
    onDisable(api) { window.ZenithModEngine.gameState.gamma = 1.0; }
});

window.ZenithModEngine.register({
    id: "auto_sprint",
    name: "Toggle Sprint",
    description: "Maintains sprint automatically when moving forward.",
    onTick(state) {
        if (!state.player.isSneaking) {
            state.player.isSprinting = true;
            window.dispatchEvent(new KeyboardEvent("keydown", { code: "ControlLeft", key: "Control" }));
        }
    }
});