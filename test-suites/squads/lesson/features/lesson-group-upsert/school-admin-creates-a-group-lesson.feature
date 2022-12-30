@cms @teacher @learner
@lesson
@lesson-group-upsert

Feature: School Admin can create one time group lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and class and enrolled status has logged Learner App
        And "school admin" has applied location in location settings is the same as student location
        And "school admin" has gone to lesson management page
        And "school admin" has opened creating lesson page

    Scenario Outline: School admin can create a <status> future one time group lesson with online teaching method
        When "school admin" fills date&time in the "future"
        And "school admin" selects teaching medium is "Online"
        And "school admin" selects teaching method is "Group"
        And "school admin" fills remain group lesson fields and missing "none" field
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees newly created "<status>" one time "future" group lesson on CMS
        And "teacher" can "<action>" new "future" one time group lesson on Teacher App
        And "student" can "<action>" new one time group lesson on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |
        @blocker
        Examples:
            | status    | action  |
            | Published | see     |    

    Scenario Outline: School admin can create a <status> <lessonTime> one time group lesson with <teachingMedium> teaching medium
        When "school admin" fills date&time in the "<lessonTime>"
        And "school admin" selects teaching medium is "<teachingMedium>"
        And "school admin" selects teaching method is "Group"
        And "school admin" fills remain group lesson fields and missing "<field>" field
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to "<lessonTime>" lessons list page
        And "school admin" sees newly created "<status>" one time "<lessonTime>" group lesson on CMS
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
