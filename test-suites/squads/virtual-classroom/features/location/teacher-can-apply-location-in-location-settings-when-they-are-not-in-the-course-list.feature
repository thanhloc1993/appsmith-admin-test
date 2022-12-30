@cms @teacher
@virtual-classroom
@virtual-classroom-location-settings-teacher-app
@ignore

Feature: Teacher can apply location in location settings when they are not in the course list
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    #refactor later
    Scenario Outline: Teacher is redirected to the course list page after applying <type> location in location settings
        Given school admin has created a new course with "<type>" location
        When "teacher" goes to course detail screen
        And "teacher" confirms applying "<type>" location in location settings on Teacher App
        Then "teacher" is redirected to the course list page on Teacher App
        And "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        Examples:
            | type                          | order                                                                                      |
            | one child location of parent  | one child                                                                                  |
            | all child locations of parent | one smallest id child location along with number of remained child                         |
            | one parent                    | one parent location and one smallest id child location along with number of remained child |

    Scenario Outline: Teacher is still in detail course page when discarding applying <type> location in location settings
        Given school admin has created a new course with "<type>" location
        And "teacher" has refreshed their browser on Teacher App
        When "teacher" goes to course detail screen
        And "teacher" discards applying "<type>" location in location settings on Teacher App by "<option>"
        Then "teacher" is still in detail course page
        And "teacher" does not see any location name under teacher's name on Teacher App
        Examples:
            | type                          | option        |
            | one child location of parent  | cancel button |
            | all child locations of parent | cancel button |
            | one parent                    | cancel button |
            | one child location of parent  | X button      |
            | all child locations of parent | X button      |
            | one parent                    | X button      |