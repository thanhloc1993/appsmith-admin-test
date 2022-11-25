@cms @cms2 @teacher @learner
@lesson
@lesson-group-delete

Feature: Teacher can delete one time future group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and class and enrolled status has logged Learner App

    Scenario Outline: Teacher can delete <status_lesson> one time future lesson
        Given "teacher" has created a "<status_lesson>" one time "group" lesson in the "future"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed the newly "future" lesson info page
        And "teacher" has opened creating "group" lesson report page
        And "teacher" has fulfilled group lesson report info
        When "teacher" click button "<status_lesson_report>" on lesson group report page
        And "teacher" deletes the one time "group" lesson in the "future"
        Then "teacher" is redirected to "future" lessons list page
        And "teacher" does not see the lesson on CMS
        And "teacher" does not see the lesson on Teacher App
        And "student" does not see the lesson on Learner App
        Examples:
            | status_lesson | status_lesson_report |
            | Draft         | Submit All           |
            | Published     | Save Draft           |
