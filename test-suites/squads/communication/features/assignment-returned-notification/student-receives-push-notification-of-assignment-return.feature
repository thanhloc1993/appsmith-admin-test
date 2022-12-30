@cms @teacher @learner
@communication
@assignment-returned-notification
@ignore

Feature: Student receives push notification of assignment return

    Background:
        Given "school admin" logins CMS
        And "school admin" has created teacher
        And "school admin" has created student
        And "school admin" has created study plan with assignment and add for student
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "student" has submitted assignment

    Scenario: Student receive assignment return push notification in foreground
        When "teacher" changes status of assignment to returned
        Then "student" sees push notification in their device

    Scenario: Student receive assignment return push notification in background
        When "student" sends Learner App to background
        And "teacher" changes status of assignment to returned
        Then "student" sees push notification in their device

    Scenario: Student receive assignment return push notification when kill-app
        When "student" kills app
        And "teacher" changes status of assignment to returned
        Then "student" sees push notification in their device

    Scenario: Student receive assignment return push notification multiple times
        Given "teacher" has changed status of assignment to returned
        When "student" re-submits assignment
        And "teacher" changes status of assignment to returned
        Then "student" sees 2 push notifications in their device
