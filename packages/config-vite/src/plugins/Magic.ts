import { PluginOption } from "vite";
// eslint-disable-next-line no-restricted-imports
import type { Project } from "../util/Project.js";

export type MagicDef = (src: string, id: string) => string;

export interface MagicPluginOptions {
    defines: Record<string, MagicDef>;
}

export function magicPlugin(options: MagicPluginOptions): PluginOption {
    const rxFile = /\.(js|ts)$/;

    function transform(src: string, id: string) {
        return src.replace(/import\.meta\.([a-z_$][a-z_$0-9]*)/gi, (original, key) => {
            return options.defines[key]?.(src, id) ?? original;
        });
    }

    return {
        name: "magic-plugin",
        transform(src, id) {
            if (rxFile.test(id)) {
                return {
                    code: transform(src, id),
                    map: null,
                };
            }
        },
    };
}

// const rxPrefix = /^(src)(?=\/)/;
const rxPrefix = /^(src)\//;

// const prefix: Record<string, string> = {
//     src: "~",
//     lib: "#",
// };

function getExtLength(id: string): number {
    return id.length - id.lastIndexOf(".");
}

// projectName: "@foo/bar"
// projectPath: "/home/user/git/foo/bar"
// id: "/home/user/git/foo/bar/src/path/to/module.ts"
export function moduleName(projectPath: string, id: string): string {
    const normalizedPath = projectPath.replaceAll("\\", "/");
    if (!id.startsWith(normalizedPath)) {
        throw new Error(`Module path ${id} is not under project path ${projectPath}`);
    }

    const name = id
        // remove project path and extension
        .slice(normalizedPath.length + 1, -getExtLength(id))
        // remove leading "src/" or "lib/"
        .replace(rxPrefix, "");
    return name;
}

export function moduleDef(project: Project): MagicDef {
    return (src: string, id: string) => {
        const mod = moduleName(project.path, id);
        const pkg = project.id;
        return JSON.stringify({ pkg, mod });
    };
}
