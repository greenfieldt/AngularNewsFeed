import { LongContentPipe, NewsCardOrientation } from './../news-card/news-card.component';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'
import { HttpClientModule } from '@angular/common/http';

import { NewsCardListComponent } from './news-card-list.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';

import { Observable, of } from 'rxjs';
import { NewsSource } from '../model/news-source';



export const newsCardListActions = {
};

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
                HttpClientModule
            ],
        }),
    )
    .add('default', () => {
        return {
            //            component: NewsCardListComponent,
            template: `<news-card-list [newsCardOrientation]="cardOrientation" [newsSource$]="newsSource$"></news-card-list>`,
            props: {
                newsSource$: newsSource$,
                cardOrientation: NewsCardOrientation.leftToRight
            },
        };
    }).add('default (top to bottom)', () => {
      return {
          //            component: NewsCardListComponent,
          template: `<news-card-list [newsCardOrientation]="cardOrientation" [newsSource$]="newsSource$"></news-card-list>`,
          props: {
              newsSource$: newsSource$,
              cardOrientation: NewsCardOrientation.topToBottom
          },
      };
  })
