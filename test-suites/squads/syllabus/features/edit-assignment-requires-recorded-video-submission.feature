@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Edit assignment's setting to include Require recorded video submission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "has 1 assignment" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0132
    Scenario: Edit assignment's setting to include "Require recorded video submission"
        Given school admin goes to an assignment detail page of the content book
        When school admin edits assignment setting to include "Require recorded video submission"
        Then school admin sees the edited assignment setting on CMS
        And student cannot submit the assignment without "recorded video" on Learner App
        And teacher does not see the edited assignment setting on Teacher App
