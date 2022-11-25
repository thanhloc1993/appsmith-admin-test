@cms @teacher @learner
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit teaching medium of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App

    Scenario: School admin can edit teaching medium from offline to online of future lesson
        Given school admin has created an offline lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits to "Online" teaching medium
        And "school admin" saves the changes of the lesson
        Then "school admin" sees "Online" teaching medium in detailed lesson page
        And "teacher" sees the "future" lesson on Teacher App
        And "student" still sees the "future" lesson on Learner App

    Scenario: School admin can edit teaching medium from online to offline of future lesson
        Given school admin has created an online lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits to "Offline" teaching medium
        And "school admin" saves the changes of the lesson
        Then "school admin" sees "Offline" teaching medium in detailed lesson page
        And "teacher" does not see the "future" lesson on Teacher App
        And "student" does not see the "future" lesson on Learner App
