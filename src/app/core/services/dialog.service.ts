import {inject, Injectable} from '@angular/core';
import {SESSION_SERVICE} from "../../../config/session-service";
import {SessionService} from "./session-storage.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MessageDialogComponent} from "../../components/message-dialog/message-dialog.component";

@Injectable({providedIn: 'root'})
export class DialogService {
    private readonly dialog: MatDialog = inject(MatDialog);
    private readonly sessionService: SessionService = inject(SessionService);

    public confirm<TComponent, TResult = boolean>(
        statusCode: number,
        message: string,
        config: MatDialogConfig = {}
    ): Promise<TResult | null> {

        const ref = this.dialog.open(MessageDialogComponent, {
            ...config,
            data: {
                title: this.sessionService.getItem(SESSION_SERVICE.application_title),
                message: `[Status code: ${statusCode}] - [Message error: ${message}]`,
            },
            autoFocus: true,
            restoreFocus: true,
            width: config.width ?? '800px',
            height: config.height ?? 'auto',
            maxWidth: config.maxWidth ?? '95vw',
            minWidth: config.minWidth ?? '320px',
            maxHeight: config.maxHeight ?? '85vh',
        });

        return ref.afterClosed().toPromise();
    }
}