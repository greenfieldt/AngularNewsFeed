import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';

    articles: Array<any>;
    sources: Array<any>;

    constructor(private newsService: NewsApiService) {
        console.log("app.component starting");
    }


    ngOnInit() {
        this.newsService.initArticles().pipe(
            tap(x => console.log(x)))
            .subscribe(data => this.articles = data['articles']);

        this.newsService.initSources().pipe(
            tap(x => console.log(x)))
            .subscribe(data => this.sources = data['sources']);

    }

    sourceClick(id) {
        console.log(id);
        this.articles = [];
        this.newsService.getArticleById(id).pipe(
            tap(x => console.log(x)))
            .subscribe(data => this.articles = data['articles']);

    }


}
