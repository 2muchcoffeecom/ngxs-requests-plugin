export class CreateRequest<T = any, U = any, I = any> {
  static type = '[Requests] Create Request';

  constructor(
    public payload: {
      request: T;
      path: string;
      response?: (obs: T) => any;
      successAction?: U;
      failAction?: I;
      metadata?: any;
    }
  ) {}
}

export class CreateRequestSuccess {
  static type = '[Requests] Create Request Success';

  constructor(public payload: any, public path: string) {
  }
}

export class CreateRequestFail {
  static type = '[Requests] Create Request Fail';

  constructor(public payload: any, public path: string) {
  }
}
