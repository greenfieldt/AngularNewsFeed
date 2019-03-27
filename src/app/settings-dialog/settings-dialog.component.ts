import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store, Select } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { SetNumCardsPerPage, SetNumCardsCachedPerGet, SetUseFireStore, SetUseLocalStorage } from '../shared/state/settings.actions';
import { AuthService } from '../shared/service/auth.service';


@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

    @Select(state => state.settings.numCardsPerPage) numCardsPerPage$;
    @Select(state => state.settings.numCardsCachedPerGet) numCardsCachedPerGet$;
    @Select(state => state.settings.useLocalStorage) useLocalStorage$;
    @Select(state => state.settings.useFireStore) useFireStore$;

    ncpSub: Subscription;
    nccpgSub: Subscription;
    ulsSub: Subscription;
    ufsSub: Subscription;


    numCardsPerPage: number = 3;
    numCardsCachedPerGet: number = 3;
    useLocalStorage: boolean = false;
    useFireStore: boolean = false;

    constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>, private store: Store, public auth: AuthService) { }

    ngOnInit() {

        this.ncpSub = this.numCardsPerPage$.subscribe((x) => {
            this.numCardsPerPage = x;
        });

        this.nccpgSub = this.numCardsCachedPerGet$.subscribe((x) => {
            this.numCardsCachedPerGet = x;
        });

        this.ulsSub = this.useLocalStorage$.subscribe((x) => {
            this.useLocalStorage = x;
        });

        this.ufsSub = this.useFireStore$.subscribe((x) => {
            this.useFireStore = x;
        });

    }

    ngOnDestory() {
        this.ncpSub.unsubscribe();
        this.nccpgSub.unsubscribe()
        this.ulsSub.unsubscribe()
        this.ufsSub.unsubscribe()

    }
    close() {
        this.dialogRef.close();
    }

    done() {
        console.log("ncpp", this.numCardsPerPage);
        console.log("ncna", this.numCardsCachedPerGet);
        console.log("ls", this.useLocalStorage);
        console.log("fss", this.useFireStore);
        this.store.dispatch(new SetNumCardsPerPage(this.numCardsPerPage));
        this.store.dispatch(new SetNumCardsCachedPerGet(this.numCardsCachedPerGet));
        this.store.dispatch(new SetUseLocalStorage(this.useLocalStorage));
        this.store.dispatch(new SetUseFireStore(this.useFireStore));
        this.close();
    }
}
