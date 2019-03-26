import { Component, OnInit, Input, EventEmitter, Output, Pipe, PipeTransform } from '@angular/core';
import { NewsArticle } from '../model/news-article';
import { Store } from '@ngxs/store';
import { LikeArticle, StarArticle } from 'src/shared/state/news.actions';

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
  selector: 'app-news-grid',
  templateUrl: './news-grid.component.html',
  styleUrls: ['./news-grid.component.css']
})
export class NewsGridComponent implements OnInit {

  public NewsCardOrientationEunm = NewsCardOrientation;
    @Input() newsCardOrientation: NewsCardOrientation = NewsCardOrientation.topToBottom;
    @Input() newsCardSize: NewsCardSize = NewsCardSize.big;

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
        this.onViewArticle.emit(this.newsArticle.url);
    }

    _onLikeArticle() {
        this.store.dispatch(new LikeArticle(this.newsArticle));
    }
    _onStarArticle() {
        this.store.dispatch(new StarArticle(this.newsArticle));
    }

}

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
