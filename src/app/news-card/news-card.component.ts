import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../shared/model/news-article';
import { StarArticle, LikeArticle, ShowArticle } from '../shared//state/news.actions';
import { Store } from '@ngxs/store';

export enum NewsCardOrientation {
    leftToRight = 1,
    topToBottom,
    topToBottomSmall

}

export enum NewsCardSize {
    extraBig = 1,
    big,
    small
}
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {
    public NewsCardOrientation = NewsCardOrientation;
    public NewsCardSizeEnum = NewsCardSize;
    @Input() public newsCardOrientation: NewsCardOrientation = NewsCardOrientation.topToBottom;
    @Input() public newsCardSize: NewsCardSize = NewsCardSize.big;

    @Input() newsArticle: NewsArticle;
    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onComment: EventEmitter<any> = new EventEmitter();

    constructor(private store: Store) {


    }

    ngOnInit() {
        // console.log("NewsArticle:", this.newsArticle);
    }


    _onViewArticle() {
        this.store.dispatch(new ShowArticle(this.newsArticle));
    }

    _onLikeArticle() {
        // tslint:disable-next-line: no-use-before-declare
        this.store.dispatch(new LikeArticle(this.newsArticle));
    }
    _onStarArticle() {
        // tslint:disable-next-line: no-use-before-declare
        this.store.dispatch(new StarArticle(this.newsArticle));
    }

}


