@cms
@lesson
@course
@ignore

Feature: School admin can edit a course by adding location
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to course page
        And "school admin" has create a course without location
        And "school admin" has gone to detail course page under setting tab
        And "school admin" has opened editing course page

    Scenario Outline: School admin can edit a course by adding <type> locations
        When "school admin" selects "<type>" location of parent location in location popup
        And "school admin" saves the change of the course
        Then "school admin" is redirected to detail course page under setting tab
        And "school admin" sees "<type>" locations in location field
        And "school admin" does not see their parent location in location field
        Examples:
            | type         |
            | one children |
            | all children |
