import { addHiddenProp, Reaction } from "./internal";
import { Admin } from "./admin";

const $mobx = Symbol("mobx administration");
const mobxPendingDecorators = Symbol("mobx pending decorators");
const mobxDidRunLazyInitializersSymbol = Symbol(
  "mobx did run lazy initializers"
);

export function observable(
  target: any,
  propertyKey: string,
  descriptor?: PropertyDescriptor & {
    initializer: any;
  }
): any {
  target[mobxPendingDecorators] = target[mobxPendingDecorators] || {};
  target[mobxPendingDecorators][propertyKey] = function (instance) {
    const initialValue = descriptor
      ? descriptor.initializer
        ? descriptor.initializer.call(target)
        : descriptor.value
      : undefined;

    if (!instance[$mobx]) {
      addHiddenProp(instance, $mobx, new Admin(instance));
    }

    instance[$mobx].addProp(propertyKey, initialValue);

    Object.defineProperty(instance, propertyKey, {
      configurable: true,
      enumerable: true,
      get() {
        return instance[$mobx].read(propertyKey);
      },
      set(v: any) {
        instance[$mobx].write(propertyKey, v);
      },
    });
  };

  return {
    configurable: true,
    enumerable: !!descriptor?.enumerable,
    get(this: any) {
      initInstance(this);
      return this[propertyKey];
    },
    set(this: any, value: any) {
      initInstance(this);
      this[propertyKey] = value;
    },
  };
}

function initInstance(instance: any) {
  if (instance[mobxDidRunLazyInitializersSymbol] === true) {
    return;
  }
  addHiddenProp(instance, mobxDidRunLazyInitializersSymbol, true);

  const decorators = instance[mobxPendingDecorators];
  const keys = [
    ...Object.getOwnPropertySymbols(decorators),
    ...Object.keys(decorators),
  ];

  for (const key of keys) {
    decorators[key](instance);
  }
}

export function autorun(view: (reaction?: any) => void) {
  const reaction = new Reaction(function (this: Reaction) {
    this.track(() => view(this));
  });

  reaction.runReaction();
  return reaction.getDisposer();
}
