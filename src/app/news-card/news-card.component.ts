import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../model/news-article';

export const enum NewsCardOrientation {
    leftToRight = 1,
    topToBottom
}

export const enum NewsCardSize {
    extraBig = 1,
    big,
    small
}
@Component({
    selector: 'news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {

    @Input() newsCardOrientation = NewsCardOrientation.topToBottom;
    @Input() newsCardSize = NewsCardSize.big;

    @Input() newsArticle: NewsArticle;
    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onComment: EventEmitter<any> = new EventEmitter();

    constructor() {


    }

    ngOnInit() {
        //        console.log("NewsArticle:", this.newsArticle);
    }

    _onViewArticle() {
        this.onViewArticle.emit(this.newsArticle.articleURL);
    }
}
