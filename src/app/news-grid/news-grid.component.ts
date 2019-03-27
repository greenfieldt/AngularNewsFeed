import { NewsArticle } from './../model/news-article';
import { Component, OnInit, Input, EventEmitter, Output, Pipe, PipeTransform, ViewChildren } from '@angular/core';
import { Store } from '@ngxs/store';
import { LikeArticle, StarArticle } from 'src/shared/state/news.actions';
import { NewsCardComponent, NewsCardOrientation, NewsCardSize } from '../news-card/news-card.component';

export enum NewsGridLayout {
    OneBigThreeToTheLeft,
    OneBigTwoUnder
    //etc
}


@Component({
    selector: 'app-news-grid',
    templateUrl: './news-grid.component.html',
    styleUrls: ['./news-grid.component.css']
})
export class NewsGridComponent implements OnInit {


    @Input() newsArticles: NewsArticle[] = [];
    @ViewChildren(NewsCardComponent) newsCards: any[];



  public NewsCardOrientationEunm = NewsCardOrientation;
    @Input() newsCardOrientation: NewsCardOrientation = NewsCardOrientation.topToBottom;
   // @Input() newsCardSize: NewsCardSize = NewsCardSize.big;
/*
    @Input() newsArticle: NewsArticle;
    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onComment: EventEmitter<any> = new EventEmitter();
*/
    constructor(private store: Store) {


    }

    ngOnInit() {
         console.log("NewsArticles:", this.newsArticles);
    }

    /*
        _onViewArticle() {
            this.onViewArticle.emit(this.newsArticle.url);
        }

        _onLikeArticle() {
            this.store.dispatch(new LikeArticle(this.newsArticle));
        }
        _onStarArticle() {
            this.store.dispatch(new StarArticle(this.newsArticle));
        }
*/
}
