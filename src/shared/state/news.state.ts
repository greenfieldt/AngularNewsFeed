import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { InitArticles, GetMoreArticles, GetSources } from './news.actions';
import { NewsArticle } from 'src/app/model/news-article';
import { NewsApiService } from 'src/app/news-api.service';

import { tap, map, scan, first } from 'rxjs/operators';
import { pipe, Observable, of, Subscription } from 'rxjs';
import { NewsSource } from 'src/app/model/news-source';
import { SettingsState } from './settings.state';
import { OnDestroy } from '@angular/core';


export class NewsStateModel {
    public newsFeed: NewsArticle[];
    public loading: boolean;
    public newsSources: NewsSource[];
    public sourcesLoaded: boolean;
}

@State<NewsStateModel>({
    name: 'news',
    defaults: {
        loading: true,
        newsFeed: [],
        newsSources: [],
        sourcesLoaded: false
    }
})
export class NewsState implements OnDestroy {

    _pageNumber: number = 1;
    private _currentInfiniteNewsFeed: Observable<NewsArticle[]> = of([]);
    private _sub: Subscription;
    @Selector()
    public static loading(state: NewsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static newsFeed(state: NewsStateModel): NewsArticle[] {
        return state.newsFeed;
    }

    @Selector()
    public static newsSources(state: NewsStateModel): NewsSource[] {
        return state.newsSources;
    }

    constructor(private newsService: NewsApiService, private store: Store) {
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe()
        }
    }

    @Action(InitArticles)
    async initArticles(ctx: StateContext<NewsStateModel>, action: InitArticles) {
        let newsSource = action.payload;
        //I'm going to try and load 10 news stories and then 50 at a time to see
        //if that is a good compromise between fast load time and performance
        this._currentInfiniteNewsFeed = this.newsService.initArticles(newsSource, 10)
            .pipe(
                //I'm going to accumulate the array here and then patch
                //an ever big array into the state -- this doesn't seem
                //very efficient 
                scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
                tap(articles => {
                    //the ngxs logger is always one state behind when
                    //I do things this way but I think that is a
                    //side effect of the logger 
                    ctx.patchState({ newsFeed: articles, loading: false })
                }
                )
            )
        this._sub = this._currentInfiniteNewsFeed.subscribe();
    }

    @Action(GetMoreArticles)
    getMoreArticles(ctx: StateContext<NewsStateModel>, action: NewsStateModel) {
        this._pageNumber++;
        let cacheSize = this.store.selectSnapshot(SettingsState.getCacheSize);
        ctx.patchState({ loading: true })
        this.newsService.getArticlesByPage(this._pageNumber, cacheSize);
    }

    @Action(GetSources)
    getSources(ctx: StateContext<NewsStateModel>) {
        this.newsService._initSources().pipe(
            tap(sources => {
                ctx.patchState({ newsSources: sources, sourcesLoaded: true })
            }),
            first()
        ).subscribe();


    }

}
