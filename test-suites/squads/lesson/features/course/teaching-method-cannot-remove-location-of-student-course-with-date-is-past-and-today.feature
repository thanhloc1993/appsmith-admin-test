@cms
@lesson
@course
@ignore

Feature: School admin cannot remove location of a student course with start&end date is past&today
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page

    Scenario Outline: School admin cannot remove location of a student course with start&end date is past&today by X button
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has created a new student with "<type>" location
        And "school admin" has added course to student with "1" location which is from selected "<type>" location
        And "school admin" has set start date is in the past and end date is in the today
        And "school admin" has gone to detail course page
        And "school admin" has opened editing course page
        When "school admin" removes location by X button in location field
        And "school admin" saves the changes of the course
        Then "school admin" sees an inline error message under location field
        And "school admin" is still in editing course page
        Examples:
            | type         |
            | one children |
            | all children |
            | one parent   |

    Scenario Outline: School admin cannot remove location of a student course with start&end date is past&today by deselecting location
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has created a new student with "<type>" location
        And "school admin" has added course to student with "1" location which is from selected "<type>" location
        And "school admin" has set start date is in the past and end date is in the today
        And "school admin" has gone to detail course page
        And "school admin" has opened editing course page
        And "school admin" has opened location popup
        When "school admin" deselects location which has been added to student course
        And "school admin" saves location popup
        And "school admin" saves the changes of the course
        Then "school admin" sees an inline error message under location field
        And "school admin" is still in editing course page
        Examples:
            | type         |
            | all children |
            | one parent   |
