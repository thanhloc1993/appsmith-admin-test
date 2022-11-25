@cms @learner
@syllabus @question @question-handwriting @Syllabus_Quiz_Mobile_Handwriting

Feature: Scan handwriting to answer fill in the blank questions
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And student has gone to "1 of [learning objective, exam LO]"

    #TCID:syl-0981,syl-0982
    Scenario Outline: Student scans to answer the questions enabled handwriting by multiple languages
        Given student chooses the answer enabled handwriting by "<language>"
        When student enters handwriting mode
        And student sketches the answer by "<language>" on the whiteboard
        And student scans the handwriting
        Then student sees the whiteboard is sketched
        And student sees the answer filled

        Examples:
            | language |
            | English  |
            | Japanese |

    #TCID:syl-0983
    Scenario Outline: Student scans a sketch to answer many answers enabled handwriting
        Given student chooses the answer enabled handwriting by "<language>"
        When student enters handwriting mode
        And student sketches the answer by "<language>" on the whiteboard
        And student scans the handwriting
        And student scans to answer other question enabled handwriting
        Then student sees both answers filled

        Examples:
            | language |
            | English  |
            | Japanese |

    #TCID:syl-0978
    Scenario: Student sketches to answer a question multiple times with the whiteboard
        Given student chooses the answer enabled handwriting
        And student enters handwriting mode
        And student sketches the answer on the whiteboard
        And student scans the handwriting
        And student sees the answer filled
        When student continue sketches the answer on the whiteboard
        And student scans the handwriting
        Then student sees the answer updated

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