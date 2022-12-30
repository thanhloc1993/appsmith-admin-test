@cms
@communication
@compose-notification

Feature: Fail to send notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Fail to send notification when missing "<requiredField>"
        Given school admin has opened compose new notification full-screen dialog
        When school admin leaves "<requiredField>" of notification blank
        And school admin sends notification
        Then school admin sees error message display on CMS
        Examples:
            | requiredField                   |
            | Title                           |
            | Content                         |
            | Recipient Group                 |
            | Title, Content                  |
            | Title, Recipient Group          |
            | Content, Recipient Group        |
            | Title, Content, Recipient Group |