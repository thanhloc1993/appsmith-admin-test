@cms @teacher @learner
@syllabus @book @book-common

Feature: Create topic

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # 1 chapter 1 topic 1 assignment 1 lo and without quiz
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0053
    Scenario: Student & teacher don't see newly created topic when admin creates new topic in the content book
        Given school admin is at book detail page
        When school admin creates a new topic in an exist chapter
        Then school admin sees the new topic on CMS
        And student does not see the new topic on Learner App
        And teacher does not see the new topic on Teacher App
