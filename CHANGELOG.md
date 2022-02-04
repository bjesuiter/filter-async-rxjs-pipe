# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

A new release should be issued when a branch is merged to master.

## [1.0.1] - 2022-02-04 

* remove promise-delay.ts from shipped package, since it is only relevant for testing this pipe 
  (it also had no entry in index.js of this package, so it was only importable via deep import)

## Internal changes
Switched from ts-jest to @swc/jest for transpiling test suites written in ts for jest. 
It is muuuuch faster now!

## [1.0.0] - 2022-02-02 

Note: The test for the 'parallel' flag on this operator is still not working, has to be fixed later. 

### Prod Dependency upgrades
* run basic `npm audit fix` to fix all currently existing vulnerabilities without bumping the versions
* update es6-promise from ^4.2.6 to ^4.2.8, but moved it to peerDependencies as ">= 4.2.6 < 5"
* update rxjs from ^6.4.0 to ^7.5.2, but moved it to peerDependencies as ">= 6.0.0 < 8"

### Dev Dependency upgrades
* upgrade package-lock.json to new file format (autmatically done by npm on npm install)
* upgrade del-cli from ^1.1.0 to ^4.0.1
* update node typings from ^11.x to ^16.11.22
* update @types/underscore from ^1.8.13 to ^1.11.4
* update jest to ^27.4.0, together with types/jest and ts-jest (fixes build errors from babel! :))
* update underscore from ^1.9.1 to ^1.13.2
* upgrade typescript from ^3.3.4000 to ^4.5.5
* update moment from ^2.24.0 to ^2.29.1

### Further maintenance
* update jest configuration

## [0.1.5] - 2019-03-21

* update all dependencies for security improvements

## [0.1.4] - 2018-08-27

* fix import of rxjs asyncScheduler from internal location in node_modules

## [0.1.3] - 2018-08-27

* improve publish workflow

## [0.1.2] - 2018-08-27

* improve readme

## [0.1.1] - 2018-08-27

* Prerelease fixes for npm package publishing

## [0.1.0] - 2018-08-27

### Added

* Source code for filter functions: filterByPromise (which uses filterAsync internally), 
  filterAsync(which operates on predicates returning Observable instead of Thenable / Promise)
  
  **Warning: Only non-parallel Mode of these two methods works correctly currently. 
  The parallel mode seems to still run in order.**

## [0.0.1] - 2018-08-24

* Repository created
