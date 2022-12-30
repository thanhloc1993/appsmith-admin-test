@cms @teacher @learner @teacher2
@virtual-classroom
@virtual-classroom-spotlight-material-and-share-screen

Feature: Teacher can not spotlight for student for user when sharing screen
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T2" has turned on their camera on Teacher App

    Scenario Outline: Teacher can not spotlight user for student while sharing the screen
        Given "teacher T1" has shared their entire screen on Teacher App
        When "teacher T1" clicks on three dots button in "<user>" gallery camera view on Teacher App
        Then "teacher T1" sees "Spotlight for students" option is disabled
        And "teacher T1" clicks on "Spotlight for students" "disable" option
        And "teacher T1, teacher T2" see "<user>" stream is not covered with white frame in the gallery view on Teacher App
        And "student" does not see "<user>" stream in the main screen on Learner App
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |