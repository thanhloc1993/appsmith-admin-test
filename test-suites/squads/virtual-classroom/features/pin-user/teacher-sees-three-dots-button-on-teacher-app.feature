@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher can hover to see three dots button on Teacher App
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can see options menu when hovering and clicking on three dots button
        Given "teacher T2" has turned on their camera on Teacher App
        When "teacher T1" clicks on three dots button in "<user>" gallery camera view on Teacher App
        Then "teacher T1" sees "Pin for me" and "Spotlight for students" options
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |