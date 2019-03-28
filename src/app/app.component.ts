import { Component } from '@angular/core';
import { NewsApiService } from './shared/service/news-api.service';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SetNumCardsPerPage, SetNumCardsCachedPerGet } from './shared/state/settings.actions';

import { ChangeNewsSource } from './shared/state/news.actions'


import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


import { GetSources, InitArticles } from './shared/state/news.actions';
import { NewsSource } from './shared/model/news-source';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'news-app';

    constructor(private store: Store, private dialog: MatDialog) {
        console.log("app.component starting");
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
