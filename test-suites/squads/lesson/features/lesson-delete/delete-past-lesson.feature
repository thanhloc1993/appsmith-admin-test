@cms @teacher @learner
@lesson
@lesson-delete
@ignore

Feature: School admin can delete past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management that has been completed over 24 hours

    Scenario: School admin can delete past lesson which does not have lesson report
        Given "school admin" has gone to detailed the newly "past" lesson info page
        When "school admin" deletes the lesson
        # TODO: Will implement in the future
        # Then "school admin" is redirected to "past" lessons list page
        Then "school admin" does not see the "past" lesson on CMS
        And "teacher" does not see the "past" lesson on Teacher App
        And "student" does not see the "past" lesson on Learner App

    Scenario: School admin can cancel deleting past lesson which does not have lesson report
        Given "school admin" has gone to detailed the newly "past" lesson info page
        When "school admin" cancels deleting the lesson
        Then "school admin" is still in detailed lesson info page
        And "school admin" still sees the "past" lesson on CMS
        And "teacher" still sees the "past" lesson on Teacher App
        And "student" still sees the "past" lesson on Learner App
