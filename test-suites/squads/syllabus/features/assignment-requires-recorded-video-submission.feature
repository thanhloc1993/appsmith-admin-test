@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Assignment which setting has Require recorded video submission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "has 1 assignment require recorded video submission" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0135
    @blocker
    Scenario: Student must submit the assignment within recorded video
        And teacher and student see the assignment in their apps
        When student submits the assignment with "recorded video"
        Then the assignment is submitted on Learner App
        And teacher sees the submission with "recorded video" on Teacher App
        And teacher plays the "recorded video" on Teacher App
        And student cannot submit the assignment again on Learner App
