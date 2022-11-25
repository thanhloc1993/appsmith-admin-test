@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-spotlight

Feature: All teachers can see stop spotlighting for students option in menu option
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher sees "Pin for me" and "Stop spotlighting for students" option
        When "teacher T1" spotlights "<user>" on Teacher App
        And "teacher T1" clicks on three dots button in "<user>" gallery camera view on Teacher App
        Then "teacher T1" sees "Pin for me" and "Stop spotlighting for students" options
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |

    Scenario Outline: Another teacher sees "Pin for me" and "Stop spotlighting for students" option
        When "teacher T1" spotlights "<user>" on Teacher App
        And "teacher T2" clicks on three dots button in "<user>" gallery camera view on Teacher App
        Then "teacher T2" sees "Pin for me" and "Stop spotlighting for students" options
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |
            | student    |