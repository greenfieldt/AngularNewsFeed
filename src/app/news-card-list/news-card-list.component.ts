import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
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

    @Input() newsSource$: Observable<NewsSource> = of(null);
    newsSourceSubscription: Subscription;

    articles$: Observable<NewsArticle[]>;
    cacheSize: number = 4;
    SICSubscription: Subscription;
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    constructor(private newsService: NewsApiService) {
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

        this.newsSourceSubscription = this.newsSource$.pipe(
            map(newsSource => {
                this.articles$ = this.newsService.initArticles(newsSource.id, this.cacheSize).
                    pipe(
                        //                tap(x => console.log("A: " + x)),
                        map(articles => {
                            return articles.map((article) => {
                                return {
                                    sourceImage: '../assets/images/' + newsSource.id + '.png',
                                    title: article.title,
                                    subTitle: newsSource.name,
                                    description: article.description,
                                    articleImage: article.urlToImage,
                                    articleURL: article.url,
                                    numLikes: 0,
                                    comments: [],
                                    isStared: false
                                }
                            })
                        }),
                        scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
                        //                tap((a) => console.log("B:", a))
                    );

            })).subscribe();
    }


    ngOnDestory() {
        this.SICSubscription.unsubscribe();
        this.newsSourceSubscription.unsubscribe();
    }
}
