@cms
@lesson
@lesson-status
@ignore

Feature: School Admin can complete lesson by manually
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin can complete lesson by manually for the published <method> one time lesson
        Given "school admin" has created a "Published" "<method>" "One Time" lesson in "future" with filled Attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        When "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" is still in detailed lesson info page
        And "school admin" sees lesson's status is "Completed" in lesson detail lesson page
        Examples:
            | method     |
            | individual |
            | group      |

    Scenario Outline: School Admin can complete lesson by manually for the published <method> weekly recurring lesson
        Given "school admin" has created a "Published" "<method>" "Weekly Recurring" lesson in "future" with filled Attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 1st lesson in the chain
        When "school admin" clicks action panel in detail lesson page
        And "school admin" clicks "Complete Lesson" in action panel detail lesson page
        Then "school admin" is still in detailed lesson info page
        And "school admin" sees lesson's status is "Completed" in lesson detail lesson page
        And "school admin" sees lesson status of other lessons in the chain no changes
        Examples:
            | method     |
            | individual |
            | group      |
