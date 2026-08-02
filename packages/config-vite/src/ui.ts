/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import { magicPlugin, moduleDef, moduleName } from "./plugins/Magic.js";
import { project, externals } from "./util/Project.js";

export default defineConfig({
    build: {
        sourcemap: true,
        minify: false,
        lib: {
            name: project.name,
            entry: {
                index: resolve(project.path, "src/index.ts"),
            },
            formats: ["es"],
            // fileName: "index",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled into your library
            external: externals,
            output: {
                // Provide global variables to use in the UMD build for externalized deps
                globals: {
                    vue: "Vue",
                },
                assetFileNames: "index.[ext]",
            },
        },
    },
    define: {
        __PROJECT__: JSON.stringify({
            id: project.id,
            scope: project.scope,
            name: project.name,
            version: project.version,
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

        dts({
            // rollupTypes: true,
            include: [
                // formatting
                "types/**/*",
                "src/**/*",
            ],
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
