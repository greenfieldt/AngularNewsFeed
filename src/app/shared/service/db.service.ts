import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore'
import * as firebase from 'firebase/app';

import { map, tap } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})
export class DbService {
    constructor(private afs: AngularFirestore) {
    }

    updateInteracted(path, data, command) {
        let doc = this.afs.doc(path);
        let tags = data.tags;

        if (!doc || !tags) {
            throw ("Bad Intereacted Data");
        }
        if (command == 'add') {
            doc.set({
                uid: data.uid,
                news_id: data.news_id,
                updatedAt: Date.now(),
                tags: firebase.firestore.FieldValue.arrayUnion(data.tags)
            }, { merge: true });
        }
        else if (command == 'remove') {
            doc.set({
                uid: data.uid,
                news_id: data.news_id,
                tags: firebase.firestore.FieldValue.arrayRemove(data.tags)
            }, { merge: true });
        }
    }

    collection$(path, query?) {
        console.log(`db.collections: Asking for ${path}, (${query})`);
        return this.afs.collection(path, query).snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data: Object = a.payload.doc.data();
                    const id: Object = a.payload.doc.id;
                    return { id, ...data };
                })
            }))
    };

    doc$(path): Observable<any> {
        return this.afs.doc(path).snapshotChanges().pipe(
            map(doc => {
                return { id: doc.payload.id, ...doc.payload.data() }
            }));
    }

    /**
  
       * @param  {string} path 'collection' or 'collection/docID'
       * @param  {object} data new data
       *
       * Creates or updates data on a collection or document.
       **/
    updateAt(path: string, data: Object): Promise<any> {
        const segments = path.split('/').filter(v => v);
        if (segments.length % 2) {
            return this.afs.collection(path).add(data);
        }
        else {
            //            console.log(`updateAt: ${path} =>`);
            //            console.log(data);
            this.afs.doc(path).set(data, { merge: true });
        }
    }


    /**
 
     * @param  {string} path 'collection' or 'collection/docID'
     * @param  {object} data new data
     *
     * Creates or updates data on a collection or document.
     **/
    pushAt(path: string, data: Object): Promise<any> {
        const segments = path.split('/').filter(v => v);
        if (segments.length % 2) {
            return this.afs.collection(path).add(data);
        }
        else {
            //            console.log(`updateAt: ${path} =>`);
            //            console.log(data);
            this.afs.doc(path).set(data, { merge: true });
        }
    }


    delete(path) {
        return this.afs.doc(path).delete();
    }

}
