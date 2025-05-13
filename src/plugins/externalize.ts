import type { RehypePlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import type { Element } from "hast";

interface ExternalizeOptions {
  domain: string;
}

const externalize: RehypePlugin<[ExternalizeOptions?]> = (options) => {
  const { domain } = options || {};

  if (!domain) {
    console.warn("Externalize plugin: Missing 'domain' option.");
    return;
  }

  return (tree) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a" || !node.properties || !node.properties.href) {
        return;
      }

      const href = String(node.properties.href);

      if (
        href.startsWith("/") ||
        href.startsWith(".") ||
        href.startsWith("#")
      ) {
        return;
      }

      if (!href.includes(domain)) {
        node.properties["target"] = "_blank";
      }
    });
  };
};

export default externalize;
