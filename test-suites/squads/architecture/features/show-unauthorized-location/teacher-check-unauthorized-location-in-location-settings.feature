@cms @teacher
@architecture
@architecture-location

Feature: Unauthorized location in location dialog
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Teacher sees unauthorized locations in location dialog and unable to select
        Given school admin has created user group with location "<location>" with role "Teacher"
        And school admin has updated the teacher user group
        When "teacher" reloads Teacher App
        And "teacher" opens location dialog on Teacher App
        Then "teacher" sees "<location2>" in location dialog as unauthorized location and unable to select
        Examples:
            | location | location2     |
            | brand    | org           |
            | center   | org and brand |
