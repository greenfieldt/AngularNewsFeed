import { Component } from '@angular/core';

import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { MatButtonModule, MatIconModule, MatBadgeModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { NewsTopNavComponent } from './news-top-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';


@Component({
    template: `<news-top-nav 
                        (onShowSources)='onShowSources($event)' 
                        (onMenuclicked) = 'onMenuClicked($event)'> </news-top-nav>`,
})
class HostDispatchStoreComponent {
    constructor(private overlayContainer: OverlayContainer) {

    }

    ngOnInit() {
        //Set the default theme during the initial page load
        const classList = this.overlayContainer.getContainerElement().classList;
        const toRemove = Array.from(classList)
            .filter((item: string) => item.includes('-theme'));

        if (toRemove.length) {
            classList.remove(...toRemove);
        }
        classList.add('default-theme');
    }
}


export const newsTopNavActions = {
    onShowSources: action('onShowSources'),
    onMenuClicked: action('onMenuClicked'),
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
                BrowserAnimationsModule
            ],
        }),
    )
    .add('default', () => {
        return {
            component: HostDispatchStoreComponent,
            props: {
                onShowSources: newsTopNavActions.onShowSources,
                onMenuClicked: newsTopNavActions.onMenuClicked,

            },
        };
    })
