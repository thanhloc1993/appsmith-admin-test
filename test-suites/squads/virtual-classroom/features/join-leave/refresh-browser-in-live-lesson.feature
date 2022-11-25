@cms @teacher @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Teacher and student will be out of lesson when they refresh their browser
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Student will be out of lesson when they refresh their browser
        When "student" refreshes their browser on Learner App
        Then "student" is redirected to lesson list on Learner App
        And "teacher" does not see student in student list on Teacher App

    Scenario: Teacher will be out of lesson when they refresh their browser
        When "teacher" refreshes their browser on Teacher App
        Then "teacher" is redirected to lesson detail info page on Teacher App
        And "teacher" is not shown in gallery view on Learner App
        And "student" sees message Teacher has left the class on Learner App
