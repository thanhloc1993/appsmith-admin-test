@cms
@communication
@notification-blocker

Feature: Schedule notification with target

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    @blocker
    Scenario: Schedule notification send successfully with course and grade
        Given school admin has opened compose new notification full-screen dialog
        When "school admin" fills scheduled notification with course and grade to student
        And school admin clicks "Save schedule" button
        And school admin sees message "You have created a new notification successfully!"
        And "school admin" wait to see notification sent successfully on time
        Then "school admin" searches this notification
        And "school admin" views detail notification
        And "school admin" sees notification display correct data
