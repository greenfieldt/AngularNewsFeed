import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Login, Logout, UpdateLoggedInUser } from './auth.actions'
import { AuthService } from '../service/auth.service';
import { tap, filter } from 'rxjs/operators';


export class AuthStateModel {
    token?: string;
    username?: string;
    isAuthenticated: boolean;
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    isAnonymous?: boolean;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        isAuthenticated: false
    }
})
export class AuthState {

    @Selector()
    static token(state: AuthStateModel) { return state.token; }

    constructor(private store: Store, private authService: AuthService) {
        authService.user$.pipe(
            //            tap((x) => console.log("AuthService", x)),
            filter((user) => !!user), //filter the first null usern
            tap((x: AuthStateModel) => {
                this.store.dispatch(
                    new UpdateLoggedInUser({ ...x, isAuthenticated: true }));
            })
        ).subscribe();

    }

    @Action(UpdateLoggedInUser)
    async updateLoggedInUser({ patchState }: StateContext<AuthStateModel>,
        action: UpdateLoggedInUser) {
        patchState(action.payload);
    }


    @Action(Login)
    async login(ctx: StateContext<AuthStateModel>) {
        let a = ctx.getState().isAuthenticated;
        if (!a) {
            await this.authService.googleLogin();
        }
    }

    @Action(Logout)
    async logout({ setState, getState }: StateContext<AuthStateModel>) {
        await this.authService.logOut();
        //clean out all the state
        setState({ isAuthenticated: false });
    }

}
