import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'news-top-nav',
    templateUrl: './news-top-nav.component.html',
    styleUrls: ['./news-top-nav.component.scss']
})
export class NewsTopNavComponent implements OnInit {

    @Output() onShowSources: EventEmitter<any> = new EventEmitter();
    @Output() onMenuClicked: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onShowSources($event) {
        this.onShowSources.emit($event);
    }

}
