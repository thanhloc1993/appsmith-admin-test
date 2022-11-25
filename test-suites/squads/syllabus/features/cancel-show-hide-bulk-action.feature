@cms @learner @learner2
@syllabus @studyplan-item-bulk-edit @studyplan
@ignore

Feature: Cancel Show/Hide bulk action study plan items
    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a new course without any location
        And school admin has added student S1 and student S2 to the course
        And school admin has created a "content without quiz" book

    #TCID:syl-0875
    Scenario Outline: School admin cancels bulk <action> study plan items with <type> status in master study plan
        Given school admin has created a matched study plan with "<type>"
        And school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin selects "<topic selection>" topics in "master" study plan table
        And school admin selects "<action>" in bulk action menu
        And school admin sees visibility icon is changed to "<status>"
        And school admin cancels the editing study plan content process
        Then school admin sees selected study plan items in "master" study plan unchanged
        And school admin sees the status of study plan items in individual study plan of "student S1" unchanged
        And school admin sees the status of study plan items in individual study plan of "student S2" unchanged

        Examples:
            | topic selection  | type     | action   | status   |
            | 1 of [one, many] | active   | Hide All | archived |
            | 1 of [one, many] | archived | Show All | active   |
            | 1 of [one, many] | mixed    | Show All | active   |

    #TCID:syl-0875
    Scenario Outline: School admin cancels bulk <action> study plan items with <type> status in individual study plan
        Given school admin has created a matched study plan with "<type>"
        And school admin is at the individual study plan details page of "student S1"
        When school admin edits the study plan content
        And school admin selects "<topic selection>" topics in "individual" study plan table
        And school admin selects "<action>" in bulk action menu
        And school admin sees visibility icon is changed to "<status>"
        And school admin cancels the editing study plan content process
        Then school admin sees the status of study plan items in individual study plan of "student S1" unchanged
        And school admin sees the status of study plan items in individual study plan of "student S2" unchanged

        Examples:
            | topic selection  | type     | action   | status   |
            | 1 of [one, many] | active   | Hide All | archived |
            | 1 of [one, many] | archived | Show All | active   |
            | 1 of [one, many] | mixed    | Show All | active   |