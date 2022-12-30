@cms @teacher @learner
@syllabus @learning-objective @learning-objective-common

Feature: Delete learning objective v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:syl-0081
    Scenario Outline: Delete the <content learning> in the book
        Given school admin is at book detail page
        When school admin deletes the "<content learning>"
        Then school admin does not see the "<content learning>" at book detail page on CMS
        And student does not see the "<content learning>" on Learner App
        And teacher does not see the "<content learning>" on Teacher App
        Examples:
            | content learning   |
            | flashcard          |
            | assignment         |
            | learning objective |

        @staging
        Examples:
            | content learning |
            | task assignment  |
