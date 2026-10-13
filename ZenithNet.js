window.ZenithNet = {
    peer: null,
    init(onReady) {
        import("https://esm.sh/peerjs@1.5.4").then(({ Peer }) => {
            this.peer = new Peer({
                config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }
            });
            this.peer.on("open", (id) => onReady(id));
            this.peer.on("connection", (conn) => {
                conn.on("data", (data) => window.dispatchEvent(new CustomEvent("eagler_packet", { detail: data })));
            });
        });
    },
    hostRoom(cb) { this.init(cb); },
    joinRoom(code) {
        this.init(() => {
            const conn = this.peer.connect(code);
            conn.on("open", () => alert("Connected to host!"));
        });
    }
};