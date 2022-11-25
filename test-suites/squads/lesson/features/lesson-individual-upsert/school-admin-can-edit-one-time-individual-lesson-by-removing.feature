@cms @teacher @teacher2 @learner @learner2
@lesson
@lesson-individual-upsert

Feature: School Admin can edit one time individual lesson by removing
    Background:
        Given "school admin" logins CMS
        And "teacher T1" login Teacher App

    Scenario Outline: School Admin can edit <status> one time individual lesson by removing teacher
        Given "school admin" has created a "<status>" individual lesson with start date&time is "completed over 24 hours"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "teacher T2" logins Teacher App
        And "school admin" has gone to detailed the newly "past" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds teacher "teacher T2" in lesson page on CMS
        And "school admin" removes teacher "teacher T1" in lesson page on CMS
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "teacher T1" in lesson detail page on CMS
        And "teacher T1" can "<action>" new "past" lesson on Teacher App
        And "teacher T2" can "<action>" new "past" lesson on Teacher App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |

    Scenario Outline: School Admin can edit <status> one time individual lesson by removing student
        Given "student S1" with course and enrolled status has logged Learner App
        And "school admin" has created a "<status>" individual lesson with start date&time is "within 10 minutes from now"
        And "school admin" has applied "all child locations of parent" location
        And "student S2" with course and enrolled status has logged Learner App
        And "school admin" has gone to detailed the newly "future" lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" removes student "student S1" in lesson page on CMS
        And "school admin" adds student "student S2" in lesson page on CMS
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" can "not see" "student S1" in student list in lesson detail page on CMS
        And "school admin" can "see" "student S2" in student list in lesson detail page on CMS
        And "teacher T1" can "<action>" the "future" lesson and "<action>" "student S2" in student list on Teacher App
        And "student S1" can "not see" new lesson on Learner App
        And "student S2" can "<action>" new lesson on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |
