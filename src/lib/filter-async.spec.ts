import { filterByPromise } from './filter-async';
import { range, forkJoin, of } from 'rxjs';
import { Promise } from 'es6-promise';
import { reduce, bufferCount, map } from 'rxjs/operators';
import { difference } from 'underscore';
import { promiseDelay } from '../test-helpers/promise-delay';
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


describe('Filter Async Parallel', () => {

    it('Filter returns correct elements', (done) => {
        const comparableResult = [2, 4, 6, 8, 10];

        range(1, 10)
            .pipe(
                filterByPromise((value) => Promise.resolve(value % 2 === 0), true),
                bufferCount(5)
            )
            .subscribe((filterResult: number[]) => {
                expect(filterResult).toEqual(
                    // arrayContaining must be used here, since the order of elements is not preserved with filterAsyncParallel
                    expect.arrayContaining(comparableResult)
                );
                done();
            });
    });


    // FIXME: Redesign Test, because mergeMap MAY process events in order but is not forced to do so!
    xit('Filter runs parallel', (done) => {
        const comparableResult = ['d', 'c', 'b', 'a'];

        of(...['a', 'b', 'c', 'd'])
            .pipe(
                filterByPromise((value) => {

                    switch (value) {
                        case 'a':
                            // delay the filter promise about 3 seconds to increase chance of b returning before a
                            return promiseDelay(moment.duration(3, 's').asMilliseconds(), true);
                        case 'b':
                            return promiseDelay(moment.duration(2, 's').asMilliseconds(), true);
                        case 'c':
                            return promiseDelay(moment.duration(1, 's').asMilliseconds(), true);
                        case 'd':
                            return Promise.resolve(true);
                        default:
                            // ignore all different values
                            return Promise.resolve(false);
                    }
                }, true),
                bufferCount(4)
            )
            .subscribe((elements: string[]) => {
                expect(elements).toEqual(comparableResult);
            }, console.log, done);
    }, moment.duration(10, 's').asMilliseconds());

});

