import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../model/news-article';


@Component({
    selector: 'news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {

    @Input() newsArticle: NewsArticle;
    @Output() onViewArticle: EventEmitter<any> = new EventEmitter();
    @Output() onStar: EventEmitter<any> = new EventEmitter();
    @Output() onLiked: EventEmitter<any> = new EventEmitter();
    @Output() onComment: EventEmitter<any> = new EventEmitter();

    constructor() {


    }

    ngOnInit() {
        console.log("NewsArticle:", this.newsArticle);
    }

    _onViewArticle() {
        this.onViewArticle.emit(this.newsArticle.articleURL);
    }
}
