const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK = process.env.WEBHOOK_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(bodyParser.json());

app.post("/send", async (req, res) => {
    const token = req.headers["authorization"];

    if (!token || token !== AUTH_TOKEN) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        res.status(response.status).send("Forwarded");
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (_, res) => {
    res.send("✅ Webhook Proxy Online");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
