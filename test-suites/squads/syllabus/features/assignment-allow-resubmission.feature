@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Assignment which setting has Allow resubmission

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0124
    Scenario: Edit assignment's setting to include "Allow resubmission"
        Given school admin goes to an assignment detail page of the content book
        When school admin edits assignment setting to include "Allow resubmission"
        Then school admin sees the edited assignment setting on CMS
        And student can resubmit the assignment many times on Learner App
        And teacher does not see the edited assignment setting on Teacher App

    #TCID:syl-0127
    Scenario: Student submits an assignment which setting has "Allow resubmission"
        Given school admin has edited an assignment setting to include "Allow resubmission"
        And teacher and student see the edited assignment in their apps
        And student has not submitted assignment yet
        When student submits the assignment
        Then the assignment is submitted on Learner App
        And teacher sees the submission on Teacher App

    #TCID:syl-0128
    @ignore
    Scenario Outline: Student can resubmit an assignment which setting has "Allow resubmission"
        Given school admin has edited an assignment setting to include "Allow resubmission"
        And "student" has submitted the assignment to teacher
        And "teacher" has returned "<feedback>" for submission
        And "student" has seen the "<feedback>"
        When "student" resubmits the assignment
        Then the assignment is resubmitted on Learner App
        And "student" does not see the "<feedback>" on Learner App
        And "teacher" sees the resubmission on Teacher App
        Examples:
            | feedback                                                              |
            | 1 of [score, pdf, image, video without comment, video within comment] |
            | 2 of [score, pdf, image, video without comment, video within comment] |
            | 3 of [score, pdf, image, video without comment, video within comment] |
            | 4 of [score, pdf, image, video without comment, video within comment] |
            | 5 of [score, pdf, image, video without comment, video within comment] |