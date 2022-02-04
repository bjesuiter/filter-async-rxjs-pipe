import { Promise } from 'es6-promise';

/**
 *
 * @param delay - time in ms, given directly to setTimeout function
 * @param value - the value which should be emitted after timeout
 */
export function promiseDelay<T>(delay: number, value: T): Promise<T> {
    return new Promise( (resolve, reject) => {
        // when 'this' is bound to something meaningful outside, pass it to the resolve function.
       // @ts-ignore
        setTimeout(resolve.bind(this, value), delay);
    });
}