import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'like-button',
    templateUrl: './like-button.component.html',
    styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {

    hasLiked: boolean = false;
    @Input() numLikes: number = 0;
    @Output() onLiked: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    _onLiked() {
        this.hasLiked = !this.hasLiked;
        this.onLiked.emit(this.hasLiked);
    }
}
