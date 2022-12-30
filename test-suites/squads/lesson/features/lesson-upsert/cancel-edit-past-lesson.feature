@cms
@lesson
@lesson-upsert
@ignore

Feature: School admin can cancel editing past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page

    Scenario: School admin can cancel leaving editing past lesson
        Given "school admin" has updated all fields of "past" lesson
        When "school admin" cancels leaving editing lesson page
        Then "school admin" is still in editing lesson page

    Scenario: School admin can leave editing past lesson
        Given "school admin" has updated all fields of "past" lesson
        When "school admin" leaves editing lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see updated lesson on CMS
