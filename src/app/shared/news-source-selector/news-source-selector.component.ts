import { NewsSource } from '../../shared/model/news-source';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import {
    startWith,
    tap,
    map,
    switchMap,
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators'

import { FormControl } from '@angular/forms';
import { Select } from '@ngxs/store';
import { NewsState } from '../../shared/state/news.state';

@Component({
    selector: 'news-source-selector',
    templateUrl: './news-source-selector.component.html',
    styleUrls: ['./news-source-selector.component.scss']
})
export class NewsSourceSelectorComponent implements OnInit {

    @Input() sources$: Observable<NewsSource[]>;
    @Output() onSourceClicked: EventEmitter<any> = new EventEmitter();
    @Output() onClosed: EventEmitter<any> = new EventEmitter();
    @Output() numberOfFilteredSources: number;

    @Select(NewsState.newsSources) newsSources$: Observable<NewsSource[]>;
    myControl: FormControl = new FormControl();

    constructor() { }

    ngOnInit() {

        this.sources$ = this.myControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(500),
                distinctUntilChanged(),
                map(f => f.toLowerCase()),
                switchMap((filterString: string) => {
                    return this.newsSources$.
                        pipe(
                            map((sourceArray: any) => {
                                return sourceArray.filter((sourceItem) => {
                                    let match = 1;
                                    // console.log("filter:", source);
                                    // sourceItem = {id:"The New York Times"...}
                                    // filterstring = "The New"
                                    // ['The', 'New'].forEach(...

                                    filterString.split(" ").forEach(filterTerm => {
                                        // tslint:disable-next-line:no-bitwise
                                        match &= sourceItem.id.toLowerCase().includes(filterTerm);
                                    })
                                    return match == 1;
                                })
                            }),
                            tap((x) => {
                                this.numberOfFilteredSources = x.length;
                            })
                        );
                })
            )


    }

    _onClose() {
        this.onClosed.emit();
    }

    _onSourceClick(source) {
        this.onSourceClicked.emit(source);
    }

}
