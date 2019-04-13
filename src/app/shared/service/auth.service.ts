import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { DbService } from './db.service';


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    user$: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private db: DbService,
    ) {

        this.user$ = this.afAuth.authState.pipe(
            //            tap((x) => console.log("authState", x)),
            switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null))));

        this.handleRedirect();
    }

    UID(): Promise<any> {
        return this.user$.pipe(take(1), map(u => u && u.uid)).toPromise();
    }

    async anonymousLogin() {
        const creds = await this.afAuth.auth.signInAnonymously();

        return await this.updateUserData(creds.user);
    }

    private updateUserData({ uid, email, displayName, photoURL, isAnonymous }) {
        const data = {
            uid,
            email,
            displayName,
            photoURL,
            isAnonymous
        };

        return this.db.updateAt(`users/${uid}`, data);
    }

    async logOut() {
        await this.afAuth.auth.signOut();
        //        return this.router.navigateByUrl('/');
    }

    setRedirect(val) {
        localStorage.setItem('authRedirect', val);
    }

    isRedirect(): boolean {
        return localStorage.getItem('authRedirect') === "true";
    }

    async googleLogin() {
        try {
            let user;
            await this.setRedirect(true);
            const provider = new auth.GoogleAuthProvider();
            user = await this.afAuth.auth.signInWithRedirect(provider);
            return await this.updateUserData(user);

        } catch (err) {
            console.log(err);
        }

    }

    private async handleRedirect() {
        if ((await this.isRedirect()) !== true) {
            return null;
        }

        const result = await this.afAuth.auth.getRedirectResult();

        if (result.user) {
            await this.updateUserData(result.user);
        }

        this.setRedirect(false);


    }


}

