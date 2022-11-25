@cms @cms2 @teacher
@lesson
@lesson-report-study-plan
@ignore

Feature: Teacher can view studyplan of future lesson of student
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" has logged Teacher App with available account
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
        And "teacher" has gone to detailed lesson info page

    Scenario: Teacher can view studyplan of student in creating lesson report page
        When "teacher" opens creating individual lesson report page
        Then "teacher" sees "View Study Plan" button is "enabled"
        And "teacher" views studyplan of student
        And "teacher" sees studyplan of student in new browser
    #new browser form: https://teacher app name.web.app/#/courseDetail?course_id=XXXXXXX/studentStudyPlan?student_id=XXXXXXX

    Scenario: Teacher can view studyplan of student in detailed submitted lesson report info page
        When "teacher" creates an individual lesson report
        Then "teacher" sees "View Study Plan" button is "enabled"
        And "teacher" views studyplan of student
        And "teacher" sees studyplan of student in new browser

    Scenario: Teacher can view studyplan of student in editing submitted lesson report info page
        When "teacher" creates an individual lesson report
        And "teacher" opens editing individual lesson report
        Then "teacher" sees "View Study Plan" button is "enabled"
        And "teacher" views studyplan of student
        And "teacher" sees studyplan of student in new browser

    Scenario: Teacher can view studyplan of student in detailed draft lesson report info page
        When "teacher" saves draft individual lesson report of "future" lesson
        Then "teacher" sees "View Study Plan" button is "enabled"
        And "teacher" views studyplan of student
        And "teacher" sees studyplan of student in new browser

    Scenario: Teacher can view studyplan of student in editing draft lesson report info page
        When "teacher" saves draft individual lesson report of "future" lesson
        And "teacher" opens editing individual lesson report
        Then "teacher" sees "View Study Plan" button is "enabled"
        And "teacher" views studyplan of student
        And "teacher" sees studyplan of student in new browser
