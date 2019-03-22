import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import { NewsApiService } from '../news-api.service';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Store, Select } from '@ngxs/store';
import { InitArticles, GetMoreArticles, GetSources } from 'src/shared/state/news.actions';
import { NewsState } from 'src/shared/state/news.state';
import { NewsCardOrientation } from '../news-card/news-card.component';


@Component({
    selector: 'news-card-list',
    templateUrl: './news-card-list.component.html',
    styleUrls: ['./news-card-list.component.css']
})
export class NewsCardListComponent implements OnInit {

    @Select(NewsState.newsFeed) articles$: Observable<NewsArticle[]>;

    SICSubscription: Subscription;
    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    @Input() newsCardOrientation: NewsCardOrientation = NewsCardOrientation.topToBottom;


    intemSize: number;

    constructor(private newsService: NewsApiService,
        private store: Store, media: MediaObserver) {

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

    onNewsCardStared($event) {
        console.log("onNewsCardStared Called", $event);
    }

    trackByIdx(i) {
        return i;
    }
    ngOnInit() {
        this.SICSubscription = this.scrollViewPort.scrolledIndexChange.pipe(
            //I noticed that you can get multiple calls to getMorearticles
            //when you are loading larger cache sizes so I added this debouncetime
            debounceTime(100),
            tap((x) => {
                const end = this.scrollViewPort.getRenderedRange().end;
                const total = this.scrollViewPort.getDataLength();

                // console.log("end", end);
                // console.log("total", total);


                // on the first call end and total will be 0
                // and the page will be already loaded
                if (end && end === total) {
                    this.store.dispatch(new GetMoreArticles());
                }

            })
        ).subscribe();

    }


    ngOnDestory() {
        this.SICSubscription.unsubscribe();
    }
}
