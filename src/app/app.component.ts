import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';
    myControl = new FormControl();

    articles$: Observable<any> = of([]);
    sources$: Observable<any>;
    filteredSources$: Observable<any>;

    myPage$ = new Subject();
    pageSub: Subscription;

    pagesize = 4;


    constructor(private newsService: NewsApiService) {
        console.log("app.component starting");
    }

    ngOnInit() {

        this.articles$ = this.newsService.initArticles("the-new-york-times", this.pagesize).
            pipe(
                tap(x => console.log("A: " + x)),
            );


        this.pageSub = this.myPage$.pipe(
            //new-api requires you start the pagination on
            //page 1
            scan((x) => x = x + 1, 1),
            tap((x) => {
                console.log("myPage accumulated: " + x);
                this.newsService.getArticlesByPage(x, this.pagesize);
            })).subscribe();

        /*
                this.sources$ = this.newsService.initSources().
                    pipe(
                        tap(x => console.log("source: " + x)),
                        filter((x) => x.id.toString().
                            toLowerCase().includes("new")),
                        scan((a, b) => [...a, b], []),
                    );
        */

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
                                //I want to match on each word separated by white space
                                //console.log("filter:", source);
                                f.split(" ").forEach(x => {
                                    match &= source.id.toLowerCase().includes(x)
                                })
                                return match == 1;
                            }),
                            scan((a, b) => [...a, b], []),
                        );
                })
            )


    }


    loadNextPage() {
        console.log("Loading Next Page");
        this.myPage$.next(1);
    }


    sourceClick(id: string) {

        this.articles$ = this.newsService.initArticles(id).
            pipe(
                tap(x => console.log(x)),
            );

        this.pageSub.unsubscribe();
        //This doesn't seem totally right?
        this.pageSub = this.myPage$.pipe(
            //new-api requries you start the paginiation on
            //page 1
            scan((x) => x = x + 1, 1),
            tap((x) => {
                console.log("myPage accumlated: " + x);
                this.newsService.getArticlesByPage(x);
            })).subscribe();

    }


}
