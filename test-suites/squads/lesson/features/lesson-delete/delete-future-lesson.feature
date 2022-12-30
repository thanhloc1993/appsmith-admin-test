@cms @teacher @learner
@lesson
@lesson-delete
@ignore

Feature: School admin can delete future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now

    Scenario: School admin can delete future lesson which does not have lesson report
        Given "school admin" has gone to detailed the newly "future" lesson info page
        When "school admin" deletes the lesson
        # TODO: Will implement in the future
        # Then "school admin" is redirected to "future" lessons list page
        Then "school admin" does not see the "future" lesson on CMS
        And "teacher" does not see the "future" lesson on Teacher App
        And "student" does not see the "future" lesson on Learner App

    Scenario: School admin can cancel deleting future lesson which does not have lesson report
        Given "school admin" has gone to detailed the newly "future" lesson info page
        When "school admin" cancels deleting the lesson
        Then "school admin" is still in detailed lesson info page
        And "school admin" still sees the "future" lesson on CMS
        And "teacher" still sees the "future" lesson on Teacher App
        And "student" still sees the "future" lesson on Learner App
