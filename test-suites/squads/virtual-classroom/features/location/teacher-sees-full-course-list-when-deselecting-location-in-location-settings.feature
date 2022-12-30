@cms @teacher
@architecture
@architecture-location
@ignore

Feature: Teacher still sees respective course list when discarding deselecting location <location> in location settings
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Teacher still sees respective course list when discarding deselecting location <location> in location settings
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        And school admin has created a new course with location "<location>"
        When "teacher" applies location "<location>" in location settings on Teacher App
        And "teacher" discards deselecting location "<location>" in location settings by "<option>"
        Then "teacher" sees course which has location is included in selected location settings
        And "teacher" sees "<order>" location name under teacher's name on Teacher App
        Examples:
            | location | option        | order                                                                                      |
            | brand    | cancel button | one parent location and one smallest id child location along with number of remained child |
            | center   | cancel button | one child                                                                                  |
            | brand    | X button      | one parent location and one smallest id child location along with number of remained child |
            | center   | X button      | one child                                                                                  |
