import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { catchError, map } from 'rxjs/operators';

export function locationExistsValidator(
  apiService: ApiService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    const value = control.value;

    if (!value || value.length === 0) {
      return of(null);
    }

    return apiService.validateValue(value).pipe(
      map((isValid: boolean) => {
        return isValid ? null : { asyncInvalid: true };
      }),
      catchError(() => of({ asyncError: true }))
    );
  };
}
