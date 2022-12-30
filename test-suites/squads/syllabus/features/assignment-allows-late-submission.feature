@cms @teacher @learner
@syllabus @assignment
@ignore
Feature: Assignment which setting has Allow late submission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-1066
    Scenario: After Due time, student can't submit assignment
        Given assignment's due time has been changed to the past
        And teacher and student see the edited assignment in their apps
        And student has not submitted assignment yet
        When student try to submit the assignment
        Then student cannot submit the assignment

    #TCID:syl-0129
    Scenario: Edit assignment's setting to include "Allow late submission"
        Given school admin goes to an assignment detail page of the content book
        When school admin edits assignment setting to include "Allow late submission"
        Then school admin sees the edited assignment setting on CMS
        And student can submit the assignment after assignment's due time on Learner App
        And teacher does not see the edited assignment setting on Teacher App

    #TCID:syl-0131
    Scenario: Student can submit assignment which setting has "Allow late submission" after assignment's Due time
        Given school admin has edited an assignment setting to include "Allow late submission"
        And assignment's due time has been changed to the past
        And teacher and student see the edited assignment in their apps
        And student has not submitted assignment yet
        When student submits the assignment
        Then the assignment is submitted on Learner App
        And teacher sees the submission on Teacher App
        And student cannot submit the assignment again on Learner App
