import { Injectable } from '@angular/core';
import { Observable, from, of, Subject } from 'rxjs';
import { AsyncStorageEngine } from '@ngxs-labs/async-storage-plugin';
import { take, tap, map, mergeMap } from 'rxjs/operators'

//import the firesstore stuff as Storage
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import { storage } from 'firebase';

//import { SetNumCardsCachedPerGet, SetNumCardsPerPage, SetUseLocalStorage, SetUseFireStore } from './settings.actions';

interface settings {
    numOfCardsDisplayed: number;
    numOfCardsCached: number;
    useLocalStorage: boolean;
    useFireStore: boolean;
}


interface news {
    settings: settings;
    articles: [];
    id: string;
}

export function FSSeralizer(x) {
    console.log("Seralizer", x);
    return JSON.stringify(x);
}


export function FSDeSeralizer(x) {
    console.log("DeSeralizer", JSON.parse(x.val));
    let tmp = JSON.parse(x.val);
    return tmp;
}


@Injectable({
    providedIn: 'root'
})
export class StorageService implements AsyncStorageEngine {

    newsCollection: AngularFirestoreCollection<news>;

    constructor(private storage: AngularFirestore/*,private store: Store*/) {
        this.newsCollection = this.storage.collection('news');

        //I couldn't figure out how to deal with firestore updates here
        /*
                this.newsCollection.stateChanges().pipe(
                    mergeMap(actions => actions),
                    map(action => {
                        let _action = action.type;
                        let data = action.payload.doc.data();
                        let id = action.payload.doc.id;
                        console.log("Action from Firebase:", _action, id, data);
                        if (_action === 'modified') {
                            //store.reset(data);
                        }
                    })).subscribe();
        */


    }


    length(): Observable<number> {
        console.log("Length Called");
        return of(1);
    }

    getItem(key: any): Observable<any> {
        console.log("getItem", key);
        return this.newsCollection.doc(key).snapshotChanges().pipe(
            take(1),
            map(doc => {
                return { ...doc.payload.data() }
            }));

    }

    setItem(key: any, val: any): void {
        console.log("setItem", key, val);
        this.newsCollection.doc(key).set({ val: val }, { merge: true });
        return;
    }

    removeItem(key: any): void {
        console.log("removeItem", key);
    }

    clear(): void {
        console.log("clear");
    }

    key(val: number): Observable<string> {
        console.log("key(val)", val);
        return of("");
    }

}
