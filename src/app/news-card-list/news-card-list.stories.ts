import { NewsCardOrientation } from './../news-card/news-card.component';
import { storiesOf, moduleMetadata } from '@storybook/angular';
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
    MatInputModule,
    MatBadgeModule
} from '@angular/material';

import { HttpClientModule } from '@angular/common/http';

import { NewsCardListComponent } from './news-card-list.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';

import { Observable, of } from 'rxjs';
import { NewsSource } from '../shared/model/news-source';
import { NewsState } from '../shared/state/news.state';


import { Store, NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

//FireStore stuff
import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';

import { Component } from '@angular/core';
import { GetSources, InitArticles } from '../shared/state/news.actions';
import { LongContentPipe } from '../shared/pipe/long-content-pipe';
import { FlexLayoutModule } from '@angular/flex-layout';


@Component({
    template: `<div class='theme-wrapper default-theme'> <news-card-list [newsCardOrientation]="cardOrientation"></news-card-list> </div>`,
})
class HostDispatchStoreComponent {
    constructor(store: Store) {

        const newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };




        const newsSource$: Observable<NewsSource> = of(newsSource);
        store.dispatch(new GetSources());
        store.dispatch(new InitArticles(newsSource));
    }
}


export const newsCardListActions = {
};

const newsSource = {
    category: 'general',
    country: 'us',
    description: 'The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.',
    id: 'the-new-york-times',
    language: 'en',
    name: 'The New York Times',
    url: 'http://www.nytimes.com'
};

const newsSource$: Observable<NewsSource> = of(newsSource);

storiesOf('Composite/News Card List', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsCardListComponent,
                NewsCardComponent,
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
                ScrollingModule,
                HttpClientModule,
                NgxsModule.forRoot([NewsState]),
                NgxsReduxDevtoolsPluginModule.forRoot(),
                NgxsLoggerPluginModule.forRoot(),
                AngularFireModule.initializeApp(environment.firebase),
                AngularFireAuthModule,
                AngularFirestoreModule,


            ],
        }),
    )
    .add('default (left to right)', () => {
        return {
            component: HostDispatchStoreComponent,
            props: {
                cardOrientation: NewsCardOrientation.leftToRight
            },
        };
    }).add('default (top to bottom)', () => {
        return {
            component: HostDispatchStoreComponent,
            props: {
                cardOrientation: NewsCardOrientation.topToBottom
            },
        };
    })
