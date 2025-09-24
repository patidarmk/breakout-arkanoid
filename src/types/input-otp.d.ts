declare module "input-otp" {
  import * as React from "react";

  export type OTPSlot = {
    char: string;
    hasFakeCaret?: boolean;
    isActive?: boolean;
  };

  export type OTPInputContextType = {
    length: number;
    value: string;
    onChange?: (value: string) => void;
    slots: OTPSlot[];
    // allow other fields if the real lib exposes them
    [key: string]: any;
  };

  export const OTPInput: React.FC<any>;
  export const OTPInputContext: React.Context<OTPInputContextType>;
  export default OTPInput;
}