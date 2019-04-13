import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NewsArticle, NewsMetaInformation } from '../shared/model/news-article';

import { tap, debounceTime } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Store, Select } from '@ngxs/store';
import { GetMoreArticles } from '../shared/state/news.actions';
import { NewsState } from '../shared/state/news.state';
import { NewsCardOrientation } from '../news-card/news-card.component';

@Component({
    selector: 'news-card-list',
    templateUrl: './news-card-list.component.html',
    styleUrls: ['./news-card-list.component.css']
})
export class NewsCardListComponent implements OnInit {
    @Select(NewsState.newsFeed) articles$: Observable<NewsArticle[]>;
    @Select(NewsState.metaFeed) meta$: Observable<{ [id: string]: NewsMetaInformation }>;


    SICSubscription: Subscription;


    @ViewChild(CdkVirtualScrollViewport) scrollViewPort: CdkVirtualScrollViewport;

    @Input() newsCardOrientation: NewsCardOrientation =
        NewsCardOrientation.topToBottom;


    intemSize: number;

    constructor(private store: Store, media: MediaObserver) {


        media.media$.pipe().subscribe((change: MediaChange) => {
            if (change.mqAlias <= '414') {
                this.intemSize = 400;
            }
            if (change.mqAlias === 'xs') {
                this.intemSize = 450;
            } if (change.mqAlias === 'sm') {
                this.intemSize = 544;
            } if (change.mqAlias === 'md') {
                this.intemSize = 544;
            } if (this.newsCardOrientation === NewsCardOrientation.leftToRight) {
                if (change.mqAlias === 'xs') {
                    this.intemSize = 140;
                }
                if (change.mqAlias === 'sm') {
                    this.intemSize = 160;
                }
                if (change.mqAlias === 'md') {
                    this.intemSize = 160;
                }

            }
        });
    }

    onNewsCardStared($event) {
        console.log("onNewsCardStared Called", $event);
    }

    trackByIdx(i, newsArticle: NewsArticle) {
        return newsArticle.id;
    }
    ngOnInit() {

        //Todo
        //change this to an interesection observer 
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
