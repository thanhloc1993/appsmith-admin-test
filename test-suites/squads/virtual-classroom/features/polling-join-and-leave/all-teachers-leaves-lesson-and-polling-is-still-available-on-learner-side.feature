@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-polling-join-and-leave

Feature: Polling is still available on Learner side when all teachers leave lesson

    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1" has joined lesson of lesson management on Teacher App
        And "teacher T2" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Polling is still available on Learner side when all teachers leave lesson
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        And "teacher T1" has started polling on Teacher App
        And "student" has seen answer bar with 4 options on Learner App
        And "teacher T2" has seen "active" polling icon on Teacher App
        When "teacher T1" leaves lesson on Teacher App
        And "teacher T2" leaves lesson on Teacher App
        Then "student" still sees answer bar on Learner App
        And "student" still sees "active" polling icon on Learner App
