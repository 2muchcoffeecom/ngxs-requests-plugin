# NgxsRequestsPlugin
NgxsRequestsPlugin is used to store the state of the request and response from the server into the request state

## Installation

`
npm install ngxs-requests-plugin --save`

or if you are using yarn\
`yarn add ngxs-requests-plugin
`

## Connection
Provide `withNgxsRequestsPlugin` in the same place where you provide `provideStore`
```typescript
import { withNgxsRequestsPlugin } from 'ngxs-requests-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore([]),
    withNgxsRequestsPlugin([]),
  ],
};
```

## Using
* Create an empty class with the `RequestState` decorator
    ```typescript
      import { Injectable } from '@angular/core';
      import { RequestState } from 'ngxs-requests-plugin';
  
      @Injectable()
      @RequestState('signInRequest')
      export class SignInRequestState {
      }
    ```
  The argument of `RequestState` decorator will be use as a name of the requests state slice.
  <br>
  Note: The argument is a required and must be unique for the entire application.
  <br>
  The @Selector() decorator can be added for selecting the data from the store
  ```typescript
  import { Injectable } from '@angular/core';
  import { RequestState } from 'ngxs-requests-plugin';

  @Injectable()
  @RequestState('signInRequest')
  export class SignInRequestState {
    @Selector()
    static getRequestState(state: IRequest) {
      return state;
    }
  }
    ```
  or it can be added to the separate getter class
  ```typescript
  export class SignInRequestGetterState {
    @Selector([
      SignInRequestState,
    ])
    static getRequestState(state: IRequest) {
      return state;
    }
  }
    ```
  or reusable getter class can be created
  ```typescript
  export class RequestGetterState {
    static getState(stateClass) {
        return createSelector([stateClass], (state: IRequest) => state);
    }
  }
    ```
  Ane approach of creating selectors from the NGXS package can be used
  <br>
  <br>
* Use `CreateRequestAction` for request creation
    ```typescript
    @State<AuthStateModel>({
      name: 'auth',
      defaults: {
        token: null,
      },
    })
    export class AuthState implements NgxsAfterBootstrap {  
      constructor(
        private httpClient: HttpClient
      ) {
      }
    
      @Action(SignIn)
      signIn(ctx: StateContext<AuthStateModel>, action: SignIn) {
        const request = this.httpClient.post('serverUrl/signIn', {});
    
        return ctx.dispatch(new CreateRequestAction({
          state: SignInRequestState,
          request,
          successAction: SignInSuccess,
          failAction: SignInFail,
          metadata: 'some additional data'
        }));
      }
    
      @Action(SignInSuccess)
      signInSuccess(ctx: StateContext<AuthStateModel>, action: SignInSuccess) {
        console.log('SignInSuccess');
      }
    
      @Action(SignInFail)
      signInFail(ctx: StateContext<AuthStateModel>, action: SignInSuccess) {
        console.log('SignInFail');
      }
    }
    ```
  CreateRequestAction parameters:
  * request - required field. Usually, it's observable returned from the `HttpClient`
  * state - required field. Class with `RequestState` decorator
  * successAction - action, which will be called on the successful request
  * failAction - action, which will be called if the request responded with an error
  * metadata - additional data that can be received in `successAction` and `failAction`

* To get the request data and its state, use any NGXS Store method for selecting state. Here are a few examples:
    ```typescript
  export class SignInComponent {
      signInRequestState$: Observable<IRequest> = inject(Store).select((state) => state.signInRequest);
  }
    ```
  ```typescript
  export class SignInComponent {
    signInRequestState$: Observable<IRequest> = inject(Store).select(SignInRequestState.getRequestState);
  }
    ```
    ```typescript
  export class SignInComponent {
    signInRequestState$: Observable<IRequest> = inject(Store).select(RequestGetterState.getState(SignInRequestState));
  }
    ```
  Also, you need to include your classes with `RequestState` decorator in withNgxsRequestsPlugin provider
  ```typescript
  import { withNgxsRequestsPlugin } from 'ngxs-requests-plugin';
  
  export const appConfig: ApplicationConfig = {
    providers: [
      provideStore([],),
      withNgxsRequestsPlugin([
        SignInRequestState,
      ]),
    ],
  };
  ```
