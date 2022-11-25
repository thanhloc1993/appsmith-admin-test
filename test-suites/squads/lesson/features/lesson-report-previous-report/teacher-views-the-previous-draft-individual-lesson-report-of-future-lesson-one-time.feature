@cms @cms2 @learner
@lesson
@lesson-report-previous-report

Feature: Teacher can view the previous draft individual lesson report of future one time lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" has created a one time individual lesson in the "future"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        And "teacher" has saved draft the individual lesson report

    Scenario: Teacher can view the previous draft individual lesson report in creating lesson report page
        Given "teacher" has created a "future" "One Time" individual lesson after that lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        When "teacher" views the individual lesson report of "student" in "creating" lesson report page
        Then "teacher" sees the previous lesson report icon is "enabled" in "creating" lesson report page
        And "teacher" sees the previous draft lesson report of student in "creating" lesson report page

    Scenario: Teacher can view the previous submitted future individual recurring lesson report in detailed lesson report page
        Given "teacher" has created a "future" "Weekly Recurring" individual lesson after that lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        When "teacher" submits individual lesson report of the lesson
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees the previous lesson report icon is "enabled" in "detail" lesson report page
        And "teacher" sees the previous draft lesson report of student in "detail" lesson report page

    Scenario: Teacher can view the previous draft individual lesson report in editing lesson report page
        Given "teacher" has created a "future" "One Time" individual lesson after that lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "individual" lesson report page
        And "teacher" has fulfilled individual lesson report info
        And "teacher" has saved draft the individual lesson report
        When "teacher" opens editing "individual" lesson report page
        Then "teacher" sees the previous lesson report icon is "enabled" in "editing" lesson report page
        And "teacher" sees the previous draft lesson report of student in "editing" lesson report page
