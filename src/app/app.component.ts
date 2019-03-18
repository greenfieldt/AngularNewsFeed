import { Component, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
import { detectChanges } from '@angular/core/src/render3';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    myControl = new FormControl();

    articles$: Observable<any> = of([]);

    sources$: Observable<any>;

    @Output() numFS: 0;

    pagesize = 4;
    SICSubscription: Subscription;

    constructor(private newsService: NewsApiService) {

	console.log("app.component starting");
	
    }

    ngOnInit() {
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
