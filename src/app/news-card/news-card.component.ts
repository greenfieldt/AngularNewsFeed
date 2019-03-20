import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NewsArticle } from '../model/news-article';

export enum NewsCardOrientation {
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
    public NewsCardOrientationEunm = NewsCardOrientation;
    @Input() newsCardOrientation: NewsCardOrientation = NewsCardOrientation.topToBottom;
    @Input() newsCardSize: NewsCardSize = NewsCardSize.big;

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


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longContent'
})
export class LongContentPipe implements PipeTransform {

  transform(value: string, args: string): string {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    const limit = args ? parseInt(args, 10) : 10;
    const trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
