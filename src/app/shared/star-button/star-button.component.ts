import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'star-button',
    templateUrl: './star-button.component.html',
    styleUrls: ['./star-button.component.css']
})
export class StarButtonComponent implements OnInit {

    @Input() stared: boolean = false;
    @Output() onStar: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onStar() {
        this.onStar.emit();
    }

}
