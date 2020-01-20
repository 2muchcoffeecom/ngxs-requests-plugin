# NgxsRequests

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.2.

## Install

`npm i --save serve ngxs-requests-plugin`

## Подключение

Там где вы используете `NgxsModule.forRoot`, подключите также и `NgxsRequestsPluginModule.forRoot()`
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
## Использование
* Создайте переменную в которой будет храниться динамически созданный request state  
    ```typescript
      import { createRequestState } from 'ngxs-requests-plugin';
      export const signInRequestState = createRequestState('signIn');
    ```

* В вашем state используйте CreateRequest для создания реквеста, в `path` указывайте тотже путь что и при создании динамического state
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
    
        return ctx.dispatch(new CreateRequest({
          path: 'signIn',
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

* Для получения данных реквестов, используйте динамически созданный стейт
    ```typescript
    @Injectable({
      providedIn: 'root',
    })
    export class AuthService {
      @Select(signInRequestState)
      signInRequestState$: Observable<IRequest>;
    }
    ```
