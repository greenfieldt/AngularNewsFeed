import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'



import { NewsCardComponent } from './news-card.component';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';


import { likeActions } from '../shared/like-button/like-button.stories'
import { starActions } from '../shared/star-button/star-button.stories'
import { commentActions } from '../shared/comment-button/comment-button.stories'
import { NewsArticle } from '../model/news-article';

export const testNewsArticle: NewsArticle = {
    sourceImage: "http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png",
    title: "Wait, How Did You Get Into College?",
    subTitle: "The New York Times",
    description: "How first-generation students learn about the myth of meritocracy.",
    articleImage: "https://static01.nyt.com/images/2019/03/17/opinion/sunday/17capocrucet/17capocrucet-facebookJumbo.jpg",
    articleURL: "https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html",
    numLikes: 1,
    comments: ["Comment One", "Comment Two", "Comment Three"],
    isStared: false
};

export const testNewsArticle_brokenImage: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_brokenImage.articleImage = "http://junklink/junkimage.png";

export const testNewsArticle_longTitle: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_longTitle.title = "Wait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?";


export const testNewsArticle_longDescription: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_longDescription.description = "How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.";

export const testNewsArticle_shortTitle: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_shortTitle.title = "Wait";

export const testNewsArticle_shortDescription: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_shortDescription.description = "How";



export const newsCardActions = {
    onViewArticle: action('onViewArticle'),
};


storiesOf('Composite/News Card', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsCardComponent,
                LikeButtonComponent,
                CommentButtonComponent,
                StarButtonComponent,
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatMenuModule,
                MatToolbarModule,
                MatIconModule,
                MatSidenavModule,
                MatListModule,
                MatFormFieldModule,
                MatAutocompleteModule,
                MatBadgeModule,
                FlexLayoutModule
            ],
        }),
    )
    .add('default', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    }).add('default (long title)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_longTitle" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle_longTitle,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })
    .add('default (short title)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_shortTitle" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle_shortTitle,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })
    .add('default (long description)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_longDescription" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle_longDescription,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })
    .add('default (short description)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_shortDescription" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle_shortDescription,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })
    .add('default (broken image)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_brokenImage" 
(onLiked)="onLiked($event)" 
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
 ></news-card>`,
            props: {
                testNewsArticle_brokenImage,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })


