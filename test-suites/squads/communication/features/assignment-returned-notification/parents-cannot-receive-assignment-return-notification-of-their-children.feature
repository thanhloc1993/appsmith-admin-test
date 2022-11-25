@cms @teacher @learner @parent
@communication
@assignment-returned-notification

Feature: Parents cannot receive assignment return notification of their children

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "parent P1" of "student" logins Learner App
        And "school admin" has created study plan with assignment and add for student
        And "student" has submitted assignment

    Scenario: Parents cannot receive assignment return notification of their children
        When "teacher" changes status of assignment to returned
        And "parent P1" accesses to notification list
        Then "parent P1" does not see notification of assignment return in notification list