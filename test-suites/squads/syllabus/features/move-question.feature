@cms @teacher @learner
@syllabus @book @book-common
@ignore

Feature: Move question

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book on CMS
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    Scenario Outline: Move question in LO
        Given school admin goes to a LO detail page of the content book
        And the question is not at "<position>"
        When school admin moves question "<direction>"
        Then question is moved "<direction>" on CMS
        And student sees the question display "<order>" in quiz on Learner App
        And teacher sees the question display "<order>" in quiz on Learner App
        Examples:
            | position | direction | order  |
            | top      | up        | sooner |
            | bottom   | down      | later  |

    Scenario Outline: Move question in flashcard
        Given school admin goes to a flashcard detail page of the content book
        And the question is not at "<position>"
        When school admin moves question "<direction>"
        Then question is moved "<direction>" on CMS
        And student sees the question display "<order>" in quiz on Learner App
        And teacher sees the question display "<order>" in quiz on Learner App
        Examples:
            | position | direction | order  |
            | top      | up        | sooner |
            | bottom   | down      | later  |