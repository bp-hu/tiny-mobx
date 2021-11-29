import { ObservableValue } from "./internal";

export class Admin {
  target: any;
  props: { [key: string]: ObservableValue } = {};

  constructor(target: any) {
    this.target = target;
  }

  addProp(key: string, value: any) {
    this.props[key] = new ObservableValue(value);
  }

  read(key: string) {
    return this.props[key]?.get();
  }

  write(key: string, value: any) {
    this.props[key]?.set(value);
  }
}
