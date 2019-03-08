import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable, defer, timer, Subject, of, Subscription } from 'rxjs';
import { scan, switchMap, tap, map, mapTo, mergeMap, flatMap, concatMap } from 'rxjs/operators'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';

    articles$: Observable<any> = of([]);
    sources$: Observable<any>;
    myPage$ = new Subject();
    pageSub: Subscription;

    constructor(private newsService: NewsApiService) {
        console.log("app.component starting");
    }

    ngOnInit() {

        this.articles$ = this.newsService.initArticles("the-new-york-times").
            pipe(
                tap(x => console.log("A: " + x)),
            );


        //I'm trying to take my new service obserbable and
        //pump it's data into my articles$ so that the ngFor
        //loop keeps displaying more and more 
        // this.newsService.initArticles().
        //     pipe(
        //         tap(x => console.log("A: " + x)),
        //         concatMap(x => this.articles$)
        //     ).subscribe();

        this.pageSub = this.myPage$.pipe(
            //new-api requries you start the paginiation on
            //page 1
            scan((x) => x = x + 1, 1),
            tap((x) => {
                console.log("myPage accumlated: " + x);
                this.newsService.getArticlesByPage(x);
            })).subscribe();


        this.sources$ = this.newsService.initSources().
            pipe(
                tap(x => console.log("B: " + x)),
                map(data => data['sources'])
            );
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
