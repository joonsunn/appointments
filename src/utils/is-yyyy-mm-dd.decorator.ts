import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';
import { isYYYYMMDD } from './is-yyyy-mm-dd.validator';

const IS_YYYY_MM_DD = 'isYYYYMMDD';

/**
 * Checks if the string is in the format of YYYY-MM-DD.
 */
export function IsYYYYMMDD(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_YYYY_MM_DD,
      validator: {
        validate: (value): boolean => isYYYYMMDD(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be in YYYY-MM-DD format',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
