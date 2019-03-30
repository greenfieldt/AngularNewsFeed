import { NewsArticle } from '../shared/model/news-article'
import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { Store } from '@ngxs/store';
import { NewsCardComponent, NewsCardOrientation, NewsCardSize } from '../news-card/news-card.component';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
    selector: 'app-news-grid',
    templateUrl: './news-grid.component.html',
    styleUrls: ['./news-grid.component.css']
})
export class NewsGridComponent implements OnInit {

    public NewsCardOrientation = NewsCardOrientation;

    @Input() newsArticles$: Observable<NewsArticle[]> = of([]);

    @ViewChildren(NewsCardComponent) newsCards: any[];


    constructor(private store: Store) {
    }

    ngOnInit() {
    }

}
