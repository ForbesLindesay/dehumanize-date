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

declare function parse(str: string, options?: Options): string | null;
export default parse;

export function parseNearbyDays(str: string, now: Date): string | null;
export function parseLastThisNext(string: string, now: Date): string | null;
export function parseAgoFrom(string: string, now: Date): string | null;
export function parseNumberDate(string: string, usa: boolean): string | null;
export function parseNumberDateShortYear(string: string, usa: boolean, cutoff: number): string | null;
export function parseNumberDateNoYear(string: string, usa: boolean, now: Date): string | null;
export function parseWordyDate(string: string, now: Date, cutoff: number): string | null;
export function monthFromName(month: string): number | null;
export function date(year: number, month: number, day: number): string | null;
