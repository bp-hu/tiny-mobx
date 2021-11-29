import { globalState, IObservable, removeObserver } from "../internal";

export interface IDerivation {
  observing: IObservable[];
}

export function trackDerivedFunction(derivation: IDerivation, fn: () => void) {
  const prevDerivation = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  fn();
  globalState.trackingDerivation = prevDerivation;
}

export function clearObserving(derivation: IDerivation) {
  const obs = derivation.observing;
  derivation.observing = [];

  let i = obs.length;
  while (i--) removeObserver(obs[i], derivation);
}
