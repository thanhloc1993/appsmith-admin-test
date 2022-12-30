@cms @cms2
@teacher @learner
@lesson
@lesson-individual-delete

Feature: Teacher can delete one time individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App

    Scenario Outline: Teacher can delete <status_lesson> one time past lesson with draft lesson report
        Given "teacher" has created a "<status_lesson>" one time "individual" lesson in the "past"
        And "teacher" has "<status_lesson_report>" the "past" individual lesson report
        When "teacher" deletes the lesson
        Then "teacher" is redirected to "future" lessons list page
        And "teacher" can "not see" the "past" one time individual lesson on CMS
        And "teacher" can "not see" the "past" one time individual lesson on Teacher App
        And "student" can "not see" the "past" one time individual lesson on Learner App
        Examples:
            | status_lesson | status_lesson_report |
            | Draft         | Submit All           |
            | Published     | Save Draft           |

    Scenario Outline: Teacher can cancel delete <status> one time future lesson
        Given "teacher" has created a "<status>" one time "individual" lesson in the "future"
        When "teacher" cancels deleting the "future" one time individual lesson
        Then "teacher" is still in the detailed individual lesson info page
        And "teacher" can "<action_on_cms>" the "future" one time individual lesson on CMS
        And "teacher" can "<action_on_app>" the "future" one time individual lesson on Teacher App
        And "student" can "<action_on_app>" the "future" one time individual lesson on Learner App
        Examples:
            | status    | action_on_cms | action_on_app |
            | Draft     | see           | not see       |
            | Published | see           | see           |
