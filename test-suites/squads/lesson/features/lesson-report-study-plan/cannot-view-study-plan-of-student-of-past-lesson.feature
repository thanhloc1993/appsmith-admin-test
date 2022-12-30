@cms @cms2
@lesson
@lesson-report-study-plan
@ignore

Feature: Teacher cannot view studyplan of past lesson of student
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page

    Scenario:Teacher cannot view study plan of past lesson of student
        Given "teacher" opens creating "individual lesson report" page
        When "teacher" views studyplan of student
        Then "teacher" sees "View Study Plan" icon is disabled
        And "teacher" sees an message that cannot fetch student's studyplan link

    Scenario: Teacher cannot view study plan of student in detailed submitted lesson report info page
        Given "teacher" has created an individual lesson report of past lesson
        When "teacher" views studyplan of student
        Then "teacher" sees "View Study Plan" icon is disabled
        And "teacher" sees an message that cannot fetch student's studyplan link

    Scenario: Teacher cannot view study plan of student in editing submitted lesson report page
        Given "teacher" has created an individual lesson report of past lesson
        And "teacher" opens editing "individual lesson report" page
        When "teacher" views studyplan of student
        Then "teacher" sees "View Study Plan" icon is disabled
        And "teacher" sees an message that cannot fetch student's studyplan link

    Scenario: Teacher cannot view study plan of student in detailed draft lesson report info page
        Given "teacher" has saved draft individual lesson report of past lesson
        When "teacher" views studyplan of student
        Then "teacher" sees "View Study Plan" icon is disabled
        And "teacher" sees an message that cannot fetch student's studyplan link

    Scenario: Teacher cannot view study plan of student in editing draft lesson report page
        Given "teacher" has saved draft individual lesson report of past lesson
        And "teacher" opens editing "individual lesson report" page
        When "teacher" views studyplan of student
        Then "teacher" sees "View Study Plan" icon is disabled
        And "teacher" sees an message that cannot fetch student's studyplan link
