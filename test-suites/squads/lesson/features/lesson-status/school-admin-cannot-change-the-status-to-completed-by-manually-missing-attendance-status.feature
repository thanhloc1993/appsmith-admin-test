@cms
@lesson
@lesson-status
@ignore

Feature: School Admin cannot change the status to Completed by manually if missing Attendance status
    Background:
        Given "school admin" logins CMS

    Scenario: School Admin can not change the status to completed one time group lesson missing Attendance status
        Given "school admin" has created a "Published" "group" "One Time" lesson in "future" without attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "group" lesson report page
        And "school admin" has fulfilled group lesson report info
        When "school admin" submits "group" lesson report
        And "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" sees warning message popup Attendance status
        And "school admin" sees lesson's status still is "Published" in lesson detail lesson page when closing popup

    Scenario: School Admin can not change the status to completed weekly recurring individual lesson missing Attendance status
        Given "school admin" has created a "Published" "individual" "Weekly Recurring" lesson in "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 1st lesson in the chain
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has fulfilled individual lesson report info missing student Attendance status
        And "school admin" has clicked button "Save Draft" on individual lesson report page
        When "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" sees warning message popup Attendance status
        And "school admin" sees lesson's status still is "Published" in lesson detail lesson page when closing popup
        And "school admin" sees lesson status of other lessons in the chain no changes

    Scenario: School Admin can not change the status to completed weekly recurring group lesson missing Attendance status
        Given "school admin" has created a "Published" "group" "Weekly Recurring" lesson in "future" without Attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        When "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" sees warning message popup Attendance status
        And "school admin" sees lesson's status still is "Published" in lesson detail lesson page when closing popup
        And "school admin" sees lesson status of other lessons in the chain no changes

    Scenario: School Admin can not change the status to completed one time individual lesson missing Attendance status
        Given "school admin" has created a "Published" "individual" "One Time" lesson in "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has remove all Attendance status in lesson report page
        And "school admin" has clicked save with "Save Draft" the lesson report page
        When "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" sees warning message popup Attendance status
        And "school admin" sees lesson's status still is "Published" in lesson detail lesson page when closing popup
