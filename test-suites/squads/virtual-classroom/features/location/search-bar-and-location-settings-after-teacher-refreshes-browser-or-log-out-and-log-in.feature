@cms @teacher
@virtual-classroom
@virtual-classroom-location-settings-teacher-app
@ignore

Feature: Search bar and location settings after teacher refreshes browser or log out and log in
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Teacher cannot see search keyword after teacher applies and then refreshes browser
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        And "teacher" has applied location "<location>" in location settings on Teacher App
        And "teacher" has searched course by the keyword
        When "teacher" refreshes their browser on Teacher App
        Then "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        And "teacher" does not see the keyword in the search bar on Teacher App
        Examples:
            | location | order                                                                                      |
            | brand    | one parent location and one smallest id child location along with number of remained child |
            | center   | one child                                                                                  |

    Scenario Outline: Teacher cannot see search keyword after going back from detailed course page and refreshes browser
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        And "teacher" has applied location "<location>" in location settings on Teacher App
        And "teacher" has searched course by the keyword
        When "teacher" goes to detailed course page on Teacher App
        And "teacher" refreshes their browser on Teacher App
        And "teacher" backs to course list on Teacher App
        Then "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        And "teacher" does not see the keyword in the search bar on Teacher App
        Examples:
            | location | order                                                                                      |
            | brand    | one parent location and one smallest id child location along with number of remained child |
            | center   | one child                                                                                  |

    Scenario Outline: Teacher cannot see search keyword but still sees location in location settings after log out and log in again
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        And "teacher" has applied location "<location>" in location settings on Teacher App
        And "teacher" has searched course by the keyword
        When "teacher" logs out of Teacher App
        And "teacher" logins again on Teacher App
        Then "teacher" does not see the keyword in the search bar on Teacher App
        And "teacher" opens location settings in nav bar on Teacher App
        And "teacher" sees unauthorized location in location dialog and unable to select on Teacher App
        And "teacher" sees location "<location>" is checked in location dialog
        Examples:
            | location |
            | brand    |
            | center   |