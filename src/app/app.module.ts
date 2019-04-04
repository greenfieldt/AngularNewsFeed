import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatDialogModule, MatSlideToggleModule, MatBadgeModule } from '@angular/material';
import { NewsApiService } from './shared/service/news-api.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NewsCardComponent } from './news-card/news-card.component';
import { LikeButtonComponent } from './shared/like-button/like-button.component';
import { CommentButtonComponent } from './shared/comment-button/comment-button.component';
import { StarButtonComponent } from './shared/star-button/star-button.component';
import { NewsTopNavComponent } from './news-top-nav/news-top-nav.component';
import { NewsSourceSelectorComponent } from './shared/news-source-selector/news-source-selector.component';
import { NewsCardListComponent } from './news-card-list/news-card-list.component';



import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AsyncStorageEngine, NgxsAsyncStoragePluginModule } from '@ngxs-labs/async-storage-plugin';

import { StorageService, FSSeralizer, FSDeSeralizer } from './shared/service/fire-store-storage.service'


import { NewsState } from './shared/state/news.state';

import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsState } from './shared/state/settings.state';


//FireStore stuff
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LongContentPipe } from './shared/pipe/long-content-pipe';
import { NewsGridComponent } from './news-grid/news-grid.component';
import { NewsGridListComponent } from './news-grid-list/news-grid-list.component';

import { createCustomElement } from '@angular/elements';


@NgModule({
    declarations: [
        AppComponent,
        NewsCardComponent,
        LikeButtonComponent,
        CommentButtonComponent,
        StarButtonComponent,
        NewsTopNavComponent,
        NewsSourceSelectorComponent,
        NewsCardListComponent,
        SettingsDialogComponent,
        LongContentPipe,
        NewsGridComponent,
        NewsGridListComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
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
        MatDialogModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        CommonModule,
        ScrollingModule,
        FlexLayoutModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        NgxsModule.forRoot([NewsState, SettingsState],
            { developmentMode: !environment.production }),
        NgxsStoragePluginModule.forRoot({ key: 'settings' }),
        //        NgxsAsyncStoragePluginModule.forRoot(StorageService, { serialize: FSSeralizer, deserialize: FSDeSeralizer }),
        //        NgxsReduxDevtoolsPluginModule.forRoot(),
        //        NgxsLoggerPluginModule.forRoot()

    ],
    providers: [NewsApiService],
    entryComponents: [SettingsDialogComponent],
    //    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(private injector: Injector) {

    }


    ngDoBootstrap() {
        const elements: any[] = [
            [AppComponent, 'news-source'],
        ];

        for (const [component, name] of elements) {
            const el = createCustomElement(component, { injector: this.injector });
            customElements.define(name, el);
        }
    }

}
