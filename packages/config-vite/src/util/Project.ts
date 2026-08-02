/// <reference types="vitest" />
import { readFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { resolve } from "node:path";

export const cwd = process.cwd();
export const pkg = JSON.parse(readFileSync(resolve(cwd, "package.json"), "utf8"));

export const project = {
    path: cwd,
    id: pkg.name, // @moon7/signals
    scope: pkg.name.includes("/") ? pkg.name.split("/")[0] : null, // @moon7
    name: pkg.name.split("/").at(-1), // signals
    version: pkg.version,
};

export type Project = typeof project;

export const externals = [
    /^disposablestack(\/.*)?$/,
    /^node:.*/,
    ...builtinModules,
    ...Object.entries(pkg.dependencies ?? [])
        // .filter(([key, value]) => !value.startsWith("workspace:"))
        .map(([key, value]) => key),
];
