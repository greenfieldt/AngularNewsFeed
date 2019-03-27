import { Component } from '@angular/core';
import { NewsApiService } from './shared/service/news-api.service';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { detectChanges } from '@angular/core/src/render3';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store, Select } from '@ngxs/store';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SetNumCardsPerPage, SetNumCardsCachedPerGet } from './shared/state/settings.actions';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


import { GetSources, InitArticles } from './shared/state/news.actions';
import { NewsSource } from './shared/model/news-source';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    newsCollection: AngularFirestoreCollection;

    @Select(state => state.settings.useLocalStorage) useLocalStorage$;
    ulsSub: Subscription;



    title = 'news-app';
    myControl = new FormControl();

    useLocalStorage: boolean = false;

    constructor(private newsService: NewsApiService, private store: Store, private dialog: MatDialog, private storage: AngularFirestore) {

        console.log("app.component starting");
        this.newsCollection = this.storage.collection('news');


        //this class really shouldn't know anything about FireStore but the code
        //needs to go somewhere where it can get the afs and store pointers
        this.newsCollection.stateChanges().pipe(
            mergeMap(actions => actions),
            map(action => {
                let _action = action.type;
                let data = action.payload.doc.data();
                let id = action.payload.doc.id;
                console.log("Action from Firebase:", _action, id, data);
                if (_action == "modified") {
                    console.log("resetting store to firestore");
                    //Right now I'm at a loss of what to do when I get
                    //updated data from FireStore.  In ngrx examples i think
                    //they were able to dispatch actions by carefully naming
                    //everything so it would just work.  I might be able to do that
                    //here.  For each slice I would have always the same actions
                    //that are mimicking what Firestore ends back but I need
                    //to think about it more

                    store.reset(JSON.parse(data.val))
                }


            })).subscribe();


    }

    ngOnInit() {

        this.ulsSub = this.useLocalStorage$.subscribe((x) => {
            this.useLocalStorage = x;
        });


        const newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };




        const newsSource$: Observable<NewsSource> = of(newsSource);
        this.store.dispatch(new GetSources());
        this.store.dispatch(new InitArticles(newsSource));



    }

    ngOnDestory() {
        this.ulsSub.unsubscribe()

    }

    updateState() {
        //        console.log("Dispatching NGXS action");
        //        this.store.dispatch(new NewsAction("Tim was here\n"));

    }

    openSettings() {
        let dialogRef = this.dialog.open(SettingsDialogComponent, { height: '300px', width: '600px' });
    }


    sourceClick(id: NewsSource) {
        console.log("New News Source:", id);
        //        this.store.dispatch(new ChangeNewsSource(id));

    }
}
