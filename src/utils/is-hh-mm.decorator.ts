import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';
import { isHHMM } from './is-hh-mm.validator';

const IS_HH_MM = 'isHHMM';

/**
 * Checks if the string is in the format of hh:mm.
 */
export function IsHHMM(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_HH_MM,
      validator: {
        validate: (value): boolean => isHHMM(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be in hh:mm format',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
