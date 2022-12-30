@cms @teacher @learner
@syllabus @assignment @assignment-common

Feature: Teacher text feedback

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan for student
        And school admin has checked on all assignment options

    #TCID:syl-0114
    Scenario: Teacher returns text feedbacks for submission
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        When teacher returns text feedbacks for submission
        Then teacher sees submission's text feedbacks is returned
        And student sees teacher's text feedbacks

    #TCID:syl-0115
    Scenario: Teacher updates existing submission's text feedbacks
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        And teacher returns text feedbacks for submission
        And teacher sees submission's text feedbacks is returned
        And student sees teacher's text feedbacks
        When teacher updates existing submission's text feedbacks and returns again
        Then teacher sees new submission's text feedbacks is returned
        And student sees teacher's text feedbacks is updated

    #TCID:syl-0116
    Scenario: Teacher deletes existing submission's text feedbacks
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        And teacher returns text feedbacks for submission
        And teacher sees submission's text feedbacks is returned
        And student sees teacher's text feedbacks
        When teacher deletes existing submission's text feedbacks and returns again
        Then teacher sees submission's text feedbacks is deleted
        And student doesn't see teacher's text feedbacks anymore

    #TCID:syl-0111
    Scenario: Teacher gives text feedbacks for submission
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        When teacher gives text feedbacks for submission
        Then teacher sees submission's text feedbacks is saved
        And student doesn't see teacher's text feedbacks

    #TCID:syl-0112
    Scenario: Teacher updates existing submission's text feedbacks but doesn't return it
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        And teacher returns text feedbacks for submission
        And teacher sees submission's text feedbacks is returned
        And student sees teacher's text feedbacks
        When teacher updates existing submission's text feedbacks but doesn't return it
        Then teacher sees new submission's text feedbacks is saved
        And student doesn't see teacher's text feedbacks anymore

    #TCID:syl-0113
    Scenario: Teacher deletes existing submission's text feedbacks but doesn't return it
        Given teacher and student see the assignment in their apps
        And student submits the assignment with all required fields
        And teacher sees the submission on Teacher App
        And teacher returns text feedbacks for submission
        And teacher sees submission's text feedbacks is returned
        And student sees teacher's text feedbacks
        When teacher deletes existing submission's text feedbacks but doesn't return it
        Then teacher sees submission's text feedbacks is empty
        And student doesn't see teacher's text feedbacks anymore
