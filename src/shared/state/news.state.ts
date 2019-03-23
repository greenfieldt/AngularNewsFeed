import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { InitArticles, GetMoreArticles, GetSources, StarArticle, ArticlesLoaded, LikeArticle, CommentArticle, UpdateInterestedArticlestoCloud, GetInterestedArticlesFromCloud } from './news.actions';
import { NewsArticle } from 'src/app/model/news-article';
import { NewsApiService } from 'src/app/news-api.service';

import { tap, map, scan, first, mergeMap } from 'rxjs/operators';
import { pipe, Observable, of, Subscription } from 'rxjs';
import { NewsSource } from 'src/app/model/news-source';
import { SettingsState } from './settings.state';
import { OnDestroy } from '@angular/core';
import { DbService } from 'src/app/service/db.service';
import { delay } from 'q';


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

        return state.newsFeed.sort((a, b) => {
            if (a.isStared && !b.isStared)
                return -1;
            else if (!a.isStared && b.isStared)
                return 1;
            else {
                return a.publishedAt < b.publishedAt ? 1 : -1;
            }

        });
    }

    @Selector()
    public static interestedFeed(state: NewsStateModel): NewsArticle[] {

        return state.newsFeed.filter((a) => {
            return a.isStared || a.comments.length > 0 || a.numLikes > 0;
        });
    }

    @Selector()
    public static newsSources(state: NewsStateModel): NewsSource[] {
        return state.newsSources;
    }

    constructor(private newsService: NewsApiService, private store: Store, private db: DbService) {
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe()
        }
    }

    @Action(InitArticles)
    async initArticles(ctx: StateContext<NewsStateModel>,
        action: InitArticles) {
        let newsSource = action.payload;
        //I'm going to try and load 10 news stories and then 50 at a time to see
        //if that is a good compromise between fast load time and performance
        this._currentInfiniteNewsFeed = this.newsService.initArticles(newsSource, 10)
            .pipe(
                tap(articles => {
                    let _newsFeed: NewsArticle[] = ctx.getState().newsFeed;
                    let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_newsFeed, articles);
                    ctx.patchState({ newsFeed: mergedArray, loading: false });
                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();

        this.db.doc$('news/interestingFeed').pipe(
            tap((x) => {
                console.log("Get IARFC was called", x.intrestingArticles);
                this.store.dispatch(new GetInterestedArticlesFromCloud(x.intrestingArticles));
            })
        ).subscribe();


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

    @Action(StarArticle)
    starArticle(ctx: StateContext<NewsStateModel>, action: StarArticle) {
        let newsArticle_id: string = action.payload.id;
        let newsArticles: NewsArticle[] = ctx.getState().newsFeed;
        let updatedState = newsArticles.map((x) => {
            if (x.id === newsArticle_id)
                x.isStared = !x.isStared;
            return x
        });

        ctx.patchState({ newsFeed: updatedState });
        ctx.dispatch(new UpdateInterestedArticlestoCloud());
    }

    @Action(LikeArticle)
    likeArticle(ctx: StateContext<NewsStateModel>, action: LikeArticle) {
        let newsArticle: NewsArticle = action.payload;
        let newsArticles: NewsArticle[] = ctx.getState().newsFeed;
        let updatedState = newsArticles.map((x) => {
            if (x.id === newsArticle.id) {
                if (x.hasLiked == false) {
                    x.numLikes++;
                    x.hasLiked = true;
                }
                else {
                    x.numLikes--;
                    x.hasLiked = false;
                }

            }
            return x
        });
        ctx.patchState({ newsFeed: updatedState });
        return ctx.dispatch(new UpdateInterestedArticlestoCloud());

    }


    @Action(UpdateInterestedArticlestoCloud)
    updateInterestingArticlesToCloud(ctx: StateContext<NewsStateModel>) {
        let interestingArticles = this.store.selectSnapshot(NewsState.interestedFeed);

        this.db.updateAt('news/interestingFeed', { intrestingArticles: interestingArticles });

    }

    private mergeNewsArticlesArrays(a, b) {
        var hash = {};
        var ret = [];

        for (var i = 0; i < a.length; i++) {
            var e = a[i];
            if (!hash[e.id]) {
                hash[e.id] = true;
                ret.push(e);
            }
        }

        for (var i = 0; i < b.length; i++) {
            var e = b[i];
            if (!hash[e.id]) {
                hash[e.id] = true;
                ret.push(e);
            }
        }

        return ret;
    }


    @Action(GetInterestedArticlesFromCloud)
    getInterestingArticlesFromCloud(ctx: StateContext<NewsStateModel>,
        action: GetInterestedArticlesFromCloud) {
        let _newsFeed: NewsArticle[] = ctx.getState().newsFeed;
        let _cloudArticles: NewsArticle[] = action.payload;
        _cloudArticles.map((x) => { x.hasLiked = false; return x });
        let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_cloudArticles, _newsFeed);
        //        console.log(_newsFeed, _cloudArticles);
        //        console.log(mergedArray);
        ctx.patchState({ newsFeed: mergedArray });
    }

}

