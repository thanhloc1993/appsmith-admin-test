@cms @teacher @learner
@syllabus @book @book-common

Feature: Move chapter V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content 2 chapter without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0087
    Scenario Outline: Move chapter inside a book
        Given school admin goes to book detail page of the content book
        And school admin selects a chapter is not at "<position>"
        When school admin moves chapter "<direction>"
        Then school admin sees that chapter is moved "<direction>" on CMS
        And school admin goes to the "course" study plan in the course detail
        And school admin sees the topic of chapter moved "<direction>" in master study plan detail page
        And school admin sees the topic of chapter moved "<direction>" in individual study plan detail page
        And teacher sees the topic of chapter moved "<direction>" in student study plan detail page
        And student sees the chapter moved "<direction>" in Course detail screen on Learner App
        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |