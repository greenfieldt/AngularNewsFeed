import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatIconModule, MatBadgeModule } from '@angular/material';
import { CommentButtonComponent } from './comment-button.component';


export const commentActions = {
    onComment: action('onComment'),
};

storiesOf('Buttons/Comment Button', module)
    .addDecorator(
        moduleMetadata({
            declarations: [CommentButtonComponent],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatBadgeModule
            ],
        }),
    )
    .add('default (0 Comments)', () => {
        return {
            component: CommentButtonComponent,
            props: {
                numComments: 0,
                onComment: commentActions.onComment,
            },
        };
    })
    .add('> 0 Comments', () => {
        return {
            component: CommentButtonComponent,
            props: {
                numComments: 22,
                onComment: commentActions.onComment,
            },
        };
    })
