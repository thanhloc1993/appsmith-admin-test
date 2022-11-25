@cms @teacher @learner
@syllabus @book @book-common

Feature: Create chapter

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0052
    Scenario: Student & teacher don't see newly created chapter when admin creates new chapter in the content book
        Given school admin is at book detail page
        When school admin creates a new chapter in book
        Then school admin sees the new chapter on CMS
        And student does not see the new chapter on Learner App
        And teacher does not see the new chapter on Teacher App
