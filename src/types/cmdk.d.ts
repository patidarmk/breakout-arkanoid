declare module "cmdk" {
  import * as React from "react";

  // Generic forward-ref exotic component helper
  type RFE<P = any, T = any> = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;

  // The Command component exports a set of subcomponents (Input, List, Empty, Group, Separator, Item, Shortcut)
  export const Command: RFE & {
    Input: RFE;
    List: RFE;
    Empty: RFE;
    Group: RFE;
    Separator: RFE;
    Item: RFE;
    Shortcut: React.FC<any>;
  };

  // Named convenience exports commonly used in codebases
  export const CommandInput: typeof Command["Input"];
  export const CommandList: typeof Command["List"];
  export const CommandEmpty: typeof Command["Empty"];
  export const CommandGroup: typeof Command["Group"];
  export const CommandSeparator: typeof Command["Separator"];
  export const CommandItem: typeof Command["Item"];
  export const CommandShortcut: typeof Command["Shortcut"];

  export default Command;
}