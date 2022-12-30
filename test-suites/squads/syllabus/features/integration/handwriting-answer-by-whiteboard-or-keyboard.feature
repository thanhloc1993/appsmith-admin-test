@cms @learner
@syllabus @question @question-handwriting
@Syllabus_Quiz_Mobile_Handwriting

Feature: Answer the handwriting answer by whiteboard or keyboard
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"
        
    #TCID:syl-0985
    Scenario: Student answers the handwriting answer by both whiteboard and keyboard
        Given student chooses the answer enabled handwriting
        And student sketches the answer by "English" on the whiteboard
        And student scans the handwriting
        And student sees the answer filled
        When student enters keyboard mode
        And student types the answer by "English"
        Then student sees the answer updated
