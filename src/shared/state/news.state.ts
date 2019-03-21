import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { InitArticles, GetMoreArticles, GetSources } from './news.actions';
import { NewsArticle } from 'src/app/model/news-article';
import { NewsApiService } from 'src/app/news-api.service';

import { tap, map, scan, first } from 'rxjs/operators';
import { pipe, Observable, of } from 'rxjs';
import { NewsSource } from 'src/app/model/news-source';
import { SettingsState } from './settings.state';


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
export class NewsState {

    _pageNumber: number = 1;
    public static _currentInfiniteNewsFeed: Observable<NewsArticle[]> = of([]);

    @Selector()
    public static loading(state: NewsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static newsFeed(state: NewsStateModel): NewsArticle[] {
        //If I'm going to return the obserable itself I think I need to make
        //it part of the state so I can slice it off and not have it get refreshed
        //everytime a the overall newsState is changed (if that is even possible)

        //console.log("(State) newFeed: NewsArticle[] :", this._currentInfiniteNewsFeed);
        //return NewsState._currentInfiniteNewsFeed;

        console.log("(State) News feed:", state.newsFeed);
        return state.newsFeed;
    }

    @Selector()
    public static newsSources(state: NewsStateModel): NewsSource[] {
        console.log("(State) newsSource:NewsSource[]", state.newsFeed);
        return state.newsSources;
    }

    constructor(private newsService: NewsApiService, private store: Store) {
    }

    @Action(InitArticles)
    async initArticles(ctx: StateContext<NewsStateModel>, action: InitArticles) {
        console.log("State: Init articles");

        let newsSource = action.payload;

        NewsState._currentInfiniteNewsFeed = this.newsService.initArticles(newsSource, 4)
            .pipe(
                //I'm going to accumulate the array here
                scan((a: NewsArticle[], n: NewsArticle[]) => [...a, ...n], []),
                tap(articles => {
                    //I'm not going to put these to the store just
                    //return the observable for performance reasons
                    ctx.patchState({ newsFeed: articles, loading: false })
                    console.log("Patched state to loading = false");
                }
                )
            )
        NewsState._currentInfiniteNewsFeed.subscribe();
    }

    @Action(GetMoreArticles)
    getMoreArticles(ctx: StateContext<NewsStateModel>, action: NewsStateModel) {
        this._pageNumber++;
        let cacheSize = this.store.selectSnapshot(SettingsState.getCacheSize);
        //cacheSize = 50;
        this.newsService.getArticlesByPage(this._pageNumber, cacheSize);
    }

    @Action(GetSources)
    getSources(ctx: StateContext<NewsStateModel>) {
        console.log("State: GetSources");
        this.newsService._initSources().pipe(
            tap(sources => {
                ctx.patchState({ newsSources: sources, sourcesLoaded: true })
                console.log("Get Sources patched to state", sources);
            }),
            first()
        ).subscribe();


    }

}
