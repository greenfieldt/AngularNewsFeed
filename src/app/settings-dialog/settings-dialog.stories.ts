import { storiesOf, moduleMetadata } from '@storybook/angular';
import { SettingsDialogComponent } from './settings-dialog.component';
import { NgxsModule } from '@ngxs/store';
import { MatToolbarModule, MatSlideToggleModule, MatIconModule, MatDialogModule, MatDialog, MatDialogRef } from '@angular/material';
import { SettingsState } from '../shared/state/settings.state';
import { Component, OnDestroy } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@Component({
    template: ``,
})
class HostDispatchDialogStarterComponent implements OnDestroy {
    dialogRef: MatDialogRef<SettingsDialogComponent>;

    constructor(private dialog: MatDialog) {
        this.dialogRef = this.dialog.open(SettingsDialogComponent, { height: '300px', width: '600px' });

    }
    ngOnDestroy() {
        this.dialogRef.close();
    }
}


storiesOf('Composite/Settings Dialog', module)
    .addDecorator(
        moduleMetadata({
            declarations: [SettingsDialogComponent],
            entryComponents: [SettingsDialogComponent],
            imports: [
                MatToolbarModule,
                MatDialogModule,
                BrowserAnimationsModule,
                MatSlideToggleModule,
                MatIconModule,
                NgxsModule.forRoot([SettingsState])],
        }))
    .add('default', () => {
        return {
            component: HostDispatchDialogStarterComponent,
            props: {},
        };
    })

