import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl } from '@angular/forms';

export class SubmitErrorStateMatcher implements ErrorStateMatcher {
  constructor(private isSubmitted: () => boolean) {}

  isErrorState(control: FormControl | null): boolean {
    // only paint error after submit has been attempted
    return !!(control && control.invalid && this.isSubmitted());
  }
}
