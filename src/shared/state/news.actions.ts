import { NewsSource } from 'src/app/model/news-source';
import { NewsArticle } from 'src/app/model/news-article';

export class InitArticles {
    static readonly type = '[News] Initialize a stream of articles from server';
    constructor(public payload: NewsSource) { }
}

export class GetSources {
    static readonly type = '[News] Get a stream of Sources from server';
    constructor() { }
}

export class ArticlesLoaded {
    static readonly type = '[News] Articles have been loaded from the server';
    constructor() { }
}


export class GetMoreArticles {
    static readonly type = '[News] Get more articles from server';
    constructor() { }
}

export class StarArticle {
    static readonly type = '[News] Star article';
    constructor(public payload: NewsArticle) { }
}

export class LikeArticle {
    static readonly type = '[News] Like article';
    constructor(public payload: NewsArticle) { }
}

export class CommentArticle {
    static readonly type = '[News] Comment on article';
    constructor(public payload: NewsArticle) { }
}
