import {CommonModule} from "@angular/common";
import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class ProgressBarComponent implements OnInit, OnDestroy {
    public isPageLoading: boolean = true;
    public progressValue: number = 0;
    private interval?: ReturnType<typeof setInterval>;

    ngOnInit(): void {
        this.progressBarInitialize();
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private progressBarInitialize(): void {
        this.interval = setInterval((): void => {
            if (this.progressValue < 100) {
                this.progressValue += 10;
            } else {
                clearInterval(this.interval);
                this.isPageLoading = false;
            }
        }, 30);
    }
}