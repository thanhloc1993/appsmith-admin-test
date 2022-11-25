# Project structure

```
    Lesson
    │
    └─── common: files: utils, alias-keys, cms-selectors
    │
    └─── features: Cucumber file test script
    |       |
    │       └─── <tag>: BDD contains tag name
    |               |
    │               └─── <test-case-name>: handle BDD
    │
    └─── step-definitions: contains steps and definitions file
    |               |
    │               └─── <test-case-name>-steps.ts: name rule
    |               |
    │               └─── <test-case-name>-definitions.ts: name rule
```
