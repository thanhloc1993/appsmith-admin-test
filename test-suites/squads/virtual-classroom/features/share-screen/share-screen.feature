@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-screen

Feature: Share screen in the lesson
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can share their entire screen in the lesson
        When "teacher T1" shares their entire screen on Teacher App
        Then "teacher T1" sees "active" share screen icon on Teacher App
        And "teacher T2" sees "inactive" share screen icon on Teacher App
        And "teacher T2" sees screen which has been shared on Teacher App
        And "student" sees screen which has been shared on Learner App

    Scenario: Teacher can stop sharing their entire screen in the lesson
        Given "teacher T1" has shared their entire screen on Teacher App
        When "teacher T1" stops sharing their entire screen on Teacher App
        Then "teacher T1" sees "inactive" share screen icon on Teacher App
        And "teacher T2" sees "inactive" share screen icon on Teacher App
        And "teacher T2" does not see screen which has been shared on Teacher App
        And "student" does not see screen which has been shared on Learner App

    Scenario: Teacher can not share screen while other teacher is sharing screen in the lesson
        Given "teacher T1" has shared their entire screen on Teacher App
        When "teacher T2" shares their entire screen on Teacher App
        Then "teacher T2" sees cannot overlap share screen dialog and can not share screen
        And "teacher T2" sees "inactive" share screen icon on Teacher App