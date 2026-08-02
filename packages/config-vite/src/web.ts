/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import { magicPlugin, moduleDef, moduleName } from "./plugins/Magic.js";
import { project } from "./util/Project.js";

export default defineConfig({
    build: {},
    esbuild: {
        drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
    },
    define: {
        __PROJECT__: JSON.stringify({
            id: project.id,
            scope: project.scope,
            name: project.name,
            version: project.version,
            build: project.build,
        }),
        __SVMS__: JSON.stringify({
            BUILD: {
                IS_PRODUCTION: process.env.NODE_ENV === "production",
                NODE_ENV: process.env.NODE_ENV ?? null,
                TIMESTAMP: Date.now(),
                VERSION: project.version,
            },
        }),
    },
    plugins: [
        magicPlugin({
            defines: {
                module: moduleDef(project),
                project: (src, id) => JSON.stringify(project),
            },
        }),

        vue({
            template: { transformAssetUrls },
        }),

        quasar({
            autoImportComponentCase: "combined",
            sassVariables: "~/styles/quasar.scss",
        }),
    ],
    optimizeDeps: {},
    resolve: {
        alias: {
            "~": resolve(project.path, "src"),
            "!": resolve(project.path, "test"),
        },
    },
});
