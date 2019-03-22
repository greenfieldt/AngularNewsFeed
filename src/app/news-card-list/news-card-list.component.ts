import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { NewsArticle } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import { NewsApiService } from '../news-api.service';
import {
  reduce,
  startWith,
  filter,
  scan,
  tap,
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Store, Select } from '@ngxs/store';
import {
  InitArticles,
  GetMoreArticles,
  GetSources
} from 'src/shared/state/news.actions';
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

  @Input() newsCardOrientation: NewsCardOrientation =
    NewsCardOrientation.topToBottom;

  intemSize: number;

  constructor(
    private newsService: NewsApiService,
    private store: Store,
    media: MediaObserver
  ) {
    media.media$.pipe().subscribe((change: MediaChange) => {
      console.log('aaa');
      if (this.newsCardOrientation === NewsCardOrientation.leftToRight) {
        if (change.mqAlias === 'xs') {
          this.intemSize = 140;
        } else if (change.mqAlias === 'sm') {
          console.log('ddd');
          this.intemSize = 160;
        } else {
          console.log('ccc');
          this.intemSize = 160;
        }
      } else {
        if (change.mqAlias === 'xs') {
          this.intemSize = 450;
        } else if (change.mqAlias === 'sm') {
          console.log('bbb');
          this.intemSize = 550;
        } else {
          console.log('ccc');
          this.intemSize = 550;
        }
      }
    });
  }

  onNewsCardStared($event) {
    console.log('onNewsCardStared Called', $event);
  }

  trackByIdx(i) {
    return i;
  }
  ngOnInit() {
    this.SICSubscription = this.scrollViewPort.scrolledIndexChange
      .pipe(
        // I noticed that you can get multiple calls to getMorearticles
        // when you are loading larger cache sizes so I added this debouncetime
        debounceTime(100),
        tap(x => {
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
      )
      .subscribe();
  }

  ngOnDestory() {
    this.SICSubscription.unsubscribe();
  }
}
