@cms @teacher @learner
@syllabus @assignment
@ignore

Feature: Return submission's feedback

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And "school admin" has created a content book
        And "school admin" has created a matched studyplan for course
    # "matched studyplan" = studyplan exact match with the book content
    
    #TCID:syl-0114
    Scenario Outline: Teacher gives <feedback> to the assignment's submission and returns <feedback>
        Given "student" has submitted an assignment to teacher
        And "teacher" has given "<feedback>" for submission
        When "teacher" returns the "<feedback>"
        Then submission's "<feedback>" is returned
        And "student" sees the "<feedback>" on Learner App
        Examples:
            | feedback                                                              |
            | 1 of [score, pdf, image, video without comment, video within comment] |
            | 2 of [score, pdf, image, video without comment, video within comment] |
            | 3 of [score, pdf, image, video without comment, video within comment] |
            | 4 of [score, pdf, image, video without comment, video within comment] |
            | 5 of [score, pdf, image, video without comment, video within comment] |
    
    #TCID:syl-0115
    Scenario Outline: Teacher gives new <feedback> to the assignment's submission and returns new <feedback>
        Given the submission's feedback has been returned
        And "student" has seen feedback
        And "teacher" has given new "<feedback>" for the submission
        When "teacher" returns the new "<feedback>"
        Then submission's new "<feedback>" is returned
        And "student" sees new "<feedback>" on Learner App
        And "student" does not see previous feedback on Learner App
        Examples:
            | feedback                                                              |
            | 1 of [score, pdf, image, video without comment, video within comment] |
            | 2 of [score, pdf, image, video without comment, video within comment] |
            | 3 of [score, pdf, image, video without comment, video within comment] |
            | 4 of [score, pdf, image, video without comment, video within comment] |
            | 5 of [score, pdf, image, video without comment, video within comment] |