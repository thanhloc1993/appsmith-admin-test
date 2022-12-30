@cms @teacher @learner
@syllabus @learning-objective @learning-objective-common

Feature: Create new learning objective v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content without quiz" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan for student

    #TCID:syl-0054
    Scenario Outline: Student & teacher can't see <content learning> yet when admin creates new <content learning> in book
        Given school admin is at book detail page
        When school admin creates a new "<content learning>" in book
        Then school admin sees the new "<content learning>" on CMS
        And teacher does not see the new "<content learning>" on Teacher App
        And student does not see the new "<content learning>" on Learner App
        Examples:
            | content learning   |
            | learning objective |
            | assignment         |
            | flashcard          |

        @staging
        Examples:
            | content learning |
            | task assignment  |

    #TCID:None
    Scenario Outline: Update studyplan so that student and teacher can see the new created <content learning>
        Given a "<content learning>" is created in the content book
        When school admin modifies that "<content learning>" available for studying in study plan details page
        Then teacher sees the new "<content learning>" on Teacher App
        And student sees the new "<content learning>" on Learner App
        Examples:
            | content learning   |
            | learning objective |
            | assignment         |
            | flashcard          |

        @staging
        Examples:
            | content learning |
            | task assignment  |