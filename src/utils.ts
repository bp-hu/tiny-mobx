import { IDerivation } from "./internal";

export function addHiddenProp(
  object: Object,
  propName: string | symbol,
  value: any
) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value,
  });
}

export const globalState: {
  trackingDerivation?: IDerivation;
} = {
  trackingDerivation: undefined,
};
