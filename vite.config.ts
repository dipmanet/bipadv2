import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
      },
    }),
    tailwindcss(),
    viteCompression(),
  ],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "./src/components"),
      "#lib": path.resolve(__dirname, "./src/lib"),
      "#constants": path.resolve(__dirname, "./src/constants"),
      "#notify": path.resolve(__dirname, "./src/notify"),
      "#actionCreators": path.resolve(__dirname, "./src/store/actionCreators"),
      "#selectors": path.resolve(__dirname, "./src/store/selectors"),
      "#request": path.resolve(__dirname, "./src/request"),
      "#resources": path.resolve(__dirname, "./src/resources"),
      "#openseadragon-images": path.resolve(
        __dirname,
        "./src/resources/openseadragon-images"
      ),
      "#schema": path.resolve(__dirname, "./src/schema"),
      "#store": path.resolve(__dirname, "./src/store"),
      "#ts": path.resolve(__dirname, "./src/ts"),
      "#utils": path.resolve(__dirname, "./src/utils"),
      "#rsca": path.resolve(
        __dirname,
        "./src/vendors/react-store/components/Action"
      ),
      "#rscg": path.resolve(
        __dirname,
        "./src/vendors/react-store/components/General"
      ),
      "#rsci": path.resolve(
        __dirname,
        "./src/vendors/react-store/components/Input"
      ),
      "#rscv": path.resolve(
        __dirname,
        "./src/vendors/react-store/components/View"
      ),
      "#rscz": path.resolve(
        __dirname,
        "./src/vendors/react-store/components/Visualization"
      ),
      "#rsck": path.resolve(__dirname, "./src/vendors/react-store/constants"),
      "#rscu": path.resolve(__dirname, "./src/vendors/react-store/utils"),
      "#views": path.resolve(__dirname, "./src/views"),
      "#types": path.resolve(__dirname, "./src/types"),
      "#mapStyles": path.resolve(__dirname, "./src/vendors/osm-liberty"),
      "#re-map": path.resolve(__dirname, "./src/vendors/re-map"),
      "#Kalimati": path.resolve(
        __dirname,
        "./src/resources/fonts/Kalimati Regular.ttf)"
      ),
      "~base-scss": path.resolve("./src/stylesheets"),
    },
  },
  css: {
    modules: {
      localsConvention: "dashesOnly",
    },
  },

  optimizeDeps: {
    include: ["src"],
    esbuildOptions: {
      loader: { ".js": "tsx" },
    },
  },

  server: {
    allowedHosts: true,
    port: 5173,
  },
});
