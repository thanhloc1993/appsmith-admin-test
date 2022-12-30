@cms
@lesson
@lesson-status
@ignore

Feature: School Admin can manually cancel completed or published lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin cancel one-time lesson
        Given "school admin" has "<action>" a "<recurring_settings>" "<lesson_type>" lesson
        And "school admin" has gone to detail lesson info page
        When "school admin" clicks three dots icon
        And "school Admin" cancels lesson
        And "school admin" "<confirm_action>" to cancel lesson
        Then "school admin" sees the lesson's status is "<expected_status>"
        Examples:
            | action    | recurring_settings | lesson_type | confirm_action | expected_status |
            | completed | one-time           | individual  | confirms       | Cancelled       |
            | completed | one-time           | group       | confirms       | Cancelled       |
            | published | one-time           | individual  | confirms       | Cancelled       |
            | published | one-time           | individual  | cancels        | Published       |
            | published | one-time           | group       | confirms       | Cancelled       |

    Scenario Outline: School Admin can cancel the weekly recurring lesson
        Given "school admin" has "<action>" a "<recurring_settings>" "<lesson_type>" lesson with Attendance status
        And "school admin" has gone to detail lesson info page of the 2nd in the chain
        When "school admin" clicks three dots icon
        And "school admin" confirms to cancelling lesson
        Then "school admin" sees this status is "<expected_status>"
        And "school admin" sees the status of other lessons in the chain is "<original_status>"
        Examples:
            | action    | recurring_settings | lesson_type | expected_status | original_status |
            | completed | weekly recurring   | individual  | Cancelled       | Completed       |
            | completed | weekly recurring   | group       | Cancelled       | Completed       |
            | published | weekly recurring   | individual  | Cancelled       | Published       |
            | published | weekly recurring   | group       | Cancelled       | Published       |