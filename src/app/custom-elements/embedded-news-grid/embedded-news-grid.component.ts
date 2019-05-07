import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { of, Observable } from 'rxjs'
import { GetSources, InitArticles, InitNewsAPIArticles } from 'src/app/shared/state/news.actions';
import { NewsCardSize, NewsCardOrientation } from 'src/app/news-card/news-card.component';
import { NewsArticle } from 'src/app/shared/model/news-article';
import { NewsState } from 'src/app/shared/state/news.state';
import { Login } from 'src/app/shared/state/auth.actions';
import { take, tap, map } from 'rxjs/operators';

@Component({
    //  selector: 'app-embedded-news-grid',
    templateUrl: './embedded-news-grid.component.html',
    styleUrls: ['./embedded-news-grid.component.scss']
})
export class EmbeddedNewsGridComponent implements OnInit {
    theme$ = of('default-theme');
    public NewsCardOrientation = NewsCardOrientation;
    public NewsCardSize = NewsCardSize;

    listOfArticles: Observable<NewsArticle[]>;
    //@Select(NewsState.starFeed) listOfArticles;


    constructor(private store: Store) { }

    ngOnInit() {
        const newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };



        //      this.store.dispatch(new GetSources());
        this.store.dispatch(new InitArticles());
        //        this.store.dispatch(new InitNewsAPIArticles(newsSource));

        this.listOfArticles =
            this.store.select(NewsState.starFeed).pipe(
                map((x: NewsArticle[]) => x.slice(0, 8)),
                tap((x) => console.log("articles", x))
            );
    }

    login() {
        this.store.dispatch(new Login());
    }

}
