@cms
@syllabus @question
@cms-syllabus-integration
@Syllabus_Quiz_BackOffice_Handwriting

Feature: [Integration] Create the fill in the blank question with handwriting integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 2 LO learning, exam" book
        And school admin goes to book detail page

    #TCID:syl-0972,syl-0973
    Scenario Outline: School admin creates the fill in the blank question with multiple handwriting answers in <LOType>
        Given school admin goes to create question page in "<LOType>"
        When school admin creates a fill in the blank question with "multiple" handwriting answers
        Then school admin sees message "You have created a new question successfully"
        And school admin sees the fill in the blank question with matched handwriting answers

        Examples:
            | LOType                             |
            | 1 of [learning objective, exam LO] |
