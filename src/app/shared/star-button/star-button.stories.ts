import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatIconModule, MatBadgeModule } from '@angular/material';
import { StarButtonComponent } from './star-button.component';


export const starActions = {
    onStar: action('onStar'),
};

storiesOf('Buttons/Star Button', module)
    .addDecorator(
        moduleMetadata({
            declarations: [StarButtonComponent],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatBadgeModule
            ],
        }),
    )
    .add('default (not Stared)', () => {
        return {
            template: `<star-button [stared]='stared' (onStar)='onStar($event)'></star-button>`,
            props: {
                stared: false,
                onStar: starActions.onStar,
            },
        };
    })
    .add('Stared', () => {
        return {
            template: `<star-button [stared]='stared' (onStar)='onStar($event)'></star-button>`,
            props: {
                stared: true,
                onStar: starActions.onStar,
            },
        };
    })
