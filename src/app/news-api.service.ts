import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



const apiKey = '768c2adc37a143cb8688e12c40382c9f';


@Injectable({
    providedIn: 'root'
})
export class NewsApiService {

    constructor(private httpClient: HttpClient) { }

    initSources(): Observable<any> {
        console.log("calling initSources");

        return this.httpClient.get('https://newsapi.org/v2/sources?apiKey=' + apiKey);
    }

    initArticles(): Observable<any> {
        console.log("Calling initArticles");
        return this.httpClient.get('https://newsapi.org/v2/top-headlines?sources=the-new-york-times&apiKey=' + apiKey);

    }

    getArticleById(id) {
        const geturl: string = 'https://newsapi.org/v2/top-headlines?sources=' + id + '&apiKey=' + apiKey;
        console.log(geturl);

        return this.httpClient.get(geturl);
    }

}
