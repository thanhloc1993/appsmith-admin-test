@cms @learner
@communication
@compose-notification

Feature: Fail to save draft notification using save draft button

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "school admin" has created a draft notification
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Fail to save new draft notification when using Save draft button without "<requiredField>"
        When "school admin" selects created draft notification
        And school admin sets "<requiredField>" of draft notification blank
        And "school admin" clicks Save draft button
        And school admin sees error message for "<requiredField>"
        And school admin closes compose notification full-screen dialog
        Then school admin sees draft notification with new data is not saved
        Examples:
            | requiredField   |
            | Title           |
            | Content         |
            | Title & Content |
