@cms @cms2
@lesson
@lesson-report-previous-report
@ignore

Feature: Teacher can view the previous submitted lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has created previous lesson report for this student in this course
        And "teacher" has gone to detailed lesson info page

    Scenario: Teacher can view the previous lesson report of student in creating lesson report page
        When "teacher" opens creating individual lesson report page
        Then "teacher" sees "Previous Lesson Report" button is "enabled"
        And "teacher" views the previous lesson report of student
        And "teacher" sees the previous "submitted" lesson report of student

    Scenario: Teacher can view the previous lesson report of student in detailed submitted lesson report info page
        When "teacher" creates an individual lesson report
        Then "teacher" sees "Previous Lesson Report" button is "enabled"
        And "teacher" views the previous lesson report of student
        And "teacher" sees the previous "submitted" lesson report of student

    Scenario: Teacher can view the previous lesson report of student in editing submitted lesson report page
        When "teacher" creates an individual lesson report
        Then "teacher" opens editing individual lesson report
        And "teacher" sees "Previous Lesson Report" button is "enabled"
        And "teacher" views the previous lesson report of student in editing lesson report dialog
        And "teacher" sees the previous "submitted" lesson report of student

    Scenario: Teacher can view the previous lesson report of student in detailed draft lesson report info page
        When "teacher" saves draft individual lesson report of "future" lesson
        Then "teacher" sees "Previous Lesson Report" button is "enabled"
        And "teacher" views the previous lesson report of student
        And "teacher" sees the previous "submitted" lesson report of student

    Scenario: Teacher can view the previous lesson report of student in editing draft lesson report page
        When "teacher" saves draft individual lesson report of "future" lesson
        And "teacher" opens editing individual lesson report
        And "teacher" sees "Previous Lesson Report" button is "enabled"
        And "teacher" views the previous lesson report of student in editing lesson report dialog
        And "teacher" sees the previous "submitted" lesson report of student
