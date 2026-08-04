import { makeConfig } from "./util/Config.js";

export { mergeConfig, defineConfig, type PluginOption } from "vite";
export * as dts from "vite-plugin-dts";
export * from "./util/Project.js";
export * from "./util/Config.js";

export const config = makeConfig();
export default config;
