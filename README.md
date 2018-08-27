# filter-async-rxjs-pipe

Some pipeable functions for rxjs 6+ which accept predicate lambdas with async return value (Promise or Observable).

## Usage

See [filter-async.spec.ts](https://github.com/bjesuiter/filter-async-rxjs-pipe/blob/master/src/lib/filter-async.spec.ts)
in [Github](https://github.com/bjesuiter/filter-async-rxjs-pipe) for usage examples.

##  Provided rxjs 6+ pipes

### filterByPromise
This rxjs 6+ pipe accepts a predicate function which returns a `Thenable<boolean>` for filtering.  
(e.g. any object with a 'then' method === Promise and custom promise implementations)

### filterAsync
This rxjs 6+ pipe accepts a predicate function which returns an `Observable<boolean>` for filtering.

### Note
Both of these functions have a `parallel` flag to indicate, 
that they should run the predicate function in parallel for each emitted event from the source observable.
However, this does not work currently and should be improved in a later release. 