# NgxsRequestsPlugin
NgxsRequestsPlugin is used to store the state of the request and response from the server into the request state

## Installation

`
npm install ngxs-requests-plugin --save`

or if you are using yarn\
`yarn add ngxs-requests-plugin
`

## Connection
Include `NgxsRequestsPluginModule.forRoot()` in the same place where you use `NgxsModule.forRoot`
```typescript
import { NgxsRequestsPluginModule } from 'ngxs-requests-plugin';

@NgModule({
  imports: [
    NgxsModule.forRoot([...]),
    NgxsRequestsPluginModule.forRoot(),
  ],
})
export class NgxsStoreModule {
}
```

## Using
* Create an empty class with the `RequestState` decorator
    ```typescript
      import { Injectable } from '@angular/core';
      import { RequestState } from 'ngxs-requests-plugin';
  
      @Injectable()
      @RequestState('signIn')
      export class SignInRequestState {
      }
    ```
  The argument of `RequestState` decorator will be use as a name of the requests state slice.
  <br>
  Note: The argument is a required and must be unique for the entire application.  

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

* To get the request data and its state, use the `Select` decorator. Pass the previously created class with the `RequestState` decorator as an argument to` Select`  
    ```typescript
    @Injectable({
      providedIn: 'root',
    })
    export class AuthService {
      @Select(SignInRequestState)
      signInRequestState$: Observable<IRequest>;
    }
    ```
    Also you need to include your class with `RequestState` decorator in NgxsRequestsPluginModule
    ```typescript
    import { NgxsRequestsPluginModule } from 'ngxs-requests-plugin';
    
    @NgModule({
      imports: [
        NgxsModule.forRoot([...]),
        NgxsRequestsPluginModule.forRoot([
          SignInRequestState
        ]),
      ],
    })
    export class NgxsStoreModule {
    }
    ```
