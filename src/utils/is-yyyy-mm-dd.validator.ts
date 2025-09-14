import { isString } from 'class-validator';

const YYYY_MM_DD_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Checks if the string is in the format of YYYY-MM-DD.
 */
export function isYYYYMMDD(value: unknown): value is string {
  return isString(value) && YYYY_MM_DD_REGEX.test(value);
}
