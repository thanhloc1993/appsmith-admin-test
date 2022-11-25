@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-create

Feature: Teacher and student can hide or show again a polling
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can hide current polling on Teacher App
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "teacher" hides polling on Teacher App
        Then "teacher" does not see Stats page on Teacher App
        And "teacher" still sees "active" polling icon on Teacher App
        And "student" still sees answer bar on Learner App

    Scenario: Student can hide current polling on Learner App
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "student" hides polling on Learner App
        Then "student" does not see answer bar on Learner App
        And "student" still sees "active" polling icon on Learner App
        And "teacher" still sees "active" polling icon on Teacher App

    Scenario: Teacher can show again current polling on Teacher App
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "teacher" has hidden polling on Teacher App
        When "teacher" shows again polling on Teacher App
        Then "teacher" sees Stats page on Teacher App
        And "teacher" still sees "active" polling icon on Teacher App
        And "student" still sees answer bar on Learner App

    Scenario: Student can show again current polling on Learner App
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "student" has hidden polling on Learner App
        When "student" shows again polling on Learner App
        Then "student" sees answer bar on Learner App
        And "teacher" still sees "active" polling icon on Teacher App
