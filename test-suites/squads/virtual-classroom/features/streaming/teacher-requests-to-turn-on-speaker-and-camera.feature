@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-streaming

Feature: Teacher requests to turn on student's speaker and camera
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And all students's speaker and camera are inactive

    Scenario: Teacher can request to turn on student's speaker
        When "teacher T1" requests to turn on "student S1"'s "speaker" on Teacher App
        And "student S1" accepts teacher's request on Learner App
        Then "student S1" sees "active" speaker icon on Learner App
        And "student S2" sees "inactive" speaker icon on Learner App
        And all teachers see "active" "student S1"'s speaker icon in student list on Teacher App
        And all teachers see "inactive" "student S2"'s speaker icon in student list on Teacher App

    Scenario: Teacher can request to turn on student's camera
        When "teacher T1" requests to turn on "student S1"'s "camera" on Teacher App
        And "student S1" accepts teacher's request on Learner App
        Then "student S1" sees their image on Learner App
        And "student S1" sees "active" camera icon on Learner App
        And "student S2" sees "inactive" camera icon on Learner App
        And all teachers see "student S1"'s image in gallery view on Teacher App
        And all teachers do not see "student S2"'s image in gallery view on Teacher App
        And all teachers see "active" "student S1"'s camera icon in student list on Teacher App
        And all teachers see "inactive" "student S2"'s camera icon in student list on Teacher App

    Scenario Outline: Student can decline teacher's request to turn on their <function>
        When "teacher T1" requests to turn on "student S1"'s "<function>" on Teacher App
        And "student S1" declines teacher's request on Learner App
        Then all students see nothing change on Learner App
        And all teachers see nothing change on Teacher App
        Examples:
            | function |
            | speaker  |
            | camera   |
