import { getDependencyTree } from "mobx";
export function printDebugValue(v) {
    return getDependencyTree(v);
}
