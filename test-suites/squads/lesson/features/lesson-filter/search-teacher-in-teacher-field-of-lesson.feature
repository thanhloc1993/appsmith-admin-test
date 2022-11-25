@cms
@lesson
@lesson-filter

Feature: School admin can search teacher in teacher field
    Background:
        Given "school admin" logins CMS
        And "school admin" has gone to lesson management page

    Scenario: School admin can search teacher in teacher field in creating lesson page
        Given "school admin" has created "1" new teacher
        And "school admin" has opened creating lesson page
        When "school admin" searches and selects for the created teacher
        Then "school admin" sees selected teacher in teacher field

    Scenario: School admin can search teacher in teacher field in editing lesson page
        Given school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has created "1" new teacher
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" searches and selects for the created teacher
        Then "school admin" sees selected teacher in teacher field

    Scenario: School admin can select multiple teachers in teacher field in creating lesson page
        Given "school admin" has created "2" new teacher
        And "school admin" has opened creating lesson page
        When "school admin" searches and clears for the created teacher
        And "school admin" searches and selects for the created teacher
        Then "school admin" sees selected teacher in teacher field
