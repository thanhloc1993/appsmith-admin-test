@cms @cms2
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can discard editing submitted individual lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has created an individual lesson report
        And "teacher" has opened editing individual lesson report
        And "teacher" has changed fields info

    Scenario Outline: Teacher can discard editing submitted lesson report of future lesson by <option>
        When "teacher" discards editing lesson report by "<option>"
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" does not see updated lesson report
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |

    Scenario Outline: Teacher can cancel discarding editing submitted lesson report of future lesson
        When "teacher" cancels discarding editing lesson report by "<option>"
        Then "teacher" is still in editing individual lesson report page
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |
