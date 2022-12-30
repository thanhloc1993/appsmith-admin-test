@cms
@lesson
@lesson-report-previous-report
@ignore

Feature: School admin can view the previous submitted lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has created previous lesson report for this student in this course
        And "school admin" has gone to detailed lesson info page

    Scenario: School admin can view the previous lesson report of student in creating lesson report page
        When "school admin" opens creating individual lesson report page
        Then "school admin" sees "Previous Lesson Report" button is "enabled"
        And "school admin" views the previous lesson report of student
        And "school admin" sees the previous "submitted" lesson report of student

    Scenario: School admin can view the previous lesson report of student in detailed submitted lesson report info page
        When "school admin" creates an individual lesson report
        Then "school admin" sees "Previous Lesson Report" button is "enabled"
        And "school admin" views the previous lesson report of student
        And "school admin" sees the previous "submitted" lesson report of student

    Scenario: School admin can view the previous lesson report of student in editing submitted lesson report page
        When "school admin" creates an individual lesson report
        And "school admin" opens editing individual lesson report
        Then "school admin" sees "Previous Lesson Report" button is "enabled"
        And "school admin" views the previous lesson report of student in editing lesson report dialog
        And "school admin" sees the previous "submitted" lesson report of student

    Scenario: School admin can view the previous lesson report of student in detailed draft lesson report info page
        When "school admin" saves draft individual lesson report of "future" lesson
        Then "school admin" sees "Previous Lesson Report" button is "enabled"
        And "school admin" views the previous lesson report of student
        And "school admin" sees the previous "submitted" lesson report of student

    Scenario: School admin can view the previous lesson report of student in editing draft lesson report page
        When "school admin" saves draft individual lesson report of "future" lesson
        And "school admin" opens editing individual lesson report
        Then "school admin" sees "Previous Lesson Report" button is "enabled"
        And "school admin" views the previous lesson report of student in editing lesson report dialog
        And "school admin" sees the previous "submitted" lesson report of student