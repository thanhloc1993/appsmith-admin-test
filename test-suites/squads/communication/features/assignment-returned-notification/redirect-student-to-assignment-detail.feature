@cms @teacher @learner
@communication
@assignment-returned-notification

Feature: Redirect student to assignment detail

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "school admin" has created study plan with assignment and add for student
        And "student" has submitted assignment

    Scenario: Redirect student to assignment detail
        Given "teacher" has changed status of assignment to returned
        When "student" accesses to notification detail
        And "student" selects view assignment button
        Then "student" sees assignment info in assignment detail display correctly