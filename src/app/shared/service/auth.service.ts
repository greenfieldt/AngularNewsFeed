import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { DbService } from './db.service';


//import { Router } from '@angular/router';
//import { Storage } from '@ionic/storage';
//import { Platform, LoadingController } from '@ionic/angular';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';



@Injectable({
    providedIn: 'root'
})


export class AuthService {
    user$: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private db: DbService,
        //        private storage: Storage,
        //        private platform: Platform,
        //private router: Router,
        //        private loadingController: LoadingController,
        //        private googlePlus: GooglePlus
    ) {

        this.user$ = this.afAuth.authState.pipe(
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
        //      this.storage.set('authRedirect', val);
    }

    async isRedirect() {
        //        return await this.storage.get('authRedirect');

        //don't worry about ionioc for now 
        return false;
    }

    async googleLogin() {
        try {
            let user;
            // if (this.platform.is('cordova')) {
            //     await this.nativeGoogleLogin();
            // } else {
            await this.setRedirect(true);
            const provider = new auth.GoogleAuthProvider();
            user = await this.afAuth.auth.signInWithRedirect(provider);
            // }

            return await this.updateUserData(user);

        } catch (err) {
            console.log(err);
        }

    }

    private async handleRedirect() {
        if ((await this.isRedirect()) !== true) {
            return null;
        }



	/*
	  This is for ionic intergration -- We'll be putting it
	  back shortly
	  const loading = await this.loadingController.create();
        await loading.present();

        const result = await this.afAuth.auth.getRedirectResult();

        if (result.user) {
            await this.updateUserData(result.user);
        }


        await loading.dismiss();
        await this.setRedirect(false);

        return result;
	*/

    }

    /*
    async nativeGoogleLogin(): Promise<any> {
        console.log('Attempting log in ... ');

        const googlePlus = await this.googlePlus.login({
            clientId: 'com.googleusercontent.apps.107514517936-gvr08vcbg4lb8me9higpdkd06lqt2gme',
            offline: true,
            scopes: 'profile email'
        });
        console.log('Afer googlePlus call ...');

        console.log(googlePlus);
        console.log(googlePlus.idToken);

        var tmp = await this.afAuth.auth.signInWithCredential(auth.GoogleAuthProvider.credential(googlePlus.idToken));

        console.log(tmp);
        return tmp;
    }
*/
}

