# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

A new release should be issued when a branch is merged to master. 

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
