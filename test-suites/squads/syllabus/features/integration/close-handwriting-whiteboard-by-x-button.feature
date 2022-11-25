@cms @learner
@syllabus @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Close handwriting whiteboard
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student

    Scenario Outline: Student close whiteboard by tap on X button
        Given student has gone to "<loType>"
        And student chooses the answer enabled handwriting
        And student taps to change to handwriting button
        When student taps on X button
        Then student sees the whiteboard disappear
        And student sees the "<button>" appear

        Examples:
            | loType               | button        |
            | [learning objective] | submit button |
            | [exam LO]            | next button   |