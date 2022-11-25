@cms @teacher @teacher2 @learner @learner2
@virtual-classroom
@virtual-classroom-streaming

Feature: Teacher and student can turn on their speaker and camera
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And all teachers and students's speaker and camera are inactive

    Scenario: Student can turn on their speaker
        When "student S1" turns on their speaker on Learner App
        Then "student S1" sees "active" speaker icon on Learner App
        And "student S2" sees "inactive" speaker icon on Learner App
        And all teachers see "active" "student S1"'s speaker icon in student list on Teacher App
        And all teachers see "inactive" "student S2"'s speaker icon in student list on Teacher App

    Scenario: Teacher can turn on their speaker
        When "teacher T1" turns on their speaker on Teacher App
        Then "teacher T1" sees "active" speaker icon on Teacher App
        And "teacher T2" sees "inactive" speaker icon on Teacher App
        And "teacher T2" sees "active" "teacher T1"'s speaker icon in gallery view on Teacher App
        And all students see "active" "teacher T1"'s speaker icon in gallery view on Learner App
        And all students see "inactive" "teacher T2"'s speaker icon in gallery view on Learner App

    Scenario: Student can turn on their camera
        When "student S1" turns on their camera on Learner App
        Then "student S1" sees their image on Learner App
        And "student S1" sees "active" camera icon on Learner App
        And "student S2" sees "inactive" camera icon on Learner App
        And all teachers see "student S1"'s image in gallery view on Teacher App
        And all teachers do not see "student S2"'s image in gallery view on Teacher App
        And all teachers see "active" "student S1"'s camera icon in student list on Teacher App
        And all teachers see "inactive" "student S2"'s camera icon in student list on Teacher App

    Scenario: Teacher can turn on their camera
        When "teacher T1" turns on their camera on Teacher App
        Then "teacher T1" sees "active" camera icon on Teacher App
        And "teacher T2" sees "inactive" camera icon on Teacher App
        And all teachers see "teacher T1"'s image in gallery view on Teacher App
        And all students see "teacher T1"'s image in gallery view on Learner App
        And all students do not see "teacher T2"'s image in gallery view on Learner App