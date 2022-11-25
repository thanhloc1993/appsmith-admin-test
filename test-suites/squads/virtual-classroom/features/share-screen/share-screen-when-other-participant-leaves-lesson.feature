@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-screen

Feature: Share screen when teacher or student leaves lesson
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has shared their entire screen on Teacher App

    Scenario: Other teacher can see current screen which has been shared in the lesson after rejoining
        When "teacher T2" leaves lesson on Teacher App
        And "teacher T2" rejoins lesson on Teacher App
        Then "teacher T2" still sees "inactive" share screen icon on Teacher App
        And "teacher T2" sees screen which has been shared on Teacher App

    Scenario: Student can see current screen which has been shared in the lesson after rejoining
        When "student" leaves lesson on Learner App
        And "student" rejoins lesson on Learner App
        Then "student" sees screen which has been shared on Learner App