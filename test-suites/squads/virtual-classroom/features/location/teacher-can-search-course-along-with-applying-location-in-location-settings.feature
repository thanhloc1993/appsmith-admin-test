@cms @teacher
@virtual-classroom
@virtual-classroom-location-settings-teacher-app
@ignore

Feature: Teacher can search course along with applying location in location settings
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Teacher can search course after applying location in location settings
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        And "teacher" has refreshed their browser on Teacher App
        And "teacher" has applied location "<location>" in location settings on Teacher App
        When "teacher" searches course by the keyword
        Then "teacher" sees course which has name contains the keyword and location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        Examples:
            | location | order                                                                                      |
            | brand    | one parent location and one smallest id child location along with number of remained child |
            | center   | one child                                                                                  |

    Scenario Outline: Teacher can remove search keyword but still applying location in location settings
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        And "teacher" has refreshed their browser on Teacher App
        And "teacher" has applied location "<location>" in location settings on Teacher App
        And "teacher" has searched course by the keyword
        When "teacher" removes the keyword in the search bar on Teacher app
        And "teacher" presses enter
        Then "teacher" does not see the keyword in the search bar on Teacher App
        And "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        Examples:
            | location | order                                                                                      |
            | brand    | one parent location and one smallest id child location along with number of remained child |
            | center   | one child                                                                                  |