import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore'
import { map, tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DbService {
    constructor(private afs: AngularFirestore) {
    }

    collection$(path, query?) {
        console.log(`db.collections: Asking for ${path}, (${query})`);
        return this.afs.collection(path, query).snapshotChanges().pipe(
            tap(x => console.log(x)),
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
            console.log(`updateAt: ${path} =>`);
            console.log(data);
            this.afs.doc(path).set(data, { merge: true });
        }
    }

    delete(path) {
        return this.afs.doc(path).delete();
    }

}
