@cms
@lesson
@course
@ignore

Feature: Can remove location of course which has no student
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page

    Scenario Outline: School admin can remove location of course which has no student by X button
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has gone to detail course page
        And "school admin" has opened editing course page
        When "school admin" removes location by X button in location field
        And "school admin" saves the changes of the course
        Then "school admin" is redirected to detail course page
        And "school admin" sees location field is blank under setting tab
        Examples:
            | type         |
            | one children |
            | all children |
            | one parent   |

    Scenario Outline: School admin can remove location of course which has no student by deselecting location
        Given "school admin" has created a new course with "<type>" location
        And "school admin" has gone to detail course page 
        And "school admin" has opened editing course page
        And "school admin" has opened location popup
        When "school admin" deselects selected location in location popup
        And "school admin" saves location popup
        And "school admin" saves the changes of the course
        Then "school admin" is redirected to detail course page
        And "school admin" sees location field is blank under setting tab
        Examples:
            | type         |
            | one children |
            | all children |
            | one parent   |