import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import { NewsApiService } from '../news-api.service';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
    selector: 'news-card-list',
    templateUrl: './news-card-list.component.html',
    styleUrls: ['./news-card-list.component.css']
})
export class NewsCardListComponent implements OnInit {

    //TODO:I need to change this to an observable; get rid of the default
    //value; and handle the case of no newsSource
    //    @Input() newsSource: Observable<NewsSource>;
    @Input() newsSource: NewsSource;
    articles$: Observable<NewsArticle[]>;
    cacheSize: number = 4;
    SICSubscription: Subscription;
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    constructor(private newsService: NewsApiService) {
        this.newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };
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


                //on the first call end and total will be 0
                //and the page will be already loaded
                if (end && end === total) {
                    this.newsService.getArticlesByPage(x, this.cacheSize);
                }

            }),
        ).subscribe();

        this.articles$ = this.newsService.initArticles(this.newsSource.id, this.cacheSize).
            pipe(
                //                tap(x => console.log("A: " + x)),
                map(x => {
                    return x.map((y) => {
                        return {
                            sourceImage: '../assets/images/' + this.newsSource.id + '.png',
                            title: y.title,
                            subTitle: this.newsSource.name,
                            description: y.description,
                            articleImage: y.urlToImage,
                            articleURL: y.url,
                            numLikes: 0,
                            comments: [],
                            isStared: false
                        }
                    })
                }),
                scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
                //                tap((a) => console.log("B:", a))
            );


    }

}
