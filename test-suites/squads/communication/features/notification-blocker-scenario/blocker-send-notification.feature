@cms
@communication
@notification-blocker

Feature: Create and send notification with target

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    # @blocker
    Scenario: Create and send notification with course and grade
        Given school admin has opened compose new notification full-screen dialog
        When "school admin" sends notification with course and grade to student
        And school admin clicks "Send" button
        And school admin sees message "You have sent the notification successfully!"
        Then "school admin" searches this notification
        And "school admin" views detail notification
        And "school admin" sees notification display correct data
