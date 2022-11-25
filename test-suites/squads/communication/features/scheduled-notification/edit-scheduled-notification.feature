@cms @learner @learner2
@communication
@scheduled-notification

Feature: Edit scheduled notification on CMS

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a scheduled notification
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Update <field> of scheduled notification successfully with <button> button
        Given "school admin" searches this notification
        And school admin has opened a scheduled notification dialog
        When school admin edits "<field>" of scheduled notification
        And school admin clicks "<button>" button
        Then "school admin" searches this notification
        And school admin sees updated "<field>" scheduled notification on CMS
        Examples:
            | field                | button        |
            | Title                | Save schedule |
            | Content              | Save schedule |
            | Date                 | Save schedule |
            | Time                 | Save schedule |
            | Grade                | Save schedule |
            | Course               | Save schedule |
            | Individual Recipient | Save schedule |
            | All fields           | Save schedule |
