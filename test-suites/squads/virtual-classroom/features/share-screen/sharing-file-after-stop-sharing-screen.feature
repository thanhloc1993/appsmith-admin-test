@cms @teacher @learner
@virtual-classroom
@virtual-classroom-share-screen
@ignore

Feature: Sharing file after stop sharing screen
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "student" with enrolled status has logged Learner App
        And "school admin" has added course for "student"
        And school admin has created a lesson of lesson management on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher T1" joins lesson on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: All participants can see shared pdf with annotation after stop sharing screen
        Given "teacher T1" has shared pdf on Teacher App
        And "teacher T1" has annotated on Teacher App
        And "teacher T1" has shared their "<screen>" on Teacher App
        When "teacher T1" stops sharing their "<screen>" on Teacher App
        Then "teacher T1" sees current pdf with annotation on Teacher App
        And "student" sees current pdf with annotation on Learner  App
        Examples:
            | screen        |
            | entire screen |
            | window        |
            | chrome tab    |

    Scenario Outline: All participants can see shared video after stop sharing screen
        Given "teacher T1" has shared video on Teacher App
        And "teacher T1" has shared their "<screen>" on Teacher App
        When "teacher T1" stops sharing their "<screen>" on Teacher App
        Then "teacher T1" sees current video is paused from the beginning on Teacher App
        And "student" sees current video is paused from the beginning on Learner App
        Examples:
            | screen        |
            | entire screen |
            | window        |
            | chrome tab    |
#PM Alignment