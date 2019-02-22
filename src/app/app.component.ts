import { Component } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators'


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'news-app';

    articles$: Observable<any>;
    sources$: Observable<any>;

    constructor(private newsService: NewsApiService) {
        console.log("app.component starting");
    }


    ngOnInit() {
        this.articles$ = this.newsService.initArticles().
            pipe(
                tap(x => console.log(x)),
                map(data => data['articles'])
            )


        this.sources$ = this.newsService.initSources().
            pipe(
                tap(x => console.log(x)),
                map(data => data['sources'])
            );
    }

    sourceClick(id) {
        console.log(id);
        this.articles$ = this.newsService.getArticleById(id)
            .pipe(
                tap(x => console.log(x)),
                map(data => data['articles'])

            );

    }


}
