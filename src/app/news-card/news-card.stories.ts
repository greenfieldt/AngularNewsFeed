import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import {
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
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'



import { NewsCardComponent, NewsCardOrientation } from './news-card.component';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';


import { likeActions } from '../shared/like-button/like-button.stories'
import { starActions } from '../shared/star-button/star-button.stories'
import { commentActions } from '../shared/comment-button/comment-button.stories'
import { NewsArticle, NewsMetaInformation } from '../shared/model/news-article';
import { NgxsModule } from '@ngxs/store';
import { LongContentPipe } from '../shared/pipe/long-content-pipe';
import { Observable, of } from 'rxjs';


export const testNewsArticle: NewsArticle = {
    id: '12345657890987654321',
    sourceImage: 'http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png',
    author: 'SARA BONISTEEL',
    content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: 'Wait, How Did You Get Into Collee?',
    source: { id: 'the-new-york-times', name: 'The New York Times' },
    description: 'How first-generation stud ents learn about the  myth of meritocracy.',
    urlToImage: 'https://pixel.nymag.com/imgs/daily/intelligencer/2019/03/26/26-robert-mueller.w700.h467.jpg',
    url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
    //>numLikes: 1,
    //hasLiked: false,
    //comments: ['Comment One', 'Comment Two', 'Comment Three'],
    //isStared: false,
}

export const testNewsArticle_brokenImage: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_brokenImage.urlToImage = 'http://junklink/junkimage.png';
// where should we test for broken images -- not here right -- it is the css?
// testNewsArticle_brokenImage.articleImage = '../../assets/errorImg/cantLoadImg.png';

export const testNewsArticle_longTitle: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_longTitle.title = 'Wait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?\nWait, How Did You Get Into College?';


export const testNewsArticle_longDescription: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_longDescription.description = 'How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.How first-generation students learn about the myth of meritocracy.';

export const testNewsArticle_shortTitle: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_shortTitle.title = 'Wait';

export const testNewsArticle_shortDescription: NewsArticle = Object.assign({}, testNewsArticle);
testNewsArticle_shortDescription.description = 'How';

export const meta: NewsMetaInformation =
{
    id: '12345657890987654321',
    hasLiked: false,
    comments: [],
    isStared: false,
    numLikes: 0,
};


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
                LongContentPipe
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
                FlexLayoutModule,
                NgxsModule.forRoot()
            ],
        }),
    )
    .add('default', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle"
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })
    .add('default small card', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle"
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottomSmall,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })

    .add('default (long title)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle_longTitle"
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle_longTitle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
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
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle_shortTitle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
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
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle_longDescription,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
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
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle_shortDescription,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
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
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
 ></news-card>`,
            props: {
                testNewsArticle_brokenImage,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottom,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    }).add('default (card let to right)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle"
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
></news-card>`,
            props: {
                testNewsArticle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.leftToRight,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    }).add('default (small size)', () => {
        return {
            template: `<news-card [newsArticle]="testNewsArticle"
[meta$]="meta"
(onLiked)="onLiked($event)"
(onViewArticle)="onViewArticle($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)"
[newsCardOrientation]="cardOrientation"
></news-card>`,
            props: {
                testNewsArticle,
                meta: of(meta),
                cardOrientation: NewsCardOrientation.topToBottomSmall,
                onViewArticle: newsCardActions.onViewArticle,
                onLiked: likeActions.onLiked,
                onComment: commentActions.onComment,
                onStar: starActions.onStar

            },
        };
    })


