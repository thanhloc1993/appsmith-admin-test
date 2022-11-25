@cms @learner
@syllabus @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Handwriting appearance in the fill in the blank question
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"

    #TCID:syl-0976
    Scenario: Student changes the answer to handwriting mode
        Given student chooses the answer enabled handwriting
        When student taps to change to handwriting button
        Then student sees the whiteboard appear
        And student sees the whiteboard is empty
        And student sees the change to keyboard button

    #TCID:syl-0976
    Scenario: Student changes the answer to keyboard mode from handwriting mode
        Given student chooses the answer enabled handwriting
        And student taps to change to handwriting button
        When student taps to change to keyboard button
        Then student sees the whiteboard disappear
        And student sees the change to handwriting button
