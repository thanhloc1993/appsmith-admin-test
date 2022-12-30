@cms @learner
@syllabus @question-handwriting
@Syllabus_Quiz_Mobile_Handwriting @Syllabus_Quiz_BackOffice_Handwriting

Feature: Edit handwriting answer in fill in the blank question
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with multiple handwriting answers" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
    #TCID:syl-0974
    Scenario Outline: Edit all handwriting answers by shuffle method in <LOType>
        When school admin edits the fill in the blank answers by "shuffle" handwriting settings in "<LOType>"
        Then school admin sees the fill in the blank question with matched handwriting answers
        And student is at fill in the blank question screen
        And student can open the whiteboard of answers with enabled handwriting settings
        And student cannot open the whiteboard of answers with disabled handwriting settings

        Examples:
            | LOType                             |
            | 1 of [learning objective, exam LO] |
    #TCID:syl-0975
    Scenario Outline: Edit the fill in the blank answers by disabled handwriting settings in <LOType>
        When school admin edits the fill in the blank answers by "disabled" handwriting settings in "<LOType>"
        Then school admin sees the fill in the blank question with matched handwriting answers
        And student is at fill in the blank question screen
        And student cannot open the whiteboard of answers with disabled handwriting settings

        Examples:
            | LOType                             |
            | 1 of [learning objective, exam LO] |