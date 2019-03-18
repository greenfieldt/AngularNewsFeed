import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatBadgeModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'

import { NewsCardListComponent } from './news-card-list.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LikeButtonComponent } from '../shared/like-button/like-button.component';
import { CommentButtonComponent } from '../shared/comment-button/comment-button.component';
import { StarButtonComponent } from '../shared/star-button/star-button.component';


import { likeActions } from '../shared/like-button/like-button.stories'
import { starActions } from '../shared/star-button/star-button.stories'
import { commentActions } from '../shared/comment-button/comment-button.stories'
import { HttpClientModule } from '@angular/common/http';



export const newsCardListActions = {
};

storiesOf('Composite/News Card List', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsCardListComponent,
                NewsCardComponent,
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
                FlexLayoutModule,
                ScrollingModule,
                HttpClientModule
            ],
        }),
    )
    .add('default', () => {
        return {
            component: NewsCardListComponent,
            props: {
                numLikes: 0,
            },
        };
    })
