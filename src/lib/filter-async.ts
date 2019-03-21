/**
 * An operator which filters the data based on an async predicate function returning promise<boolean>
 *
 * NOTE:
 * By using **concatMap**, the order of original data events is preserved and the filter runs sequentially for each data event
 * If you want to run the filter in parallel without preserving order, use **flatMap**
 * See the accepted answer at: https://stackoverflow.com/questions/28490700/is-there-an-async-version-of-filter-operator-in-rxjs
 * @param predicate
 * @param thisArg
 */
import { pipe, from, MonoTypeOperatorFunction, Observable, OperatorFunction, asyncScheduler } from 'rxjs';
import { map, filter, concatMap, subscribeOn, mergeMap } from 'rxjs/operators';
import { Thenable } from 'es6-promise';

interface FilterContainer<T> {
    filterResult: boolean,
    entry: T
}

type Predicate$<T> = (value: T, index: number) => Observable<boolean>;
type Predicate<T> = (value: T, index: number) => Thenable<boolean>;

/**
 * This rxjs 6+ pipe accepts a predicate function which returns a thenable.
 * (e.g. any object with a 'then' method === Promise and custom promise implementations)
 * @param predicate - The predicate function returning Thenable<boolean>
 * @param parallel - A boolean flag indicating whether the predicate function should be executed
 *                   sequentially or in parallel for multiple observable events
 *                   Warning: Flag has no effect currently
 * @param maxConcurrent A number indicating the max number of elements processed parallel
 *                      Warning: Only active when parallel is true!
 */
export function filterByPromise<T>(predicate: Predicate<T>,
                                   parallel: boolean = false,
                                   maxConcurrent: number = Number.POSITIVE_INFINITY): MonoTypeOperatorFunction<T> {
    return pipe(
        filterAsync((data: T, index: number) => from(predicate(data, index)), parallel, maxConcurrent)
    );
}

/**
 * This rxjs 6+ pipe accepts a predicate function which returns an Observable<boolean>.
 *
 * @param predicate - The predicate function Observable<boolean> as return type
 * @param parallel - A boolean whether the filter should run sequential and ordered for each observable event
 *                   or parallel and unordered
 *                   Warning: Flag has no effect currently
 * @param maxConcurrent A number indicating the max number of elements processed parallel
 *                      Warning: Only active when parallel is true!
 */
export function filterAsync<T>(predicate: Predicate$<T>,
                               parallel: boolean,
                               maxConcurrent: number = Number.POSITIVE_INFINITY): MonoTypeOperatorFunction<T> {
    return (parallel) ? filterAsyncSequential(predicate) : filterAsyncParallel(predicate, maxConcurrent);
}


/**
 * This rxjs 6+ pipe uses concatMap to apply the async predicate function to each data entry.
 * * DOES preserve order of events
 * * Runs sequential when data comes in faster than the filter function can process it. (Because of ConcatMap)
 * @param predicate A predicate function to test each event which returns Thenable<boolean>
 */
function filterAsyncSequential<T>(predicate: Predicate$<T>): MonoTypeOperatorFunction<T> {
    return pipe(
        concatMap((data: T, index: number) => {
                // run the predicate &
                // put the predicate result + the data entry together into container
                return predicate(data, index)
                    .pipe(map((isValid) => ({filterResult: isValid, entry: data})));
            }
        ),
        filterDataAndRemoveContainer()
    );
}

/**
 * This rxjs 6+ pipe uses mergeMap (e.g. old flatMap) to apply the async predicate function to each data entry.
 * * DOES NOT preserve order of events, BUT MAY preserve order of events!
 * * Runs in parallel when data comes in faster than the filter function can process it. (Because of FlatMap)
 * @param predicate A predicate function to test each event which returns Thenable<boolean>
 * @param maxConcurrent A number indicating the max number of elements processed parallel
 *                      Warning: Only active when parallel is true!
 */
function filterAsyncParallel<T>(predicate: Predicate$<T>, maxConcurrent: number = Number.POSITIVE_INFINITY): MonoTypeOperatorFunction<T> {
    return pipe(
        mergeMap((data: T, index: number) => {
                // run the predicate &
                // put the predicate result + the data entry together into container
                return predicate(data, index)
                    .pipe(
                        map((isValid) => ({filterResult: isValid, entry: data})),
                        subscribeOn(asyncScheduler)
                    );
            }
        ),
        filterDataAndRemoveContainer()
    );
}

function filterDataAndRemoveContainer<T>(): OperatorFunction<FilterContainer<T>, T> {
    return pipe(
        // Filter the container object synchronously according to the filterResult property
        filter(data => data.filterResult === true),
        // remove the data container object from the observable chain
        map(data => data.entry)
    );
}

