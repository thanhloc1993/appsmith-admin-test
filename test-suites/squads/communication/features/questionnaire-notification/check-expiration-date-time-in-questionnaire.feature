@cms
@communication
@questionnaire-notification

Feature: Check expiration date/time in questionnaire
    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    @ignore
    Scenario: Check default expiration date/time
        When "school admin" create new notification
        And "school admin" clicks on Add questionnaire
        Then "school admin" sees expiration date display one week from current date

    Scenario Outline: Send invalid schedule date with Questionnaire
        When "school admin" create schedule questionnaire notification with expiration before schedule "<invalidField>"
        Then "school admin" clicks Save Schedule in notification dialog
        And "school admin" sees validation at expiration "<invalidField>"
        Examples:
            | invalidField |
            | Date         |
            | Time         |

    Scenario: Edit and send invalid schedule date with Questionnaire
        When "school admin" creates schedule notification
        And "school admin" creates questionnaire with expiration date time after scheduled date time
        And "school admin" clicks "Save schedule" in notification dialog
        Then "school admin" edits schedule notification with expiration date time before schedule date time
        And "school admin" clicks Save Schedule in notification dialog
        And "school admin" sees validation at expiration date time
