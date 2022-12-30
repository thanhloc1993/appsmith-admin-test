@cms
@syllabus @question
@cms-syllabus-integration
@Syllabus_Quiz_BackOffice_Handwriting

Feature: [Integration] Edit the fill in the blank question with handwriting integration test
    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin is at book detail page

    #TCID:syl-0974
    Scenario Outline: School admin edits all handwriting answers by shuffle method in <LOType>
        When school admin edits the fill in the blank answers by "shuffle" handwriting settings in "<LOType>"
        Then school admin sees message "You have updated question successfully"
        And school admin sees the fill in the blank question with matched handwriting answers

        Examples:
            | LOType                             |
            | 1 of [learning objective, exam LO] |
