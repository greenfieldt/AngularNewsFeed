import { NewsSource } from 'src/app/model/news-source';

export class InitArticles {
    static readonly type = '[News] Initialize a stream of articles from server';
    constructor(public payload: NewsSource) { }
}

export class GetSources {
    static readonly type = '[News] Get a stream of Sources from server';
    constructor() { }
}

export class GetMoreArticles {
    static readonly type = '[News] Get more articles from server';
    constructor() { }
}
