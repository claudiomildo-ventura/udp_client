import {FormControl, ValidationErrors} from "@angular/forms";

/**
 * The Metadata validation.
 */
export class MetadataValidation {
    /**
     * Not only white space.
     */
    public static notOnlyWhitespace(control: FormControl): ValidationErrors {
        if ((control.value != null && control.value != undefined) && (control.value.trim().length === 0)) {
            return {'notOnlyWhiteSpace': true};
        } else {
            return {};
        }
    }

    /**
     * Text contains initial value.
     */
    public static textContainsInicialValue(control: FormControl): ValidationErrors {
        if ((control.value != null && control.value != undefined) && (control.value.includes('This program generates'))) {
            return {'textContainsInicialValue': true};
        } else {
            return {};
        }
    }
}
