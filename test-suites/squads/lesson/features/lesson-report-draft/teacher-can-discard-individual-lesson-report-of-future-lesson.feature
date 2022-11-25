@cms @cms2
@lesson
@lesson-report-draft
@ignore

Feature: Teacher can discard individual lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Teacher can discard lesson report of future lesson by <option>
        Given "teacher" has fulfilled lesson report info
        When "teacher" discards lesson report by "<option>"
        And "teacher" confirms discarding lesson report
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" does not see new individual lesson report
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |

    Scenario Outline: Teacher can cancel discarding lesson report of future lesson
        Given "teacher" has fulfilled lesson report info
        When "teacher" discards lesson report by "<option>"
        And "teacher" cancels discarding lesson report
        Then "teacher" is still in creating individual lesson report page
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | Esc keyboard button |
