export class SetNumCardsPerPage {
    static readonly type = '[Settings] Set Number of News Cards Per Page';
    constructor(public payload: number) { }
}

export class SetNumCardsCachedPerGet {
    static readonly type = '[Settings] Set Number of News Cards Cached Per Get';
    constructor(public payload: number) { }
}

export class SetUseLocalStorage {
    static readonly type = '[Settings] Set Use Local Storage';
    constructor(public payload: boolean) { }
}

export class SetUseFireStore {
    static readonly type = '[Settings] Set Use FireStore';
    constructor(public payload: boolean) { }
}


