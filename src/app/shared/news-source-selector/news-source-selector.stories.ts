import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatAutocompleteModule, MatCardModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatOptionModule } from '@angular/material';
import { NewsSourceSelectorComponent } from './news-source-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



export const newsSourceActions = {
    onClosed: action('onClosed'),
    onSourceClicked: action('onSourceClicked')
};



storiesOf('Inputs/News Source Selector', module)
    .addDecorator(
        moduleMetadata({
            declarations: [NewsSourceSelectorComponent],
            imports: [
                MatAutocompleteModule,
                MatCardModule,
                MatFormFieldModule,
                FormsModule,
                MatInputModule,
                MatMenuModule,
                MatOptionModule,
                ReactiveFormsModule,
                HttpClientModule,
                BrowserAnimationsModule

            ],
        }),
    )
    .add('default', () => {
        return {
            component: NewsSourceSelectorComponent,
            props: {
                numLikes: 0,

            },
        };
    })
