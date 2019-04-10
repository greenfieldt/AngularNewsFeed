import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatIconModule, MatBadgeModule } from '@angular/material';
import { LikeButtonComponent } from './like-button.component';

export const likeActions = {
    onLiked: action('onLiked'),
};

storiesOf('Buttons/Like Button', module)
    .addDecorator(
        moduleMetadata({
            declarations: [LikeButtonComponent],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatBadgeModule
            ],
        }),
    )
    .add('default (0 likes)', () => {
        return {
            template: `<like-button [numLikes] = "numLikes" (onLiked)="onLiked($event)"></like-button>`,
            props: {
                numLikes: 0,
                onLiked: likeActions.onLiked,
            },
        };
    })
    .add('> 0 likes', () => {
        return {
            template: `<like-button [numLikes] = "numLikes" (onLiked)="onLiked($event)"></like-button>`,
            props: {
                numLikes: 22,
                onLiked: likeActions.onLiked,
            },
        };
    }).add('> 0 likes; has liked', () => {
        return {
            template: `<like-button [numLikes] = "numLikes" (onLiked)="onLiked($event)"></like-button>`,
            props: {
                numLikes: 23,
                hasLiked: true,
                onLiked: likeActions.onLiked,
            },
        };
    })
