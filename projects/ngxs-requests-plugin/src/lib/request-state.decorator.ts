import { StoreOptions } from '@ngxs/store/src/symbols';
import { StateClass } from '@ngxs/store/internals';
import { State } from '@ngxs/store';
import { requestInitialState } from './util';

export function RequestState<T = any>(name: string) {
  const options: StoreOptions<any> = {
    name,
    defaults: requestInitialState
  };

  return (target: StateClass<T>) => {
    State<T>(options)(target);
  };
}
