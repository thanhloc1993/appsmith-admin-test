@cms @teacher @learner
@syllabus @book @book-common

Feature: Rename chapter

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "content without quiz" book
        And school admin has created a matched studyplan for student
    
    #TCID:syl-0064
    Scenario: Student can see the edited chapter name when admin renames a chapter in the content book
        Given school admin is at book detail page
        When school admin edits chapter name
        Then school admin sees the edited chapter name on CMS
        And student sees the edited chapter name on Learner App
        And teacher does not see the edited chapter name on Teacher App
