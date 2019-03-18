import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'comment-button',
    templateUrl: './comment-button.component.html',
    styleUrls: ['./comment-button.component.css']
})
export class CommentButtonComponent implements OnInit {

    @Input() numComments: number = 0;
    @Output() onComment: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onComment() {
        this.onComment.emit();
    }
}
