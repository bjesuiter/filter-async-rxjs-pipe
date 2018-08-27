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
import { pipe, from, MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { map, filter, concatMap, flatMap } from 'rxjs/operators';
import { Thenable } from 'es6-promise';

interface FilterContainer<T> {
    filterResult: boolean,
    entry: T
}

type PredicateRunner<T> = (data: T, index: number) => Observable<FilterContainer<T>>;
type Predicate$<T> = (value: T, index: number) => Observable<boolean>;

/**
 * This rxjs 6+ pipe uses concatMap to apply the async predicate function to each data entry.
 * * DOES preserve order of events
 * * Runs sequential when data comes in faster than the filter function can process it. (Because of ConcatMap)
 * @param predicate A predicate function to test each event which returns Thenable<boolean>
 */
export function filterAsyncSequential<T>(predicate: (value: T, index?: number) => Thenable<boolean>): MonoTypeOperatorFunction<T> {
    return pipe(
        filterAsync((data: T, index: number) => from(predicate(data, index)), true)
    );
}

/**
 * This rxjs 6+ pipe uses flatMap to apply the async predicate function to each data entry.
 * * DOES NOT preserve order of events
 * * Runs in parallel when data comes in faster than the filter function can process it. (Because of FlatMap)
 * @param predicate A predicate function to test each event which returns Thenable<boolean>
 */
export function filterAsyncParallel<T>(predicate: (value: T, index?: number) => Thenable<boolean>): MonoTypeOperatorFunction<T> {
    return pipe(
        filterAsync((data: T, index: number) => from(predicate(data, index)), false)
    );
}

export function filterAsync<T>(predicate: Predicate$<T>, preserveOrder: boolean): MonoTypeOperatorFunction<T> {
    return pipe(
        runPredicate(
            (data: T, index: number) => predicate(data, index)
                .pipe(map((isValid) => ({filterResult: isValid, entry: data})))
            , preserveOrder
        ),
        // Filter the container object synchronously according to the filterResult property
        filter(data => data.filterResult === true),
        // remove the data container object from the observable chain
        map(data => data.entry)
    );
}

/**
 * This function runs the predicate code  with concatMap or flatMap, based on
 * @param predicateRunner - a lambda function which can be executed by concatMap or flatMap
 *                         which executes the async filter predicate function
 * @param preserveOrder - This flag decides whether to use
 *                        concatMap and run the filter function for each data event sequentially (preserveOrder = true)
 *                        or to use
 *                        flatMap and run the predicate function for each data event in parallel (preserveOrder = false)
 */
function runPredicate<T>(predicateRunner: PredicateRunner<T>, preserveOrder: boolean): OperatorFunction<T, FilterContainer<T>> {
    return pipe((preserveOrder === true) ? concatMap(predicateRunner) : flatMap(predicateRunner));
}
