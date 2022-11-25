@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-recording
@ignore

Feature: Teacher can stop record the virtual classroom
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can stop recording by leave lesson
        Given "teacher T1" has started to record the entire screen on Teacher App
        When "teacher T1" leaves lesson on Teacher App
        And "teacher T1" rejoins lesson on Teacher App
        Then "teacher T1, teacher T2" see record button in the main bar on Teacher App
        And "teacher T1, teacher T2" do not see REC icon in the left on Teacher App
        And "student S1" does not see REC icon in the left on Learner App

    Scenario: Teacher can stop recording by stop record button
        Given "teacher T1" has started to record the entire screen on Teacher App
        When "teacher T1" stops recording by stop button in the main bar on Teacher App
        Then "teacher T1, teacher T2" see stop recording snack bar on Teacher App
        And "teacher T1, teacher T2" see record button in the main bar on Teacher App
        And "teacher T1, teacher T2" do not see REC icon in the left on Teacher App
        And "student S1" does not see REC icon in the left on Learner App

    Scenario: Teacher can stop recording by end lesson for all
        Given "teacher T1" has started to record the entire screen on Teacher App
        When "teacher T1" ends lesson for all on Teacher App
        And "teacher T1" rejoins lesson on Teacher App
        And "teacher T2" rejoins lesson after lesson ended by another teacher on Teacher App
        And "student S1" rejoins lesson after Teacher ends lesson for all on Learner App
        Then "teacher T1, teacher T2" see record button in the main bar on Teacher App
        And "teacher T1, teacher T2" do not see REC icon in the left on Teacher App
        And "student S1" does not see REC icon in the left on Learner App

    Scenario: Another teacher can stop recording by end lesson for all
        Given "teacher T1" has started to record the entire screen on Teacher App
        When "teacher T2" ends lesson for all on Teacher App
        And "teacher T1" rejoins lesson after lesson ended by another teacher on Teacher App
        And "teacher T2" rejoins lesson on Teacher App
        And "student S1" rejoins lesson after Teacher ends lesson for all on Learner App
        Then "teacher T1, teacher T2" see record button in the main bar on Teacher App
        And "teacher T1, teacher T2" do not see REC icon in the left on Teacher App
        And "student S1" does not see REC icon in the left on Learner App

    Scenario: Teacher can stop recording by disconnect from network
        Given "teacher T1" has started to record the entire screen on Teacher App
        When "teacher T1" disconnects on Teacher App
        And "teacher T1" reconnects on Teacher App
        Then "teacher T1, teacher T2" see stop recording snack bar on Teacher App
        And "teacher T1, teacher T2" see record button in the main bar on Teacher App
        And "teacher T1, teacher T2" do not see REC icon in the left on Teacher App
        And "student S1" does not see REC icon in the left on Learner App
