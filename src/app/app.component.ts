import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { of } from 'rxjs';


import {
    GetSources,
    InitArticles,
    ChangeNewsSource,
    InitNewsAPIArticles
} from './shared/state/news.actions';

import { NewsSource } from './shared/model/news-source';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Login, Logout } from './shared/state/auth.actions';


@Component({
    //selector: 'news-source',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'news-app';
    theme$ = of('default-theme');

    constructor(private store: Store, private dialog: MatDialog, private overlayContainer: OverlayContainer) {
        console.log("app.component starting");
    }

    ngAfterViewInit() {
        console.log("Setting overlay container styles");
        //Set the default theme during the initial page load
        const classList = this.overlayContainer.getContainerElement().classList;
        const toRemove = Array.from(classList)
            .filter((item: string) => item.includes('-theme'));

        if (toRemove.length) {
            classList.remove(...toRemove);
        }
        classList.add('default-theme');
    }

    ngOnInit() {


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
        this.store.dispatch(new InitArticles());
        this.store.dispatch(new InitNewsAPIArticles(newsSource));



    }



    sourceClicked(id: NewsSource) {
        this.store.dispatch(new ChangeNewsSource(id));
    }


    menuClicked($event: string) {
        if ($event === "Settings") {
            let dialogRef = this.dialog.open(SettingsDialogComponent, { height: '300px', width: '600px' });
        }
        else if ($event === "LogIn") {
            this.store.dispatch(new Login());
        }
        else if ($event === "LogOut") {
            this.store.dispatch(new Logout());
        }
        else if ($event === "Help") {
        }
    }
}
