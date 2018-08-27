import { filterByPromise } from './filter-async';
import { range, forkJoin, of } from 'rxjs';
import { Promise } from 'es6-promise';
import { reduce, bufferCount, map } from 'rxjs/operators';
import { difference } from 'underscore';
import { promiseDelay } from './promise-delay';
import * as moment from 'moment';

describe('Filter Async Sequential', () => {

    it('Returns correct element count after filtering', (done) => {
        range(1, 10)
            .pipe(
                filterByPromise((value) => Promise.resolve(value % 2 === 0), false),
                reduce((acc: number) => ++acc, 0)
            )
            .subscribe(filterCount => expect(filterCount).toBe(5), done());
    });

    it('Correct element ordering after filtering', (done) => {
        const comparableResult = [2, 4, 6, 8, 10];

        range(1, 10)
            .pipe(
                filterByPromise((value) => Promise.resolve(value % 2 === 0), false),
                bufferCount(5)
            )
            .subscribe((result: number[]) => expect(result).toEqual(comparableResult), done());
    });

    it('Correct element ordering after filtering - multiple rounds', (done) => {
        const comparableResult = [2, 4, 6, 8, 10];

        const observables = [];
        const roundCount = 10;

        for (let i = 0; i < roundCount; i++) {
            const observable = range(1, 10)
                .pipe(
                    filterByPromise((value) => Promise.resolve(value % 2 === 0), false),
                    bufferCount(5),
                    map((result: number[]) => difference(result, comparableResult).length === 0)
                );

            observables.push(observable);
        }

        forkJoin(observables)
            .subscribe((results: boolean[]) => {
                const singleResult = results.reduce((prev: boolean, curr: boolean) => prev && curr);
                expect(singleResult).toBe(true);
                done();
            });
    });
});

