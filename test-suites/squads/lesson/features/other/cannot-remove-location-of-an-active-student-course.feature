@cms
@lesson
@course
@ignore

Feature: Cannot remove location of an active student course
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page

    Scenario Outline: School admin cannot remove location of an active student course by X button
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has created a new student with "<type>" location
        And "school admin" has added course for student with "<type>" location and start date and end date is in the today
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

    Scenario Outline: School admin cannot remove location of an inactive student course by deselecting location
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has created a new student with "<type>" location
        And "school admin" has added course for student with "<type>" location and start date and end date is in the today
        And "school admin" has gone to detail course page
        And "school admin" has opened editing course page
        And "school admin" has opened location popup
        When "school admin" deselects selected location in location popup
        And "school admin" saves location popup
        And "school admin" saves the changes of the course
        Then "school admin" sees an inline error message under location field
        And "school admin" is still in editing course page
        Examples:
            | type         |
            | one children |
            | all children |
            | one parent   |