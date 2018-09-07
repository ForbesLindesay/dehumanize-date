export interface Options {
  /**
   * defaults to false
   */
  usa?: boolean;
  /**
   * defaults to the current time
   */
  now?: Date;
  /**
   * defaults to 80
   */
  cutoff?: number;
}

declare function parse(str: string, options?: Options): string;
export default parse;

export function parseNearbyDays(str: string, now: Date): string;
export function parseLastThisNext(string: string, now: Date): string;
export function parseAgoFrom(string: string, now: Date): string;
export function parseNumberDate(string: string, usa: boolean): string;
export function parseNumberDateShortYear(string: string, usa: boolean, cutoff: number): string;
export function parseNumberDateNoYear(string: string, usa: boolean, now: Date): string;
export function parseWordyDate(string: string, now: Date, cutoff: number): string;
export function monthFromName(month: string): number;
export function date(year: number, month: number, day: number): string;
