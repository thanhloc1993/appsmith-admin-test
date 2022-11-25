@cms @teacher
@architecture
@architecture-location

Feature: First granted location is automatically selected in teacher app
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario: Teacher's location and Location Dialog is updated
        Then "teacher" sees first granted location name under teacher's name on Teacher App
        And "teacher" sees checkbox on the first granted location

    Scenario: Teacher sees error message when saving without location
        When "teacher" deselects all location in location dialog and saves on Teacher App
        Then "teacher" sees an error message is displayed on snackbar

    Scenario: Teacher can see the course under first granted location
        Given school admin has created a course under first granted location
        When "teacher" searches course by the keyword
        Then "teacher" sees the previously created course under first granted location

    Scenario Outline: Teacher can see the <type> with course under first granted location
        Given school admin has created a "<type>" with course under first granted location
        When "teacher" goes to course detail screen
        And "teacher" goes to "<type>" tab screen
        Then "teacher" sees the previously created "<type>" under first granted location
        Examples:
            | type    |
            | student |
            | lesson  |