@cms
@lesson
@lesson-status
@ignore

Feature: The status auto-change to Published or Draft when publishing or saving draft lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: The status auto-change when publishing or saving draft an one-time lesson
        Given "school admin" has "<action>" a "<recurring_settings>" "<lesson_type>" lesson
        And "school admin" has opened editing lesson page
        When "school admin" "<action_2>" a lesson
        Then "school admin" sess the lesson's status is "<expected_status>"
        Examples:
            | action      | action_2    | recurring_settings | lesson_type | expected_status |
            | saved draft | publishes   | one-time           | individual  | Published       |
            | saved draft | publishes   | one-time           | group       | Published       |
            | published   | saves draft | one-time           | individual  | Draft           |
            | published   | saves draft | one-time           | group       | Draft           |

    Scenario Outline: The status auto-change when publishing or saving draft a recurring lesson
        Given "school admin" has "<action>" a "<recurring_settings>" "<lesson_type>" lesson
        And "school admin" has opened editing lesson page of the 2nd lesson in the chain
        When "school admin" "<action_2>" a lesson with the "This and the following lessons" option
        Then "school admin" sess the status of this lesson is "<expected_status>"
        And "school admin" sees the status of other lessons in the chain from the edited lesson is "<expected_status>"
        And "school admin" sees the status of other lessons in the chain before the edited lesson is "<expected_status_2>"
        And "school admin" does not see the end date of other lessons in the chain before the edited lesson are updated
        Examples:
            | action      | action_2    | recurring_settings | lesson_type | expected_status | expected_status_2 |
            | saved draft | publishes   | weekly recurring   | individual  | Published       | Draft             |
            | saved draft | publishes   | weekly recurring   | group       | Published       | Draft             |
            | published   | saves draft | weekly recurring   | individual  | Draft           | Published         |
            | published   | saves draft | weekly recurring   | group       | Draft           | Published         |

    Scenario Outline: The status auto-change when publishing or saving draft a recurring lesson with only this lesson
        Given "school admin" has "<action>" a "<recurring_settings>" "<lesson_type>" lesson
        And "school admin" has opened editing lesson page of the 2nd lesson in the chain
        When "school admin" "<action_2>" a lesson with the "<expected_status>" option
        Then "school admin" sees the status of this lesson is "<expected_status>"
        And "school admin" sees the status of other lessons in the chain is "<expected_status_2>"
        Examples:
            | action      | action_2    | recurring_settings | lesson_type | expected_status | expected_status_2 |
            | saved draft | publishes   | weekly recurring   | individual  | Published       | Draft             |
            | saved draft | publishes   | weekly recurring   | group       | Published       | Draft             |
            | published   | saves draft | weekly recurring   | individual  | Draft           | Published         |
            | published   | saves draft | weekly recurring   | group       | Draft           | Published         |
