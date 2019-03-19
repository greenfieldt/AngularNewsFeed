import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule } from '@angular/material';
import { NewsApiService } from './news-api.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout'
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NewsCardComponent, LongContentPipe } from './news-card/news-card.component';
import { LikeButtonComponent } from './shared/like-button/like-button.component';
import { CommentButtonComponent } from './shared/comment-button/comment-button.component';
import { StarButtonComponent } from './shared/star-button/star-button.component';
import { NewsTopNavComponent } from './news-top-nav/news-top-nav.component';
import { NewsSourceSelectorComponent } from './shared/news-source-selector/news-source-selector.component';
import { NewsCardListComponent} from './news-card-list/news-card-list.component';



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
        LongContentPipe
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
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        CommonModule,
        ScrollingModule,
        FlexLayoutModule,
    ],
    providers: [NewsApiService],
    bootstrap: [AppComponent]
})
export class AppModule {

}
