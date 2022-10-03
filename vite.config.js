import { defineConfig } from "vite";
import dns from "dns";

// set 127.0.0.1 to localhost for auth redirect URI
dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  server: {
    port: "8080",
  },
});
