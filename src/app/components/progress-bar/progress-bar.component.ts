import {CommonModule} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "src/app/material.module";

@Component({
    selector: 'progress-bar',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnInit {
    isPageLoading: boolean = true;  // This will control the visibility of the loading bar
    progressValue = 0;

    ngOnInit() {
        this.progressBarInitialize();
    }

    private progressBarInitialize(): void {
        let interval = setInterval((): void => {
            if (this.progressValue < 100) {
                this.progressValue += 10;
            } else {
                clearInterval(interval);
                this.isPageLoading = false;
            }
        }, 200);
    }
}