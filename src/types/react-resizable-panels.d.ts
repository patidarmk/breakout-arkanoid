declare module "react-resizable-panels" {
  import * as React from "react";

  // Minimal exported components used by the project
  export const PanelGroup: React.FC<any>;
  export const Panel: React.FC<any>;
  export const PanelResizeHandle: React.FC<any>;
  export const ResizeHandle: React.FC<any>;

  const _default: {
    PanelGroup: typeof PanelGroup;
    Panel: typeof Panel;
    PanelResizeHandle: typeof PanelResizeHandle;
    ResizeHandle: typeof ResizeHandle;
  };

  export default _default;
}