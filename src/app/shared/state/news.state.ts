import { State, Action, Selector, StateContext, Store, createSelector } from '@ngxs/store';

import { tap, map, scan, first, mergeMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { pipe, Observable, of, Subscription } from 'rxjs';
import { SettingsState } from './settings.state';
import { OnDestroy } from '@angular/core';
import { produce } from 'immer'

import { NewsArticle, NewsMetaInformation } from '../model/news-article';
import { NewsSource } from '../model/news-source';
import { InitArticles, GetMoreArticles, GetSources, StarArticle, ArticlesLoaded, LikeArticle, ShowArticle, UpdateInterestedArticlestoCloud, GetInterestedArticlesFromCloud, ChangeNewsSource } from './news.actions';
import { NewsApiService } from '../service/news-api.service';
import { DbService } from '../service/db.service';
import { AuthService } from '../service/auth.service';


export class NewsStateModel {
    public newsFeed: {
        [id: string]: NewsArticle[]
    };
    public metaFeed: { [id: string]: NewsMetaInformation };
    public loading: boolean;
    public newsSources: NewsSource[];
    public sourcesLoaded: boolean;
}

@State<NewsStateModel>({
    name: 'news',
    defaults: {
        loading: true,
        newsFeed: { "default": [], "stared": [], "liked": [] },
        metaFeed: {},
        newsSources: [],
        sourcesLoaded: false
    }
})
export class NewsState implements OnDestroy {

    _pageNumber: number = 1;
    private _currentInfiniteNewsFeed: Observable<NewsArticle[]> = of([]);
    private _sub: Subscription;
    private _fssub: Subscription;

    @Selector()
    public static loading(state: NewsStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static newsFeed(state: NewsStateModel): NewsArticle[] {

        return produce(state.newsFeed["default"], (x) => {
            x.sort((a, b) => {
                return a.publishedAt < b.publishedAt ? 1 : -1;
            })
        });
    }


    @Selector()
    public static metaFeed(state: NewsStateModel): { [id: string]: NewsMetaInformation } {
        return state.metaFeed;
    }


    private _createMetaInformation(metaHash: { [id: string]: NewsMetaInformation },
        arrayType: string,
        articles: NewsArticle[])
        : { [id: string]: NewsMetaInformation } {
	/*
	  this is a two step process
	  1.) first we look at metaArray and merge any new information 
	  we find in articles (using the arrayType string which will tell
	  us what type of tag is being introduced) and then we have to merge that
	  result into any existing state we have
	*/
        articles.forEach((news_id) => {
            //if not let's start tracking it's meta information
            let x: NewsMetaInformation = {
                id: news_id.id,
                isStared: false,
                hasLiked: false,
                numLikes: 0,
                comments: []
            };
            //step 1 is it in the current processing array?
            //this will overwrite the meta array 
            let inMetaHash = metaHash[news_id.id];

            if (inMetaHash) {
                x = inMetaHash;
                //step 3 apply whatever our current changes we need 
                if (arrayType == 'stared') {
                    x.isStared = true;
                    x.numLikes = (news_id as any).numLikes;
                }
                else if (arrayType == 'liked') {
                    x.hasLiked = true;
                    x.numLikes = (news_id as any).numLikes;
                }

            }
            else {
                //step 3 apply whatever our current changes we need 
                if (arrayType == 'stared') {
                    x.isStared = true;
                    x.numLikes = (news_id as any).numLikes;

                }
                else if (arrayType == 'liked') {
                    x.hasLiked = true;
                    x.numLikes = (news_id as any).numLikes;

                }
                metaHash[news_id.id] = x;
            }
        })
        return metaHash;
    }

    @Selector()
    static getMetaInformation(state: NewsStateModel) {
        return (news_id: NewsArticle) => {
            const _mf = state.metaFeed[news_id.id];
            if (_mf) {
                //console.log(_mf[0]);
                return _mf;
            }
            else {
                throw (`Couldn't find meta information: ${news_id.id}`);
            }
        }
    }

    @Selector()
    public static newsSources(state: NewsStateModel): NewsSource[] {
        return state.newsSources;
    }

    constructor(private authService: AuthService, private newsService: NewsApiService, private store: Store, private db: DbService) {
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe()
        }
        if (this._fssub) {
            this._fssub.unsubscribe();
        }

    }

    @Action(ChangeNewsSource)
    async changeNewsSource(ctx: StateContext<NewsStateModel>,
        action: ChangeNewsSource) {

        //simple strategy to unsubscribe from the old news source and subscribe
        //to the new one

        if (this._sub)
            this._sub.unsubscribe();

        this._currentInfiniteNewsFeed = this.newsService.initArticles(action.payload, 50)
            .pipe(
                tap(articles => {
                    let _newsFeed: NewsArticle[] = ctx.getState().newsFeed["default"];
                    let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_newsFeed, articles);

                    let meta = [];

                    let origMetaState = produce(ctx.getState().metaFeed, draft => {

                        draft = this._createMetaInformation(draft,
                            "default",
                            mergedArray);
                    });

                    let nextNewsFeedState = produce(ctx.getState().newsFeed, draft => {
                        draft["default"] = mergedArray;
                    });


                    ctx.patchState({ newsFeed: nextNewsFeedState, metaFeed: origMetaState, loading: false });


                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();


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
                    let _newsFeed: NewsArticle[] = ctx.getState().newsFeed["default"];
                    let mergedArray: NewsArticle[] = this.mergeNewsArticlesArrays(_newsFeed, articles);

                    //We have new articles coming in here and we need to
                    //update their meta information

                    let meta = [];

                    let origMetaState = produce(ctx.getState().metaFeed, draft => {

                        draft = this._createMetaInformation(draft,
                            "default",
                            mergedArray);
                    });

                    let nextNewsFeedState = produce(ctx.getState().newsFeed, draft => {
                        draft["default"] = mergedArray;
                    });
                    ctx.patchState({ newsFeed: nextNewsFeedState, metaFeed: origMetaState, loading: false });

                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();



        let uid = await this.authService.UID();

        this._fssub = this.db.doc$(`userAggregate/${uid}`).pipe(
            //first(),
            tap((x) => {
//                console.log("Get IARFC was called", x);
                this.store.dispatch(new GetInterestedArticlesFromCloud(x));
            }),

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


    @Action(ShowArticle)
    showArticle(ctx: StateContext<NewsStateModel>, action: ShowArticle) {
        window.open(action.payload.url, "_blank");

    }


    @Action(StarArticle)
    async starArticle(ctx: StateContext<NewsStateModel>, action: StarArticle) {
        let uid = await this.authService.UID();
        let toCloud = { ...action.payload, uid: uid };

        let isStared;

        if (ctx.getState().metaFeed[action.payload.id]) {
            let meta = produce(ctx.getState().metaFeed, draft => {
                //set isStared to the orig value
                isStared = draft[action.payload.id].isStared

                draft[action.payload.id].isStared = !isStared;
            });

            ctx.patchState({ metaFeed: meta });

        }
        else {
            throw (`Star Article/Meta Search/${action.payload.id}`);
        }

        //isStared is the original value
        //The article hasn't been stared yet
        if (!isStared) {
            //this might be the first time the news article has
            //been interacted with 
            this.db.updateAt(`news/${action.payload.id}`, toCloud);
            this.db.updateInteracted(
                `userInteracted/${uid}_${action.payload.id}`,
                {
                    uid: uid,
                    news_id: action.payload.id,
                    tags: "stared"
                },
                'add'
            );
        }
        else {
            this.db.updateInteracted(
                `userInteracted/${uid}_${action.payload.id}`,
                {
                    uid: uid,
                    news_id: action.payload.id,
                    tags: "stared"
                },
                'remove'
            );
        }
        ctx.dispatch(new UpdateInterestedArticlestoCloud());
    }

    @Action(LikeArticle)
    async likeArticle(ctx: StateContext<NewsStateModel>, action: LikeArticle) {
        let uid = await this.authService.UID();
        let toCloud = { ...action.payload, uid: uid };

        let hasLiked: boolean;

        if (ctx.getState().metaFeed[action.payload.id]) {
            let meta = produce(ctx.getState().metaFeed, draft => {
                //set isStared to the orig value
                hasLiked = draft[action.payload.id].hasLiked
                if (hasLiked)
                    (draft[action.payload.id].numLikes)--;
                else
                    (draft[action.payload.id].numLikes)++;

                draft[action.payload.id].hasLiked = !hasLiked;
            });

            ctx.patchState({ metaFeed: meta });

        }
        else {
            throw (`Star Article/Meta Search/${action.payload.id}`);
        }

        //The article hasn't been liked yet
        if (!hasLiked) {
            //this might be the first time the news article has
            //been interacted with 
            this.db.updateAt(`news/${action.payload.id}`, toCloud);
            this.db.updateInteracted(
                `userInteracted/${uid}_${action.payload.id}`,
                {
                    uid: uid,
                    news_id: action.payload.id,
                    tags: "liked"
                },
                'add'
            );
        }
        else {
            this.db.updateInteracted(
                `userInteracted/${uid}_${action.payload.id}`,
                {
                    uid: uid,
                    news_id: action.payload.id,
                    tags: "liked"
                },
                'remove'
            );
        }
        return ctx.dispatch(new UpdateInterestedArticlestoCloud());
    }


    @Action(GetInterestedArticlesFromCloud)
    getInterestingArticlesFromCloud(ctx: StateContext<NewsStateModel>,
        action: GetInterestedArticlesFromCloud) {
        if (action == null) {
            console.log("Error GetInterestingArticlesFromCloud");
            return;
        }
        let _newsFeed: NewsArticle[] = ctx.getState().newsFeed["default"];
        let _staredArticles: NewsArticle[] = action.payload.staredArticles;
        let _likedArticles: NewsArticle[] = action.payload.likedArticles;


        let origMetaState = produce(ctx.getState().metaFeed, draft => {

            draft = this._createMetaInformation(draft,
                "stared",
                _staredArticles);

            draft = this._createMetaInformation(draft,
                "liked",
                _likedArticles);

        });


        ctx.patchState({ newsFeed: { "default": _newsFeed, "stared": _staredArticles, "liked": _likedArticles }, metaFeed: origMetaState });

    }


    private mergeNewsArticlesArrays(ourArray: NewsArticle[], theirArray: NewsArticle[]) {
        var hash = {};
        var ret = [];


        if (!ourArray)
            return theirArray;

        if (!theirArray)
            return ourArray;

        let ii = 0;

        for (var i = 0; i < ourArray.length; i++) {
            var e = ourArray[i];
            if (!(e.id in hash)) {
                //              console.log("AIOA:", e.id);
                hash[e.id] = i;
                ii++
                ret.push(e);
            }
        }

        for (var i = 0; i < theirArray.length; i++) {
            var e = theirArray[i];
            if (!(e.id in hash)) {
                //                console.log("AITA", e.id);
                hash[e.id] = ii;
                ii++;
                ret.push(e);
            }
            // else {
            //     //merge item!!!
            //     let mi = ret[hash[e.id]] as NewsArticle;
            // }
        }

        return ret;
    }



}

