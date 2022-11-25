@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-polling-join-and-leave

Feature: Teacher and student join after one teacher starts polling will be redirected to current polling screen
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1" has joined lesson of lesson management on Teacher App

    Scenario: Teacher and student join after one teacher starts polling will be redirected to current polling screen
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        And "teacher T1" has started polling on Teacher App
        When "teacher T2" joins lesson of lesson management on Teacher App
        And "student" joins lesson on Learner App
        Then "teacher T2" is redirected to Stats page on Teacher App
        And "teacher T2" sees "active" polling icon on Teacher App
        And "student" sees answer bar with 4 options on Learner App

    Scenario: Teacher and student join after one teacher opens polling will not be redirected to set up polling screen
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        When "teacher T2" joins lesson of lesson management on Teacher App
        And "student" joins lesson on Learner App
        Then "teacher T2" is not redirected to set up polling page with 4 default options on Teacher App
        And "teacher T2" sees "inactive" polling icon on Teacher App
        And "student" does not see answer bar on Learner App