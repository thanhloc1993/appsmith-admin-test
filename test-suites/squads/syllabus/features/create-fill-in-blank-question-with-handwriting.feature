@cms @learner
@syllabus @question-handwriting
@Syllabus_Quiz_Mobile_Handwriting @Syllabus_Quiz_BackOffice_Handwriting

Feature: Create the fill in the blank question with handwriting
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 2 LO learning, exam" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page
        
    #TCID:syl-0973
    Scenario Outline: Create the fill in the blank question with multiple handwriting answers in <LOType>
        Given school admin goes to create question page in "<LOType>"
        When school admin creates a fill in the blank question with "multiple" handwriting answers
        Then school admin sees the fill in the blank question with matched handwriting answers
        And student is at fill in the blank question screen
        And student can open the whiteboard of answers with enabled handwriting settings
        And student cannot open the whiteboard of answers with disabled handwriting settings

        Examples:
            | LOType                             |
            | 1 of [learning objective, exam LO] |