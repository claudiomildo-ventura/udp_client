import {FormControl, ValidationErrors} from "@angular/forms";

/**
 * The page home validation.
 */
export class PageHomeValidation {

    /**
     * Validator to ensure a form control's value contains non-whitespace text.
     *
     * This function checks that the control's value is not empty and not composed only of spaces.
     *
     * @param control The `FormControl` instance to validate.
     * @returns A validation error object `{ textContainsValue: true }`
     *          if the control is empty or only whitespace; otherwise, `null`.
     *
     * @example
     * ```ts
     * this.form = this.fb.group({
     *   detail: ['', [CustomValidators.textContainsValue]]
     * });
     * ```
     */
    public static textContainsValue(control: FormControl): ValidationErrors {
        if (control.value?.trim().length === 0) {
            return {'notOnlyWhiteSpace': true};
        } else {
            return {};
        }
    }

    /**
     * Validator to check if a form control's value contains the default or placeholder text.
     *
     * This ensures that the user has changed the value from its initial default.
     *
     * @param control The `FormControl` instance to validate.
     * @returns A validation error object `{ textContainsDefaultValue: true }`
     *          if the control contains the default value; otherwise, `null`.
     *
     */
    public static textContainsDefaultValue(control: FormControl): ValidationErrors {
        if (control.value?.includes('This program generates')) {
            return {'textContainsInicialValue': true};
        } else {
            return {};
        }
    }

    /**
     * Validator to check if a form control's value contains a "CREATE TABLE" statement.
     *
     * This function ensures that the input text includes the SQL "CREATE TABLE" keyword.
     * It performs a **case-insensitive** search within the control's value.
     *
     * @param control The `FormControl` instance to validate.
     * @returns A validation error object `{ textContainsCreateTableValue: true }`
     *          if the value contains "CREATE TABLE"; otherwise, `null`.
     *
     */
    public static textContainsCreateTableValue(control: FormControl): ValidationErrors {
        if (control.value?.toLowerCase().includes('create table')) {
            return {};
        } else {
            return {'textContainsInicialValue': true};
        }
    }
}