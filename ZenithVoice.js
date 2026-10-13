window.ZenithVoice = {
    audioContext: null,
    async enableMicrophone() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
};