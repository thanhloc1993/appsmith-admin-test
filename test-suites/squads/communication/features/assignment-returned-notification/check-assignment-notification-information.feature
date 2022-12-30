@cms @teacher @learner
@communication
@assignment-returned-notification

Feature: Check assignment notification information

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with "VN" country code
        And "school admin" has created study plan with assignment and add for student
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "student" has submitted assignment

    @ignore
    Scenario: Check assignment return notification information in push notification
        When "teacher" changes status of assignment to returned
        Then "student" sees "Assignment returned" title in push notification display correctly

    Scenario: Check assignment return notification information in notification list
        When "teacher" changes status of assignment to returned
        And "student" accesses to notification list
        Then "student" sees "Assignment returned" title and assignment name in notification list display correctly

    Scenario: Check assignment return notification information in notification detail
        When "teacher" changes status of assignment to returned
        And "student" accesses to notification detail
        Then "student" sees "Assignment returned" title and assignment name in notification detail display correctly