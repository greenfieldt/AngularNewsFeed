import { AuthStateModel } from './auth.state';

export class Login {
    static readonly type = '[Auth] Login';
    constructor() { }
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

export class UpdateLoggedInUser {
    static readonly type = '[Auth] Updated Logged In User';
    constructor(public payload: AuthStateModel) { }
}

