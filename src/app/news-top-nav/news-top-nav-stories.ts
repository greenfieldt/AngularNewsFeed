import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatIconModule, MatBadgeModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { NewsTopNavComponent } from './news-top-nav.component';


export const newsTopNavActions = {
    onShowSources: action('onShowSources'),
    onShowPreferences: action('onShowPreferences'),
};

storiesOf('Nav Elements/Top Nav', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsTopNavComponent],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatToolbarModule,
                MatMenuModule,
            ],
        }),
    )
    .add('default', () => {
        return {
            component: NewsTopNavComponent,
            props: {
                onShowSources: newsTopNavActions.onShowSources,
                onShowPreferences: newsTopNavActions.onShowPreferences,

            },
        };
    })
