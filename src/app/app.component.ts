import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable, defer, timer, Subject, of } from 'rxjs';
import { scan, switchMap, tap, map, mapTo, mergeMap, flatMap, concat } from 'rxjs/operators'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';

    articlesMeta$;

    articles$: Observable<any>;
    sources$: Observable<any>;
    myPage$ = new Subject();

    constructor(private newsService: NewsApiService) {
        console.log("app.component starting");
    }

    ngOnInit() {

        this.articles$ = this.newsService.initArticles().
            pipe(
                tap(x => console.log(x)),
                map(data => data['articles'])
            );

        this.myPage$.pipe(
            scan((x) => x = x + 1, 0),
            tap((x) => console.log("myPage accumlated: " + x)),
            map((pageNumber) => (

                this.articles$ =
                this.newsService.initArticles().
                    pipe(
                        tap(x => console.log(x)),
                        map(data => data['articles'])
                    ).pipe(
                        switchMap(() =>
                            this.newsService.getArticlesByPage(pageNumber).
                                pipe(
                                    tap(x => console.log(x)),
                                    map(data => data['articles'])
                                ))

                    )))).subscribe();





        this.sources$ = this.newsService.initSources().
            pipe(
                tap(x => console.log(x)),
                map(data => data['sources'])
            );

        this.myPage$.next(0);

    }




    sourceClick(id) {
        console.log(id);
        this.myPage$.next(5);
        /*
        this.articles$ = this.newsService.getArticlesByPage(0).
            pipe(
                tap(x => console.log(x)),
                map(data => data['articles'])
            );
    */
    }


}
