@cms @teacher @learner
@syllabus @learning-objective @learning-objective-common

Feature: Move learning objective for SP V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book on CMS
        And school admin has created a matched studyplan for student

    #TCID:syl-0090
    Scenario Outline: Move a content learning in a topic
        Given school admin goes to book detail page of the content book
        And school admin selects a content learning "<content learning>" is not at "<position>"
        When school admin moves "<content learning>" "<direction>"
        Then school admin sees that content learning is moved "<direction>" on CMS
        And school admin goes to the "course" study plan in the course detail
        And "<content learning>" is moved "<direction>" in the master study plan detail
        And "<content learning>" is moved "<direction>" in the student study plan detail
        And student sees the "<content learning>" moved "<direction>" in Topic detail screen on Learner App
        And teacher sees the "<content learning>" moved "<direction>" in studyplan on Teacher App
        Examples:
            | content learning                                | position | direction |
            | 1 of [learning objective, assignment,flashcard] | top      | up        |
            | 1 of [learning objective, assignment,flashcard] | bottom   | down      |
