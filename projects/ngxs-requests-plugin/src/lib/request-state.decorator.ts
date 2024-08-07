import { State } from "@ngxs/store";
import { requestInitialState } from "./util";
import { ɵStateClass, ɵStoreOptions } from "@ngxs/store/internals";

export function RequestState<T = any>(name: string) {
  const options: ɵStoreOptions<any> = {
    name,
    defaults: requestInitialState,
  };

  return (target: ɵStateClass<T>) => {
    State<T>(options)(target);
  };
}
