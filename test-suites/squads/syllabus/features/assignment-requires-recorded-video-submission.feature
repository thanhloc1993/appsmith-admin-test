@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Assignment which setting has Require recorded video submission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0132
    Scenario: Edit assignment's setting to include "Require recorded video submission"
        Given school admin goes to an assignment detail page of the content book
        When school admin edits assignment setting to include "Require recorded video submission"
        Then school admin sees the edited assignment setting on CMS
        And student cannot submit the assignment without "recorded video" on Learner App
        And teacher does not see the edited assignment setting on Teacher App

    #TCID:syl-0135
    @blocker
    Scenario: Student must submit the assignment within recorded video
        Given school admin has edited an assignment setting to include "Require recorded video submission"
        And teacher and student see the edited assignment in their apps
        When student submits the assignment with "recorded video"
        Then the assignment is submitted on Learner App
        And teacher sees the submission with "recorded video" on Teacher App
        And teacher plays the "recorded video" on Teacher App
        And student cannot submit the assignment again on Learner App