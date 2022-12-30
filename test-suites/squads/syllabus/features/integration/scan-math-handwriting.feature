@cms @learner
@syllabus @question @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Scan math handwriting to answer fill in the blank questions
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "has multiple handwriting answers in LO, Exam LO" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"

    Scenario: Student sketches math to answer a question with the whiteboard
        Given student chooses the answer enabled handwriting by "Math"
        When student sketches the answer by "Math" on the whiteboard
        And student scans the handwriting
        Then student sees the answer filled

    Scenario: Student scans a math sketch to answer many answers enabled handwriting
        Given student chooses the answer enabled handwriting by "Math"
        When student sketches the answer by "Math" on the whiteboard
        And student scans the handwriting
        And student scans to answer other question enabled handwriting
        Then student sees both answers filled