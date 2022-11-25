@cms @learner
@syllabus @question @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Erasing whiteboard sketched
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"
        
    #TCID:syl-0979
    Scenario: Student erases the whiteboard
        Given student answers all answers in question
        And student chooses the answer enabled handwriting
        And student enters handwriting mode
        And student sketches the answer on the whiteboard
        And student scans the handwriting
        When student erases the whiteboard
        Then student sees the answer has been reset
        And student sees the other answers unchanged
        And student sees the whiteboard has been reset
