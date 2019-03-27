import { NewsGridComponent } from './../news-grid/news-grid.component';
import { NewsGridListComponent } from './news-grid-list.component';
import { LongContentPipe, NewsCardOrientation } from '../news-card/news-card.component';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'
import { HttpClientModule } from '@angular/common/http';

import { NewsCardComponent } from '../news-card/news-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';

import { Observable, of } from 'rxjs';
import { NewsSource } from '../model/news-source';
import { NewsState } from 'src/shared/state/news.state';


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
import { GetSources, InitArticles } from 'src/shared/state/news.actions';

export const newsCardListActions = {
};


storiesOf('Composite/News Grid List', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsGridListComponent,
                NewsGridComponent,
                LikeButtonComponent,
                CommentButtonComponent,
                StarButtonComponent,
                LongContentPipe,
                NewsCardComponent
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
    .add('default (2 big articles grid)', () => {
        return {
          template: `<app-news-grid-list ></app-news-grid-list>`,
            props: {

            },
        };
    }).add('default (top to bottom)', () => {
        return {
          template: `<app-news-grid-list></app-news-grid-list>`,
            props: {

            },
        };
    })
