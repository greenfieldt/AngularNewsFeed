import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatDialogModule, MatSlideToggleModule } from '@angular/material';
import { NewsApiService } from './news-api.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';


import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NewsState } from 'src/shared/state/news.state';

import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsState } from 'src/shared/state/settings.state';



@NgModule({
    declarations: [
        AppComponent,
        SettingsDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        CommonModule,
        ScrollingModule,
        NgxsModule.forRoot([NewsState, SettingsState
        ], { developmentMode: true }),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot()

    ],
    providers: [NewsApiService],
    entryComponents: [SettingsDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
