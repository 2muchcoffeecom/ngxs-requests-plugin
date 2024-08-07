import { ɵPlainObjectOf, ɵStateClass } from "@ngxs/store/internals";

const META_OPTIONS_KEY = "NGXS_OPTIONS_META";
const META_KEY = "NGXS_META";

export interface StateClassInternal<T = any, U = any> extends ɵStateClass<T> {
  [META_KEY]?: MetaDataModel;
  [META_OPTIONS_KEY]?: StoreOptions<U>;
}

interface MetaDataModel {
  name: string | null;
  actions: ɵPlainObjectOf<ActionHandlerMetaData[]>;
  defaults: any;
  path: string | null;
  makeRootSelector: SelectorFactory | null;
  children?: StateClassInternal[];
}

interface ActionHandlerMetaData {
  fn: string | symbol;
  options: ActionOptions;
  type: string;
}

interface ActionOptions {
  cancelUncompleted?: boolean;
}

interface SharedSelectorOptions {
  injectContainerState?: boolean;
  suppressErrors?: boolean;
}

type SelectFromRootState = (rootState: any) => any;
type SelectorFactory = (
  runtimeContext: RuntimeSelectorContext
) => SelectFromRootState;

interface RuntimeSelectorContext {
  getStateGetter(key: any): (state: any) => any;
  getSelectorOptions(
    localOptions?: SharedSelectorOptions
  ): SharedSelectorOptions;
}

interface StoreOptions<T> {
  name: string | StateToken<T>;
  defaults?: T;
  children?: ɵStateClass[];
}

export declare class StateToken<T = void> {
  private readonly name;
  constructor(name: TokenName<T>);
  getName(): string;
  toString(): string;
}
declare type RequireGeneric<T, U> = T extends void
  ? "You must provide a type parameter"
  : U;
export declare type TokenName<T> = string & RequireGeneric<T, string>;
