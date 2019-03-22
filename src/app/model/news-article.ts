export class NewsArticle {
    id: string = "";
    sourceImage: string = "";
    title: string = "";
    subTitle: string = "";
    description: string = "";
    articleImage: string = "";
    articleURL: string = "";

    numLikes: number = -1;
    hasLiked: boolean = false;
    comments: string[] = [];
    isStared: boolean = false;
}

