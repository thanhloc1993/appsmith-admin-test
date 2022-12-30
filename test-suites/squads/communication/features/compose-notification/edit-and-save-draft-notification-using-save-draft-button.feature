@cms @learner @learner2
@communication
@compose-notification

Feature: Edit and save draft notification using save draft button

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "school admin" has created a draft notification
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Edit <field> of draft notification and save successfully
        When "school admin" selects created draft notification
        And "school admin" edits "<field>" of draft notification
        And school admin clicks "Save draft" button
        Then "school admin" sees draft notification is saved successfully with new "<field>"
        Examples:
            | field                |
            | Title                |
            | Content              |
            | Course               |
            | Grade                |
            | Individual Recipient |
            | Attach File          |
            | All                  |
