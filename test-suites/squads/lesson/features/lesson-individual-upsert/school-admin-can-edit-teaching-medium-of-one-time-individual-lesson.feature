@cms @teacher @learner
@lesson
@lesson-individual-upsert

Feature: School Admin can edit teaching medium of one time individual lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App

    Scenario Outline: School admin can edit teaching medium of the <status> one time individual lesson
        Given "school admin" has create a "<status>" "<teachingMedium>" one time individual lesson in the "<lessonTime>"
        And "teacher" has applied center location in location settings on Teacher App
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed the newly "<lessonTime>" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits teaching medium to "<teachingMedium2>" in lesson detail
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated teaching medium to "<teachingMedium2>" on CMS
        And "teacher" can "<action>" the "<lessonTime>" lesson on Teacher App
        And "student" can "<action>" the "<lessonTime>" lesson on Learner App
        Examples:
            | status    | teachingMedium | teachingMedium2 | lessonTime | action  |
            | Draft     | Offline        | Online          | future     | not see |
            | Draft     | Online         | Offline         | past       | not see |
            | Published | Offline        | Online          | future     | see     |
            | Published | Online         | Offline         | past       | not see |
