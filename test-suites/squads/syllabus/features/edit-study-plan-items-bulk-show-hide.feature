@cms @learner @learner2
@syllabus @studyplan-item-bulk-edit @studyplan

Feature: Bulk edit show/hide study plan items
    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a new course without any location
        And school admin has added student S1 and student S2 to the course
        And school admin has created a "content without quiz" book

    #TCID:syl-0899,syl-0900,syl-0901,syl-0902
    Scenario Outline: School admin bulk <action> study plan items with <type> status in master study plan
        Given school admin has created a matched study plan with "<type>"
        And school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin selects "<topic selection>" topics in "master" study plan table
        And school admin selects "<action>" in bulk action menu
        And school admin sees visibility icon is changed to "<status>"
        And school admin saves the editing study plan content process
        Then school admin sees selected study plan items in "master" study plan are "<status>"
        And school admin sees the status of study plan items in individual study plan of "student S1" changed to "<status>"
        And school admin sees the status of study plan items in individual study plan of "student S2" changed to "<status>"

        Examples:
            | topic selection  | type     | action   | status   |
            | 1 of [one, many] | active   | Hide All | archived |
            | 1 of [one, many] | archived | Show All | active   |
            | 1 of [one, many] | mixed    | Show All | active   |

    #TCID:syl-1069,syl-1070,syl-1071,syl-1072,syl-1073,syl-1074,syl-1075,syl-1076
    Scenario Outline: School admin bulk <action> study plan items with <type> status in individual study plan
        Given school admin has created a matched study plan with "<type>"
        And school admin is at the individual study plan details page of "student S1"
        When school admin edits the study plan content
        And school admin selects "<topic selection>" topics in "individual" study plan table
        And school admin selects "<action>" in bulk action menu
        And school admin sees visibility icon is changed to "<status>"
        And school admin saves the editing study plan content process
        Then school admin sees the status of study plan items in individual study plan of "student S1" changed to "<status>"
        And school admin sees the status of study plan items in individual study plan of "student S2" unchanged

        Examples:
            | topic selection  | type     | action   | status   |
            | 1 of [one, many] | active   | Hide All | archived |
            | 1 of [one, many] | archived | Show All | active   |
            | 1 of [one, many] | mixed    | Show All | active   |
