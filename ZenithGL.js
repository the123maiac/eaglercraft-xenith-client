window.ZenithGL = {
    targetFPS: 60,
    renderScale: 0.75,
    applyOptimizations(canvas, glContext) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = Math.floor(width * this.renderScale);
        canvas.height = Math.floor(height * this.renderScale);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        if (glContext) {
            glContext.disable(glContext.SAMPLE_COVERAGE);
            glContext.hint(glContext.GENERATE_MIPMAP_HINT, glContext.FASTEST);
        }
        document.addEventListener("visibilitychange", () => {
            window.ZenithGL.targetFPS = document.hidden ? 15 : 60;
        });
    }
};