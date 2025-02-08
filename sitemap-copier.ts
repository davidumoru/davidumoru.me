import type { AstroIntegration } from "astro";
import { readdir, cp, mkdir } from "node:fs/promises";
import * as path from "node:path";

export function sitemapCopier(): AstroIntegration {
  return {
    name: "sitemap-copier",
    hooks: {
      "astro:build:done": async ({ logger }) => {
        const buildLogger = logger.fork("sitemap-copier");
        buildLogger.info(
          "Copying XML files from dist to .vercel/output/static"
        );

        try {
          const distPath = path.resolve("dist");
          const outputPath = path.resolve(".vercel/output/static");

          // Ensure the target directory exists
          await mkdir(outputPath, { recursive: true });

          const files = await readdir(distPath);
          const xmlFiles = files.filter(
            (file) =>
              path.extname(file).toLowerCase() === ".xml" &&
              path.basename(file).toLowerCase().startsWith("sitemap")
          );

          if (xmlFiles.length === 0) {
            buildLogger.warn("No sitemap XML files found.");
            return;
          }

          buildLogger.info(`Found XML files: ${xmlFiles.join(", ")}`);

          // Copy files in parallel
          await Promise.all(
            xmlFiles.map((file) =>
              cp(path.join(distPath, file), path.join(outputPath, file))
            )
          );

          buildLogger.info("All XML files copied successfully.");
        } catch (error) {
          if (error instanceof Error) {
            buildLogger.error(`Error copying files: ${error.message}`);
          } else {
            buildLogger.error("Unknown error occurred.");
          }
        }
      },
    },
  };
}
