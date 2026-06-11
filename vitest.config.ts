import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default defineConfig(async (configEnv) => {
  const resolvedViteConfig =
    typeof viteConfig === "function" ? await viteConfig(configEnv) : viteConfig;

  const filteredPlugins = (resolvedViteConfig.plugins as unknown[])
    ?.flat()
    .filter(
      (p: unknown) =>
        p &&
        typeof p === "object" &&
        "name" in p &&
        typeof p.name === "string" &&
        !p.name.startsWith("react-router") &&
        p.name !== "@mdx-js/rollup",
    );

  return mergeConfig(
    { ...resolvedViteConfig, plugins: filteredPlugins },
    defineConfig({
      resolve: {
        tsconfigPaths: true,
      },
      test: {
        environment: "happy-dom",
        globals: true,
        exclude: ["e2e/**", "node_modules/**"],
        server: {
          deps: {
            inline: [/@repo\/.*/],
          },
        },
      },
    }),
  );
});
