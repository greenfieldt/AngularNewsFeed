import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { forEach } from '@angular/router/src/utils/collection';


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


    constructor(private httpClient: HttpClient) { }

    initSources(): Observable<any> {
        console.log("calling initSources");
        this.httpClient.get('https://newsapi.org/v2/sources?apiKey=' + apiKey).pipe(
            map(data => data['sources']),
        )
            .subscribe(x => {
                //I need these to come through as separate
                //elements to get my filter working later on
                x.forEach(x => this.sourceStream.next(x));
            });

        return this.sourceStream.asObservable();
    }


    initArticles(id: string = "the-new-york-times", pagesize = 5): Observable<any> {
        console.log("Calling initArticles");
        this.newsSource = id;
        //news-api requires you to start pagination on page 1
        this.getArticlesByPage(1, pagesize);
        return this.resultStream.asObservable();
    }

    getArticlesByPage(page, pagesize = 5) {
        console.log(`Calling getArticlesByPage {page}`);
        this.httpClient.get('https://newsapi.org/v2/everything?sources=' + this.newsSource + '&pageSize=' + pagesize + '&page=' + page + '&apiKey=' + apiKey).pipe(
            map(data => data['articles'])).
            subscribe(x => {
                console.log("articles by page publishing", x);
                this.resultStream.next(x);
            })
    }


}
