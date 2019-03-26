import { AngularFirestoreModule } from '@angular/fire/firestore';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatAutocompleteModule, MatCardModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatOptionModule } from '@angular/material';
import { NewsSourceSelectorComponent } from './news-source-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { NewsState } from 'src/shared/state/news.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { Component } from '@angular/core';
import { GetSources } from 'src/shared/state/news.actions';

@Component({

  template: `<news-source-selector></news-source-selector>`
})

class HostDispatchStoreComponent {
  constructor(store: Store) {
      store.dispatch(new GetSources());
  }
}

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
                BrowserAnimationsModule,
                NgxsModule.forRoot([NewsState]),
                NgxsReduxDevtoolsPluginModule.forRoot(),
                NgxsLoggerPluginModule.forRoot(),
                AngularFirestoreModule,
                AngularFireModule.initializeApp(environment.firebase),

            ],
        }),
    )
    .add('default', () => {
        return {
            component: HostDispatchStoreComponent,
            props: {
                numLikes: 0,
                onSourceClicked: newsSourceActions.onSourceClicked,
                onClosed: newsSourceActions.onClosed
            },
        };
    })
