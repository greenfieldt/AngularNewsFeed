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
    public metaFeed: NewsMetaInformation[];
    public loading: boolean;
    public newsSources: NewsSource[];
    public sourcesLoaded: boolean;
}

@State<NewsStateModel>({
    name: 'news',
    defaults: {
        loading: true,
        newsFeed: { "default": [], "stared": [], "liked": [] },
        metaFeed: [],
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
		/*
                if (a.isStared && !b.isStared)
                    return -1;
                else if (!a.isStared && b.isStared)
                    return 1;
                else {
*/
                return a.publishedAt < b.publishedAt ? 1 : -1;
                //              }

            })
        });
    }

    private _createMetaInformation(metaArray: NewsMetaInformation[],
        arrayType: string,
        articles: NewsArticle[],
        ctx: StateContext<NewsStateModel>)
        : NewsMetaInformation[] {
	/*
	  this is a two step process
	  1.) first we look at metaArray and merge any new information 
	  we find in articles (using the arrayType string which will tell
	  us what type of tag is being introduced) and then we have to merge that
	  result into any existing state we have
	*/


        articles.forEach((news_id) => {
            let meta = ctx.getState().metaFeed;

            //if not let's start tracking it's meta information
            let x: NewsMetaInformation = {
                id: news_id.id,
                isStared: false,
                hasLiked: false,
                comments: []
            };


            let si = -1;
            let li = -1;
            const state = ctx.getState();
            if (("stared" in state.newsFeed) && state.newsFeed["stared"])
                si = state.newsFeed["stared"].indexOf(news_id);

            if (("liked" in state.newsFeed) && state.newsFeed["liked"])
                li = state.newsFeed["liked"].indexOf(news_id);

            x.isStared = (si >= 0)//state.newsFeed["stared"].includes(news_id);
            x.hasLiked = (li >= 0)//state.newsFeed["liked"].includes(news_id);
            const nextState = produce(meta, draft => {
                const _mf = draft.filter((x) => x.id == (news_id.id));
                if (_mf && _mf.length == 1) {
                    console.log("AAA");
                    _mf[0].isStared = x.isStared;
                    _mf[0].hasLiked = x.hasLiked;
                }
                else {
                    console.log("BBBB");
                    draft.push(x);
                }


            });
            console.log("nextState", nextState);
            ctx.patchState({ metaFeed: nextState });
        })
    }

    @Selector()
    static getMetaInformation(state: NewsStateModel) {
        return (news_id: NewsArticle) => {
            const _mf = state.metaFeed.filter((x) => x.id == (news_id.id));
            if (_mf && _mf.length == 1) {
                //console.log(_mf[0]);
                return _mf[0];
            }
            else {
                throw (`Couldn't find meta information: ${news_id.id}`);
            }
        }
    }

    /*
        @Selector()
        public static interestedFeed(state: NewsStateModel): NewsArticle[] {
    
            return produce(state.newsFeed["stared"], (x) => {
                return x.filter((a) => {
                    return a.isStared || a.comments.length > 0 || a.numLikes > 0;
                })
            });
        }
    */
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

                    let meta = this._createMetaInformation([], mergedArray, ctx);

                    ctx.patchState({ newsFeed: { "default": mergedArray }, metaFeed: meta, loading: false });


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

                    let meta = this._createMetaInformation([], mergedArray, ctx);

                    ctx.patchState({ newsFeed: { "default": mergedArray }, metaFeed: meta, loading: false });

                    ctx.dispatch(new ArticlesLoaded());

                }
                )
            );
        this._sub = this._currentInfiniteNewsFeed.subscribe();

	/*
        this._fssub = this.db.doc$('news/interestingFeed').pipe(
            distinctUntilChanged(),
            tap((x) => {
                //console.log("Get IARFC was called", x);
                this.store.dispatch(new GetInterestedArticlesFromCloud(x.intrestingArticles));

            })
        ).subscribe();
*/
        //moving to better firestore db layout
        let uid = await this.authService.UID();

        this._fssub = this.db.doc$(`userAggregate/${uid}`).pipe(
            distinctUntilChanged(),
            tap((x) => {
                console.log("Get IARFC was called", x);
                this.store.dispatch(new GetInterestedArticlesFromCloud(x));
            }),

        ).subscribe();
        //////

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
        /*
                let newsArticles: NewsArticle[] = ctx.getState().newsFeed["default"];
        
                ctx.patchState({
                    newsFeed: {
                        "default": produce(newsArticles, (x) => {
                            x.map((y) => {
                                if (y.id == action.payload.id)
                                    y.isStared = !y.isStared;
                            })
                        })
                    }
                });
        */
        ////
        //moving to better firestore db layout
        let uid = await this.authService.UID();
        let toCloud = { ...action.payload, uid: uid };
        const isStared = ctx.getState().newsFeed["stared"].includes(action.payload);
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
        /////

        ctx.dispatch(new UpdateInterestedArticlestoCloud());
    }

    @Action(LikeArticle)
    async likeArticle(ctx: StateContext<NewsStateModel>, action: LikeArticle) {
        /*
                let newsArticle: NewsArticle = action.payload;
                let newsArticles: NewsArticle[] = ctx.getState().newsFeed["default"];
                let updatedState = produce(newsArticles, (x) => {
                    x.map((x) => {
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
                })
        
                ctx.patchState({ newsFeed: { "default": updatedState } });
        */
        ////
        //moving to better firestore db layout
        let uid = await this.authService.UID();
        let toCloud = { ...action.payload, uid: uid };
        const hasLiked = ctx.getState().newsFeed["liked"].includes(action.payload);

        //The article hasn't been stared yet
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
        /////
        return ctx.dispatch(new UpdateInterestedArticlestoCloud());
    }


    @Action(UpdateInterestedArticlestoCloud)
    updateInterestingArticlesToCloud(ctx: StateContext<NewsStateModel>) {
        /*
                let interestingArticles = this.store.selectSnapshot(NewsState.interestedFeed);
                this.db.updateAt('news/interestingFeed',
                    { intrestingArticles: interestingArticles }
                );
        */
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
        let meta: NewsMetaInformation[] = this._createMetaInformation([], _staredArticles, "star", ctx);
        this._createMetaInformation(meta, _likedArticles, "like", ctx);

        ctx.patchState({ newsFeed: { "default": _newsFeed, "stared": _staredArticles, "liked": _likedArticles }, metaFeed: meta });

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

