@cms
@syllabus @grade-book @grade-book-view
@staging

Feature: School admin filters grade book in CMS
    Background:
        Given "school admin" logins CMS
        And school admin has created student with enrolled status
        And school admin has created a "content with 4 grade to pass LO exams and each has 3 questions" book
        And school admin has created a matched studyplan for student
        And school admin is at grade book page

    Scenario Outline: School admin filters grade book list
        When school admin filters with "<type>" of student in grade book
        Then school admin sees data matches with the above filters

        Examples:
            | type                                     |
            | 1 of [grade and course, grade or course] |
