@cms
@cms-syllabus-integration
@syllabus @learning-objective

Feature: [Integration] School admin moves learning objective integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content to move content learning" book
        And school admin goes to book detail page

    #TCID:syl-0042
    Scenario Outline: School admin moves a content learning <direction>
        Given school admin selects a content learning "<content learning>" is not at "<position>"
        When school admin moves "<content learning>" "<direction>"
        Then school admin sees message "You have moved item successfully"
        And school admin sees that content learning is moved "<direction>" on CMS

        Examples:
            | content learning                                                           | position | direction |
            | 1 of [learning objective, exam LO, task assignment, assignment, flashcard] | top      | up        |
            | 1 of [learning objective, exam LO, task assignment, assignment, flashcard] | bottom   | down      |
