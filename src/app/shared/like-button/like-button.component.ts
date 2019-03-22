import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'like-button',
    templateUrl: './like-button.component.html',
    styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {

    @Input() numLikes: number = 0;
    @Input() hasLiked: boolean = false;
    @Output() onLiked: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onLiked() {
        this.onLiked.emit();
    }
}
