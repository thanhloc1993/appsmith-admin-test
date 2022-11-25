@cms
@lesson
@teacher
@learner
@lesson-group-upsert
@ignore

Feature: School Admin can create one time group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has imported class for the course
        And "school admin" has added course and class to the student
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    @blocker
    Scenario Outline: School admin can create a <status> future one time group lesson with online teaching method
        When "school admin" fills date&time in the "future"
        And "school admin" selects teaching medium is "Online"
        And "school admin" selects teaching method is "Group"
        And "school admin" fills remain fields and missing "none" field
        And "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" one time group lesson on CMS
        And "teacher" "<action>" new "future" one time group lesson on Teacher App
        And "student" "<action>" new one time group lesson on Learner App
        Examples:
            | status    | action      |
            | Draft     | can not see |
            | Published | can see     |

    Scenario Outline: School admin can create a <status> <lessonTime> one time group lesson with <teachingMedium> teaching medium
        When "school admin" fills date&time in the "<lessonTime>"
        And "school admin" selects teaching medium is "<teachingMedium>"
        And "school admin" selects teaching method is "Group"
        And "school admin" fills remain fields and missing "<field>" field
        And "school admin" clicks "<status>" the lesson of lesson management
        Then "school admin" is redirected to "<lessonTime>" lessons list page
        And "school admin" sees newly created "<status>" one time group lesson on CMS
        And "teacher" can "<action>" new "<lessonTime>" one time group lesson on Teacher App
        And "student" can "<action>" new one time group lesson on Learner App
        Examples:
            | status    | lessonTime | teachingMedium | field | action  |
            | Draft     | past       | Online         | class | not see |
            | Draft     | future     | Offline        | none  | not see |
            | Draft     | past       | Offline        | class | not see |
            | Published | past       | Online         | class | see     |
            | Published | future     | Offline        | none  | not see |
            | Published | past       | Offline        | class | not see |
