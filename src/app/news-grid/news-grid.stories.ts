

import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule, } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'



import { NewsGridComponent, } from './news-grid.component';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';


import { likeActions } from '../shared/like-button/like-button.stories'
import { starActions } from '../shared/star-button/star-button.stories'
import { commentActions } from '../shared/comment-button/comment-button.stories'
import { NewsArticle } from '../model/news-article';
import { NgxsModule } from '@ngxs/store';
import { NewsCardComponent } from '../news-card/news-card.component';


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
    numLikes: 1,
    hasLiked: false,
    comments: ['Comment One', 'Comment Two', 'Comment Three'],
    isStared: false,
}



export const newsCardActions = {
    onViewArticle: action('onViewArticle'),
};


storiesOf('Composite/News Grid', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsGridComponent,
                LikeButtonComponent,
                CommentButtonComponent,
                StarButtonComponent,
                NewsCardComponent,
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
    .add('default (grid 2 big and 3 small cards)', () => {
        return {
            template: `<app-news-grid [newsArticles]="listOfArticles"

 ></app-news-grid>`,
            props: {
                listOfArticles: [testNewsArticle, testNewsArticle, testNewsArticle, testNewsArticle]

            },
        };
    })
