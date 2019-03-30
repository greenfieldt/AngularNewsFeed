import { NewsArticle } from '../shared/model/news-article'
import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { Store } from '@ngxs/store';
import { NewsCardComponent, NewsCardOrientation, NewsCardSize } from '../news-card/news-card.component';

export enum NewsGridLayout {
    //assumptions
    //Medium is 50% of a big
    //top to bottom small is 25% of a big
    //left to right small is 33%H of a big and 33%W 

    //large screen formats
    OneBig = 1,

    //smalls to the left are top to bottom
    //smalls under are top to bottom
    OneMediumFourToTheLeftEightUnder,


    //smalls to the left are top to bottom
    //smalls under are left to right
    OneMediumFourToTheLeftSixUnder,


    //mediums are side by side
    //smalls are left to right
    TwoMediumSixSmallUnder,

    //smalls are top to bottom
    SixteenSmalls,

    //smalls are left to right in rows of three
    EighteenSmalls,


    //small screen formats (all in vertical columns)
    TwoBigs = 10,         //two bigs 
    OneBigNineUnder,      //smalls left to right
    OneBigEightUnder,     //smalls top to bottom
    OneBigTwoMedium,      //mediums are top to bottom
    EightSmall,           //top to bottoms
    NineSmall,            //left to rights  

}


@Component({
    selector: 'app-news-grid',
    templateUrl: './news-grid.component.html',
    styleUrls: ['./news-grid.component.css']
})
export class NewsGridComponent implements OnInit {

    public NewsGridLayout = NewsGridLayout;

    @Input() newsArticles: NewsArticle[] = [];
    @Input() newsGridlayout: NewsGridLayout;

    @ViewChildren(NewsCardComponent) newsCards: any[];


    constructor(private store: Store) {
    }

    ngOnInit() {
        console.log("NewsArticles:", this.newsArticles);
    }

}
