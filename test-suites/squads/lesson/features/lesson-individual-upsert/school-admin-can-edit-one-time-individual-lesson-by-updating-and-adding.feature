@cms @teacher @teacher2 @learner2
@lesson
@lesson-individual-upsert

Feature: School Admin can edit one time individual lesson by updating and adding
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin can update date&time of a <status> one time individual lesson
        Given "school admin" has created a "<status>" one time individual lesson in the "<lessonTime>"
        And "school admin" has applied "all child locations of parent" location
        And "teacher" logins Teacher App
        And "teacher" has applied center location in location settings on Teacher App
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits lesson date and start&end time to the "<lessonTime2>"
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson date&time on CMS
        And "school admin" sees this lesson in the "<lessonTime2>" lesson list page
        And "teacher" can "<action>" the "<lessonTime2>" lesson on Teacher App
        Examples:
            | status    | lessonTime | lessonTime2 | action  |
            | Draft     | future     | past        | not see |
            | Published | past       | future      | see     |

    Scenario Outline: School admin can add teacher and student to the <status> future one time individual lesson
        Given "school admin" has created a "<status>" individual lesson with start date&time is "within 10 minutes from now"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "teacher T2" logins Teacher App
        And "teacher T2" has applied center location in location settings on Teacher App
        And "student S2" with course and enrolled status has logged Learner App
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" adds "teacher T2, student S2" to this lesson
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "teacher T2, student S2" in detail lesson page
        And "teacher T2" can "<action>" the "future" lesson on Teacher App
        And "student S2" can "<action>" the "future" lesson on Learner App
        Examples:
            | status    | action  |
            | Draft     | not see |
            | Published | see     |

    Scenario Outline: School admin can update location of a <status> future one time individual lesson
        Given "school admin" has created a "<status>" individual lesson with start date&time is "within 10 minutes from now"
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page
        When "school admin" edits location of the lesson
        And "school admin" updates location of student
        And "school admin" click save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated location and student in lesson detail
        Examples:
            | status    |
            | Draft     |
            | Published |
