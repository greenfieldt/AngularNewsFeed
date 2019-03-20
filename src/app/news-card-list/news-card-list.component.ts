import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import { NewsApiService } from '../news-api.service';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { NewsCardOrientation } from '../news-card/news-card.component';


@Component({
    selector: 'news-card-list',
    templateUrl: './news-card-list.component.html',
    styleUrls: ['./news-card-list.component.css']
})
export class NewsCardListComponent implements OnInit {

    @Input() newsSource$: Observable<NewsSource> = of(null);
    @Input() newsCardOrientation: NewsCardOrientation = NewsCardOrientation.leftToRight;
    articles$: Observable<NewsArticle[]>;
    cacheSize = 6;
    SICSubscription: Subscription;
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;
    intemSize: number;

    constructor(private newsService: NewsApiService, media: MediaObserver, ) {

        media.media$.pipe().subscribe((change: MediaChange) => {
            if (change.mqAlias <= '414') {
                this.intemSize = 400;
            }
            if (change.mqAlias === 'xs') {
                this.intemSize = 450;
            } if (change.mqAlias === 'sm') {
                this.intemSize = 550;
            } if (change.mqAlias === 'md') {
                this.intemSize = 550;
            } if (this.newsCardOrientation === NewsCardOrientation.leftToRight) {
              if (change.mqAlias === 'xs') {
                this.intemSize = 140;
            }
              if (change.mqAlias === 'sm') {
                this.intemSize = 160;
              }
              
          }
        });
    }

    
    ngOnInit() {
        this.SICSubscription = this.scrollViewPort.scrolledIndexChange.pipe(
            // the news-api uses 1 based indexing for pages and I've already
            // loaded the first page of results to set up the observable
            map((x) => x + 2),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();

                // console.log("end", end);
                // console.log("total", total);


                // on the first call end and total will be 0
                // and the page will be already loaded
                if (end && end === total) {
                    this.newsService.getArticlesByPage(x, this.cacheSize);
                }

            }),
        ).subscribe();

        this.articles$ = this.newsSource$.pipe(
            switchMap((newsSource) => {
                return this.newsService.initArticles(newsSource.id, this.cacheSize).
                    pipe(
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
                    );

            }));
    }


    ngOnDestory() {
        this.SICSubscription.unsubscribe();
    }
}
