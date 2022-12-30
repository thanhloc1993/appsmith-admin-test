@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-spotlight

Feature: Teacher can spotlight user
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App

    Scenario: Teacher can spotlight themselves for students
        When "teacher T1" spotlights "teacher T1" on Teacher App
        Then "teacher T1" sees "teacher T1" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T1" sees spotlight icon in "teacher T1" stream in the gallery view on Teacher App
        And "teacher T2" sees "teacher T1" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T2" sees spotlight icon in "teacher T1" stream in the gallery view on Teacher App
        And "student S1, student S2" see "teacher T1" stream in the main screen on Learner App

    Scenario: Teacher can spotlight other teacher for students
        Given "teacher T2" has turned on their camera on Teacher App
        When "teacher T1" spotlights "teacher T2" on Teacher App
        Then "teacher T1" sees "teacher T2" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T1" sees spotlight icon in "teacher T2" stream in the gallery view on Teacher App
        And "teacher T2" sees "teacher T2" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T2" sees spotlight icon in "teacher T2" stream in the gallery view on Teacher App
        And "student S1, student S2" see "teacher T2" stream in the main screen on Learner App

    Scenario: Teacher can spotlight specific student for students
        When "teacher T1" spotlights "student S1" on Teacher App
        Then "teacher T1, teacher T2" see "student S1" stream is covered with white frame in the gallery view on Teacher App
        And "teacher T1, teacher T2" see spotlight icon in "student S1" stream in the gallery view on Teacher App
        And "student S1" sees "student S1" stream in the main screen on Learner App