/**
 * Checks whether the type is any
 * See {@link https://stackoverflow.com/a/49928360/3406963}
 * @typeParam T - type which may be any
 * ```
 * IsAny<any> = true
 * IsAny<string> = false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Checks whether the type is never
 * @typeParam T - type which may be never
 * ```
 * IsAny<never> = true
 * IsAny<string> = false
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Checks whether T1 can be exactly (mutually) assigned to T2
 * @typeParam T1 - type to check
 * @typeParam T2 - type to check against
 * ```
 * IsEqual<string, string> = true
 * IsEqual<'foo', 'foo'> = true
 * IsEqual<string, number> = false
 * IsEqual<string, number> = false
 * IsEqual<string, 'foo'> = false
 * IsEqual<'foo', string> = false
 * IsEqual<'foo' | 'bar', 'foo'> = boolean // 'foo' is assignable, but 'bar' is not (true | false) -> boolean
 * ```
 */
export type IsEqual<T1, T2> = T1 extends T2
    ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
        ? true
        : false
    : false;

export type Noop = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsFlatObject<T extends object> =
    Extract<Exclude<T[keyof T], Date | FileList>, any[] | object> extends never
        ? true
        : false;

export type MakePartial<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Override<T1, T2> = T2 extends any ? Omit<T1, keyof T2> & T2 : never;

export type MaybePromise<T> = T | PromiseLike<T>;

export type WithOptionalProp<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export type NonEmptyArray<T> = [T, ...T[]];
