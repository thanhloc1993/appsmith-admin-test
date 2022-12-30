@cms @teacher @learner
@communication
@assignment-returned-notification

Feature: Check notification bell and unread status when receive assignment return notification

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And "school admin" has created study plan with assignment and add for student
        And "student" has submitted assignment

    Scenario: Notification bell and unread status is displayed when student receive assignment return notification
        When "teacher" changes status of assignment to returned
        Then "student" sees notification bell display with badge number
        And "student" sees unread status display in notification list

    Scenario: Notification bell and unread status does not displayed when student read assignment return notification
        Given "teacher" has changed status of assignment to returned
        When "student" reads notification
        Then "student" sees notification bell display without badge number
        And "student" sees unread status does not display in notification list