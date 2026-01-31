import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bold',
    standalone: true
})
export class BoldPipe implements PipeTransform {
    transform(value: string): string {
        return `<strong>${value}</strong>`;
    }
}
