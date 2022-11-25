@cms @cms2 @learner
@lesson
@lesson-report-previous-report

Feature: Teacher can view the previous submitted group lesson report of past recurring lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and class and enrolled status has logged Learner App
        And "teacher" has created a weekly recurring "group" lesson with lesson date in the "past"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "group" lesson report page
        And "teacher" has fulfilled group lesson report info
        And "teacher" has submitted group lesson report

    Scenario: Teacher can view the previous draft group lesson report in creating lesson report page
        Given "teacher" has created a "past" "One Time" group lesson after that lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "group" lesson report page
        Then "teacher" sees the previous lesson report icon is "enabled" in lesson report group "upsert" page
        And "teacher" sees the previous group lesson report of lesson in lesson report group "upsert" page
        And "teacher" sees student has same class with lesson in previous report in lesson report group page

    Scenario: Teacher can view the previous draft group lesson report in detailed lesson report page
        Given "teacher" has created a "past" "One Time" group lesson after that lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "group" lesson report page
        And "teacher" has saved draft a group lesson report
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees the previous lesson report icon is "enabled" in lesson report group "detail" page
        And "teacher" sees the previous group lesson report of lesson in lesson report group "detail" page
        And "teacher" sees student has same class with lesson in previous report in lesson report group page

    Scenario: Teacher can view the previous submitted group lesson report in editing lesson report page
        Given "teacher" has created a "past" "One Time" group lesson after that lesson
        And "teacher" has gone to detailed the newly "past" lesson info page
        And "teacher" has opened creating "group" lesson report page
        And "teacher" has fulfilled group lesson report info
        And "teacher" has submitted group lesson report
        When "teacher" opens edit group lesson report page
        Then "teacher" sees the previous lesson report icon is "enabled" in lesson report group "upsert" page
        And "teacher" sees the previous group lesson report of lesson in lesson report group "upsert" page
        And "teacher" sees student has same class with lesson in previous report in lesson report group page
