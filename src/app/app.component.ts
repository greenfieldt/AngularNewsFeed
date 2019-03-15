import { Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { detectChanges } from '@angular/core/src/render3';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store, Select } from '@ngxs/store';
import { NewsAction } from 'src/shared/state/news.actions';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SetNumCardsPerPage, SetNumCardsCachedPerGet } from 'src/shared/state/settings.actions';


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    newsCollection: AngularFirestoreCollection;


    @Select(state => state.settings.numCardsCachedPerGet) numCardsCachedPerGet$;
    @Select(state => state.settings.useLocalStorage) useLocalStorage$;

    nccpgSub: Subscription;
    ulsSub: Subscription;


    title = 'news-app';
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    myControl = new FormControl();

    articles$: Observable<any> = of([]);

    sources$: Observable<any>;

    @Output() numFS: 0;

    pagesize = 4;

    useLocalStorage: boolean = false;

    SICSubscription: Subscription;

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

        this.nccpgSub = this.numCardsCachedPerGet$.subscribe((x) => {
            this.pagesize = x;
        });

        this.ulsSub = this.useLocalStorage$.subscribe((x) => {
            this.useLocalStorage = x;
        });



        this.SICSubscription = this.scrollViewPort.scrolledIndexChange.pipe(
            //the news-api uses 1 based indexing for pages and I've already
            //loaded the first page of results to set up the observable
            map((x) => x + 2),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();

                //console.log("end", end);
                //console.log("total", total);
                if (end === total) {
                    this.newsService.getArticlesByPage(x, this.pagesize);
                }

            }),
        )
            .subscribe(/*(x) => console.log("svp:", x)*/);

        this.articles$ = this.newsService.initArticles("the-new-york-times", this.pagesize).
            pipe(
                //tap(x => console.log("A: " + x)),
                scan((a, n) => [...a, ...n], [])
            );


        this.sources$ = this.myControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(500),
                distinctUntilChanged(),
                tap(f => console.log("valueChanged: ", f)),
                map(f => f.toLowerCase()),
                switchMap((f: string) => {
                    return this.newsService.initSources().
                        pipe(
                            filter((source) => {
                                let match = 1;
                                //I need to handle the case of a word
                                //that doesn't match anything

                                //console.log("filter:", source);
                                //source = {id:"The New York Times"...}
                                //f = "The New"
                                //['The', 'New'].forEach(...
                                f.split(" ").forEach(x => {
                                    match &= source.id.toLowerCase().includes(x)
                                })
                                return match == 1;
                            }),
                            scan((a, b) => [...a, b], []),
                            tap((x) => {
                                this.numFS = x.length;
                                //console.log("Number of items :", x.length)
                            })
                        );
                })
            )

    }

    ngOnDestory() {
        this.nccpgSub.unsubscribe()
        this.ulsSub.unsubscribe()

    }

    updateState() {
        console.log("Dispatching NGXS action");
        this.store.dispatch(new NewsAction("Tim was here\n"));

    }

    openSettings() {
        let dialogRef = this.dialog.open(SettingsDialogComponent, { height: '300px', width: '600px' });
    }


    sourceClick(id: string) {

        this.articles$ = this.newsService.initArticles(id, this.pagesize).
            pipe(
                //tap(x => console.log(x)),
                scan((a, n) => [...a, ...n], [])

            );


        this.SICSubscription.unsubscribe();

        this.SICSubscription = this.scrollViewPort.scrolledIndexChange.pipe(
            //the news-api uses 1 based indexing for pages and I've already
            //loaded the first page of results to set up the observable
            map((x) => x + 2),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();
                //console.log("end", end);
                //console.log("total", total);
                if (end === total) {
                    this.newsService.getArticlesByPage(x, this.pagesize);
                }

            }),
        )
            .subscribe(/*(x) => console.log("svp:", x)*/);

    }
}
