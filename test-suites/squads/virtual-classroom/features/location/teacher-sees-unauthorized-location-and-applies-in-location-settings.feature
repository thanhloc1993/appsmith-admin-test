@cms @teacher
@architecture
@architecture-location
@ignore

Feature: Teacher sees unauthorized location and respective course after applying location in location settings
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Teacher sees unauthorized locations in location dialog and unable to select
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        When "teacher" opens location settings in nav bar on Teacher App
        Then "teacher" sees unauthorized location in location dialog and unable to select on Teacher App
        Examples:
            | location |
            | brand    |
            | center   |

    Scenario Outline: Teacher sees respective course after applying location <location> in location settings
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        When "teacher" applies location "<location>" in location settings on Teacher App
        Then "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        Examples:
            | location | order                                                                                      |
            | brand    | one parent location and one smallest id child location along with number of remained child |
            | center   | one child                                                                                  |

    Scenario Outline: Teacher cannot apply location settings with uncheck all locations in location settings
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        When "teacher" opens location settings in nav bar on Teacher App
        And "teacher" applies with uncheck all location in location settings in nav bar on Teacher App
        Then "teacher" sees an alert message is displayed on Teacher App
        And "teacher" is still in location settings dialog
        Examples:
            | location |
            | brand    |
            | center   |