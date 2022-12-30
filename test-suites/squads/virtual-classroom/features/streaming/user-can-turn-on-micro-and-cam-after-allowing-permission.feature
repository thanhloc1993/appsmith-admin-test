@cms @teacher @learner
@virtual-classroom
@virtual-classroom-streaming

Feature: User can turn on micro and cam after allowing theirs permission
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" have joined lesson on Learner App

    Scenario: Teacher can turn on micro and cam after allowing theirs permission
        Given "teacher" has declined permission for microphone and cam on Teacher App
        When "teacher" allows permission for microphone and cam on Teacher App
        And "teacher" reloads the page from virtual classroom on Teacher App
        And "teacher" rejoins lesson on Teacher App
        And "teacher" turns on speaker and camera on Teacher App
        Then "teacher" "can not see" guiding turn on microphone and cam alert dialog on Teacher App
        And "teacher" sees their camera and microphone are "active" on Teacher App
        And "student" sees "teacher"'s micro and camera are "active" on Learner App

    Scenario: Learner can turn on micro and cam after allowing theirs permission
        Given "student" has declined permission for microphone and cam on Learner App
        When "student" allows permission for microphone and cam on Learner App
        And "student" reloads the page from virtual classroom on Learner App
        And "student" rejoins lesson after reload the page on Learner App
        And "student" turns on speaker and camera on Learner App
        Then "student" "can not see" guiding turn on microphone and cam alert dialog on Learner App
        And "student" sees their camera and microphone are "active" on Learner App
        And "teacher" sees "student"'s micro and camera are "active" on Teacher App