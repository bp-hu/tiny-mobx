import { IDerivation, trackDerivedFunction } from "../internal";

export class Reaction implements IDerivation {
  observing = [];
  isDisposed = false;
  fn;

  constructor(fn: () => void) {
    this.fn = fn;
  }

  runReaction() {
    if (this.isDisposed) {
      return;
    }

    this.fn();
  }

  track(fn: () => void) {
    trackDerivedFunction(this, fn);
  }

  dispose() {
    this.isDisposed = true;
  }

  getDisposer() {
    return () => this.dispose();
  }
}
