import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NewsSource } from '../../model/news-source'

import { Observable, Subject, of, Subscription } from 'rxjs';
import { reduce, startWith, filter, scan, tap, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { FormControl } from '@angular/forms';
import { NewsApiService } from 'src/app/news-api.service';

@Component({
    selector: 'news-source-selector',
    templateUrl: './news-source-selector.component.html',
    styleUrls: ['./news-source-selector.component.css']
})
export class NewsSourceSelectorComponent implements OnInit {

    @Input() sources$: Observable<NewsSource[]>;
    @Output() onSourceClicked: EventEmitter<any> = new EventEmitter();
    @Output() onClosed: EventEmitter<any> = new EventEmitter();
    @Output() numberOfFilteredSources: number;


    myControl: FormControl = new FormControl();

    constructor(private newsService: NewsApiService) { }

    ngOnInit() {

        this.sources$ = this.myControl.valueChanges
            .pipe(
                startWith(''),
                debounceTime(500),
                distinctUntilChanged(),
                map(f => f.toLowerCase()),
                switchMap((filterString: string) => {
                    return this.newsService.initSources().
                        pipe(
                            map((sourceArray) => {
                                return sourceArray.filter((sourceItem) => {
                                    let match = 1;
                                    //console.log("filter:", source);
                                    //sourceItem = {id:"The New York Times"...}
                                    //filterstring = "The New"
                                    //['The', 'New'].forEach(...

                                    filterString.split(" ").forEach(filterTerm => {
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
        //do some clean up
        this.onClosed.emit();
    }

    _onSourceClick(source) {
        //        console.log("onSourceClicked", source);
        this.onSourceClicked.emit(source);
    }

}
