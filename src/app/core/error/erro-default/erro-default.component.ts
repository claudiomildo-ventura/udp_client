import {Component, inject} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    selector: 'app-erro-default',
    standalone: true,
    imports: [],
    templateUrl: './erro-default.component.html',
    styleUrl: './erro-default.component.css'
})
export class ErroDefaultComponent {
    private location = inject(Location);

    public returnBack(): void {
        this.location.back();
    }
}