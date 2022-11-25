@cms @cms2
@lesson
@lesson-report-draft
@ignore

Feature: Teacher can discard individual lesson report of past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario Outline: Teacher can discard lesson report of past lesson by <option>
        Given "teacher" has fulfilled lesson report info
        When "teacher" discards lesson report by "<option>"
        And "teacher" confirms discarding lesson report
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" does not see new individual lesson report
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | esc keyboard button |

    Scenario Outline: Teacher can cancel discarding lesson report of past lesson
        Given "teacher" has fulfilled lesson report info
        When "teacher" discards lesson report by "<option>"
        And "teacher" cancels discarding lesson report
        Then "teacher" is still in creating individual lesson report page
        Examples:
            | option              |
            | X button            |
            | Discard button      |
            | esc keyboard button |
