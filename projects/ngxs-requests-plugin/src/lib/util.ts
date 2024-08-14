import { ɵStateClassInternal as StateClassInternal } from '@ngxs/store/internals';
import { IRequest } from './request.interface';
import { RequestStatus } from './request-status.enum';

export function createRequestAction<T = any, U = any, I = any>(data: {
  request: T;
  state: StateClassInternal;
  successAction?: U;
  failAction?: I;
  metadata?: any;
}) {
  const CreateRequest = class {
    static type = `[Request] ${data?.state?.NGXS_OPTIONS_META?.name} Start`;

    constructor(public payload: typeof data) {
    }
  };
  return new CreateRequest(data);
}


export function createRequestSuccessAction(data: any, statePath: string) {
  const CreateRequestSuccess = class {
    static type = `[Request] ${statePath} Success`;

    constructor(public payload: typeof data, public path: string) {
    }
  };

  return new CreateRequestSuccess(data, statePath);
}

export function createRequestFailAction(data: any, statePath: string) {
  const CreateRequestFail = class {
    static type = `[Request] ${statePath} Fail`;

    constructor(public payload: typeof data, public path: string) {
    }
  };

  return new CreateRequestFail(data, statePath);
}

export const requestInitialState: IRequest = {
  loading: false,
  loaded: false,
  status: '',
  data: null,
};

export const requestLoadingState: IRequest = {
  loading: true,
  loaded: false,
  status: '',
  data: null,
};

export const requestSuccessState = <U = any>(payload: U): IRequest => {
  return {
    loading: false,
    loaded: true,
    status: RequestStatus.Success,
    data: payload,
  };
};

export const requestFailState = <U = any>(payload: U): IRequest => {
  return {
    loading: false,
    loaded: true,
    status: RequestStatus.Fail,
    data: payload,
  };
};
