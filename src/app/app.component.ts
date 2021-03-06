import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { of } from 'rxjs';


import {
    GetSources,
    InitArticles,
    ChangeNewsSource
} from './shared/state/news.actions';

import { NewsSource } from './shared/model/news-source';
import { OverlayContainer } from '@angular/cdk/overlay';


@Component({
    selector: 'news-source',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'news-app';
    theme$ = of('default-theme');

    constructor(private store: Store, private dialog: MatDialog, private overlayContainer: OverlayContainer) {
        console.log("app.component starting");
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

        const newsSource = {
            category: "general",
            country: "us",
            description: "The New York Times: Find breaking news, multimedia, reviews & opinion on Washington, business, sports, movies, travel, books, jobs, education, real estate, cars & more at nytimes.com.",
            id: "the-new-york-times",
            language: "en",
            name: "The New York Times",
            url: "http://www.nytimes.com"
        };




        this.store.dispatch(new GetSources());
        this.store.dispatch(new InitArticles(newsSource));



    }



    sourceClicked(id: NewsSource) {
        this.store.dispatch(new ChangeNewsSource(id));
    }


    menuClicked($event: string) {
        if ($event === "Settings") {
            let dialogRef = this.dialog.open(SettingsDialogComponent, { height: '300px', width: '600px' });
        }
        else if ($event === "Help") {

        }
    }
}
