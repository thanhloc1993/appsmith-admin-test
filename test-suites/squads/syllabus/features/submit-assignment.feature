@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Submit assignment

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0109
    @blocker
    Scenario: Student submits the assignment
        Given teacher and student see the assignment in their apps
        When student submits the assignment
        Then the assignment is submitted on Learner App
        And teacher sees the submission on Teacher App
        And student cannot submit the assignment again on Learner App