@cms
@user @student-search-filter @ignore
Feature: Remove filter option

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Able to reset filter by removing <option> chip on student page
        Given school admin filters student by multiple "<option>"
        When school admin "<action>" on student page
        Then the student list is displayed full records
        Examples:
            | option           | action                                        |
            | grade            | 1 of [removes grade chip, selects clear all]  |
            | course           | 1 of [removes course chip, selects clear all] |
            | grade and course | selects clear all                             |

    Scenario Outline: Able to reset filter by removing all <option> chip on filter popup
        Given school admin filters student by multiple "<option>"
        When school admin "<action>" on filter popup
        Then the student list is displayed full records
        Examples:
            | option           | action                                                                           |
            | grade            | 1 of [removes all grade chip and apply, selects clear and apply, selects reset]  |
            | course           | 1 of [removes all course chip and apply, selects clear and apply, selects reset] |
            | grade and course | selects reset                                                                    |

    Scenario Outline: Able to filter student after removing 1 <option> chip on filter popup
        Given school admin filters student by multiple "<option>"
        When school admin "<action>" on filter popup
        Then the student list is displayed student which matches remained "<option>"
        Examples:
            | option | action                          |
            | grade  | removes 1 grade chip and apply  |
            | course | removes 1 course chip and apply |

    Scenario Outline: Remove single-chip on filter pop-up/result page after applied location
        Given school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        When school admin filters student by "<filterOptions>"
        And school admin removes "<removeOption>" chip on "<component>"
        Then school admin "does not see" "<removeOption>" chip on Student Management page
        And school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" filtered "<filterOptions>"
        Examples:
            | filterOptions                    | removeOption                          | component     |
            | grade & course & never logged in | 1 of [grade, course, never logged in] | filter pop up |
            | grade & course & never logged in | 1 of [grade, course, never logged in] | result page   |

    Scenario Outline: Reset/Clear all filters result after applied location
        Given school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        When school admin filters student by "<filterOptions>"
        And school admin "<action>" on Student Management page
        Then school admin "does not see" "<filterOptions>" chip on Student Management page
        And school admin sees the student list is displayed correctly "with" filtered locations
        Examples:
            | filterOptions                    | action                                 |
            | grade & course & never logged in | resets on filter pop up                |
            | grade & course & never logged in | clears all chips filter on result page |