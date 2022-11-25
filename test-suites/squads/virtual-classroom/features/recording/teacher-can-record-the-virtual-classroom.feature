@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-recording

Feature: Teacher can record the virtual classroom
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can start recording and other teacher cannot  start recording
        When "teacher T1" starts record the entire screen on Teacher App
        Then "teacher T1" sees stop recording button with "enable" state in the main bar on Teacher App
        And "teacher T1, teacher T2" see REC icon in the left on Teacher App
        And "student" sees REC icon in the left side on Learner App
        And "teacher T2" sees stop recording button with "disable" state in the main bar on Teacher App
