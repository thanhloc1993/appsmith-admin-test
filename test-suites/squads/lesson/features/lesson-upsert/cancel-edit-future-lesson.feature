@cms
@lesson
@lesson-upsert
@ignore

Feature: School admin can cancel editing future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page

    Scenario: School admin can cancel leaving editing future lesson
        Given "school admin" has updated all fields of "future" lesson
        When "school admin" cancels leaving editing lesson page
        Then "school admin" is still in editing lesson page

    Scenario: School admin can leave editing future lesson
        Given "school admin" has updated all fields of "future" lesson
        When "school admin" leaves editing lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see updated lesson on CMS
