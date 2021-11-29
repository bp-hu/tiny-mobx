import { IDerivation, globalState } from "../internal";

export interface IObservable {
  observers: Set<IDerivation>;
}

export function removeObserver(observable: IObservable, node: IDerivation) {
  observable.observers.delete(node);
}

export function addObserver(observable: IObservable, node: IDerivation) {
  observable.observers.add(node);
}

export class ObservableValue implements IObservable {
  value: any;
  observers = new Set<IDerivation>();

  constructor(value?: any) {
    this.value = value;
  }

  get() {
    const derivation = globalState.trackingDerivation;
    if (derivation) {
      addObserver(this, derivation);
      derivation.observing[derivation.observing.length] = this;
    }

    return this.value;
  }

  set(v: any) {
    this.value = v;
    [...this.observers].forEach((observer) => {
      observer["runReaction"]?.();
    });
  }
}
