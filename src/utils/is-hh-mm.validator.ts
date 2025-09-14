import { isString } from 'class-validator';

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Checks if the string is in the format of hh:mm.
 */
export function isHHMM(value: unknown): value is string {
  return isString(value) && HH_MM_REGEX.test(value);
}
