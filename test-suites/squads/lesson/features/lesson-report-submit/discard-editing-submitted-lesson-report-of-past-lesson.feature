@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can discard editing submitted individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has created an individual lesson report
        And "teacher" has opened editing individual lesson report
        And "teacher" has changed fields info

    Scenario Outline: Teacher can discard editing submitted lesson report of past lesson by <option>
        When "teacher" discards editing lesson report by "<option>"
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" does not see updated lesson report
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |

    Scenario Outline: Teacher can cancel discarding editing submitted lesson report of past lesson
        When "teacher" cancels discarding editing lesson report by "<option>"
        Then "teacher" is still in editing individual lesson report page
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |
