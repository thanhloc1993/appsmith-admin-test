@cms
@lesson
@lesson-report-study-plan
@ignore

Feature: School admin can view studyplan of future lesson of student
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
        And "school admin" has gone to detailed lesson info page

    Scenario: School admin can view studyplan of student in creating lesson report page
        When "school admin" opens creating individual lesson report page
        Then "school admin" sees "View Study Plan" button is "enabled"
        And school admin views studyplan of student
        And school admin sees studyplan of student in course

    Scenario: School admin can view studyplan of student in detailed submitted lesson report info page
        When "school admin" creates an individual lesson report
        Then "school admin" sees "View Study Plan" button is "enabled"
        And school admin views studyplan of student
        And school admin sees studyplan of student in course

    Scenario: School admin can view studyplan of student in editing submitted lesson report info page
        When "school admin" creates an individual lesson report
        And "school admin" opens editing individual lesson report
        Then "school admin" sees "View Study Plan" button is "enabled"
        And school admin views studyplan of student
        And school admin sees studyplan of student in course

    Scenario: School admin can view studyplan of student in detailed draft lesson report info page
        When "school admin" saves draft individual lesson report of "future" lesson
        Then "school admin" sees "View Study Plan" button is "enabled"
        And school admin views studyplan of student
        And school admin sees studyplan of student in course

    Scenario: School admin can view studyplan of student in editing draft lesson report info page
        When "school admin" saves draft individual lesson report of "future" lesson
        And "school admin" opens editing individual lesson report
        Then "school admin" sees "View Study Plan" button is "enabled"
        And school admin views studyplan of student
        And school admin sees studyplan of student in course