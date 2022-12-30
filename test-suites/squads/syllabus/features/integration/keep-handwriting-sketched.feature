@cms @learner
@syllabus @question @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Keeping whiteboard sketched
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"

    #TCID:syl-0984
    Scenario: Student see the whiteboard sketches is not reset
        Given student chooses the answer enabled handwriting
        And student sketches the answer by "Meaningless" on the whiteboard
        When student chooses the answer not enabled handwriting
        And student chooses the previous answer
        Then student sees the whiteboard is not reset
