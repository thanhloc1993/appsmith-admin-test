@cms @teacher
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit teaching medium of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario: School admin can edit teaching medium from offline to online of past lesson
        Given school admin has created an offline lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits to "Online" teaching medium
        And "school admin" saves the changes of the lesson
        And "teacher" refreshes their browser on Teacher App
        Then "school admin" sees "Online" teaching medium in detailed lesson page
        And "teacher" sees the "past" lesson on Teacher App
    # TODO: Will implement in the future
    # And "student" still sees the "past" lesson on Learner App

    Scenario: School admin can edit teaching medium from online to offline of past lesson
        Given school admin has created an online lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits to "Offline" teaching medium
        And "school admin" saves the changes of the lesson
        And "teacher" refreshes their browser on Teacher App
        Then "school admin" sees "Offline" teaching medium in detailed lesson page
        And "teacher" does not see the "past" lesson on Teacher App