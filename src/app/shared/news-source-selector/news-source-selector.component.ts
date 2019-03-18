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
    @Output() onSourceCliked: EventEmitter<any> = new EventEmitter();
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
                tap(f => console.log("valueChanged: ", f)),
                map(f => f.toLowerCase()),
                switchMap((f: string) => {
                    return this.newsService.initSources().
                        pipe(
                            filter((source) => {
                                let match = 1;
                                //I need to handle the case of a word
                                //that doesn't match anything

                                //console.log("filter:", source);
                                //source = {id:"The New York Times"...}
                                //f = "The New"
                                //['The', 'New'].forEach(...
                                f.split(" ").forEach(x => {
                                    match &= source.id.toLowerCase().includes(x)
                                })
                                return match == 1;
                            }),
                            scan((a, b) => [...a, b], []),
                            tap((x) => {
                                this.numberOfFilteredSources = x.length;
                                //console.log("Number of items :", x.length)
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
        this.onSourceCliked.emit(source);
    }

}
