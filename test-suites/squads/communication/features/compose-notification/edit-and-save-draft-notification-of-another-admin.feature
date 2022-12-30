@communication
@compose-notification
@cms @cms2
@learner @learner2

Feature: Edit and save draft notification of another admin

    Background:
        Given "school admin 1" logins CMS
        And "school admin 1" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "school admin 1" has created a draft notification
        And "school admin 1" is at "Notification" page on CMS
        And "school admin 2" logins CMS
        And "school admin 2" is at "Notification" page on CMS

    Scenario Outline: Edit <field> of draft notification and save successfully
        When "school admin 2" selects created draft notification
        And "school admin 2" edits "<field>" of draft notification
        And "school admin 2" clicks Save draft button
        Then "school admin 2 and school admin 1" sees draft notification is saved successfully with new "<field>"
        Examples:
            | field                |
            | Title                |
            | Content              |
            | Course               |
            | Grade                |
            | individual recipient |
            | Attach File          |
            | all fields           |
