@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Assignment which setting has Require text note submission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0117
    Scenario: Edit assignment's setting to include "Require text note submission"
        Given school admin goes to an assignment detail page of the content book
        When school admin edits assignment setting to include "Require text note submission"
        Then school admin sees the edited assignment setting on CMS
        And student cannot submit the assignment without "text note" on Learner App
        And teacher does not see the edited assignment setting on Teacher App

    #TCID:syl-0119
    Scenario: Student must submit the assignment within text note
        Given school admin has edited an assignment setting to include "Require text note submission"
        And teacher and student see the edited assignment in their apps
        When student submits the assignment with "text note"
        Then the assignment is submitted on Learner App
        And teacher sees the submission with "text note" on Teacher App
        And student cannot submit the assignment again on Learner App
#Note: Student can't submit assignment if he doesn't add text note to submission => please cover in integration test