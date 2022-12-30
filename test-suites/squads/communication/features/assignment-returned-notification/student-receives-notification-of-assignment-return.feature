@cms @teacher @learner
@communication
@assignment-returned-notification

Feature: Student receives notification of assignment return

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "school admin" has created study plan with assignment and add for student
        And "student" has submitted assignment

    Scenario: Student receive notification of assignment return in notification list
        When "teacher" changes status of assignment to returned
        Then "student" sees notification of assignment return in notification list

    Scenario: Student receive multiple notifications of assignment return in notification list
        Given "teacher" has changed status of assignment to returned
        When "student" re-submits assignment
        And "teacher" changes status of assignment to returned
        Then "student" sees 2 notifications of assignment return in notification list