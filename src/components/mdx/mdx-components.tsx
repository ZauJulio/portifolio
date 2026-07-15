import type { ComponentPropsWithoutRef, ComponentType } from "react";

import { defaultMdxComponents } from "@indago/hyper-down";

import { ImageCarousel } from "./ImageCarousel";
import { Update, UpdateLog } from "./UpdateLog";
import { ZoomableMermaid } from "./ZoomableMermaid";

import type { ComponentMap } from "@indago/hyper-down";

// The lib's default `code` override renders Mermaid fences via its own
// (non-interactive) `MermaidBlock`. We delegate every other code block to it
// and only intercept `language-mermaid`, swapping in the pan/zoom viewer.
const DefaultCode = defaultMdxComponents.code as ComponentType<ComponentPropsWithoutRef<"code">>;

/** MDX overrides merged on top of the lib defaults — adds zoomable Mermaid. */
export const mdxComponents: ComponentMap = {
  code: (props: ComponentPropsWithoutRef<"code">) => {
    const { className, children } = props;
    if (typeof className === "string" && className.includes("language-mermaid")) {
      return <ZoomableMermaid code={String(children).trim()} />;
    }
    return <DefaultCode {...props} />;
  },
  ImageCarousel,
  UpdateLog,
  Update,
};
