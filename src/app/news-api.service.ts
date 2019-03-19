import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';
import { NewsArticle } from './model/news-article';
import { NewsSource } from './model/news-source';


const apiKey = '768c2adc37a143cb8688e12c40382c9f';


@Injectable({
    providedIn: 'root'
})
export class NewsApiService {
    newsSource: string = "the-new-york-times";
    page: number = 0;
    resultsPerPage: number = 20
    totalResults: number = -1;


    sourceStream: Subject<Object> = new Subject();
    resultStream: Subject<any[]> = new Subject();

    private cachedSources$;

    constructor(private httpClient: HttpClient) {
        this.cachedSources$ = this.httpClient.get('https://newsapi.org/v2/sources?apiKey=' + apiKey);

    }

    initSources(): Observable<any> {
        console.log("calling initSources");

        //using the chachedSources variable 
        this.cachedSources$.pipe(
            map(data => data['sources'] as NewsSource),
        )
            .subscribe(x => {
                this.sourceStream.next(x);
            });

        return this.sourceStream.asObservable();
    }


    initArticles(id: string = "the-new-york-times", pagesize = 5): Observable<any> {
        this.newsSource = id;
        //news-api requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }

    getArticlesByPage(page, pagesize = 5) {
        this.httpClient.get('https://newsapi.org/v2/everything?sources=' + this.newsSource + '&pageSize=' + pagesize + '&page=' + page + '&apiKey=' + apiKey).pipe(
            map(data => data['articles'])).
            subscribe(x => {
                console.log("articles by page publishing", x);
                //TODO type this data to our Newsarticle API
                this.resultStream.next(x);
            })
    }


}
