@cms @learner @learner2
@syllabus @studyplan-item-bulk-edit @studyplan

Feature: Bulk edit postpone advance study plan items

    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And school admin has created a new course without any location
        And school admin has added student S1 and student S2 to the course
        And school admin has created a "content without quiz" book
        And school admin has created a matched study plan with active and archived items

    #TCID:syl-1051,syl-0877
    Scenario Outline: School admin bulk <tab> edits study plan items in one topic in master study plan
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin selects "one" topics in "master" study plan
        And school admin selects "<action>" in bulk edit menu
        And school admin updates study plan items with "<date>" and "<time>" which are available for studying
        And school admin updates study plan items with "<tab>" action
        And school admin saves the editing study plan content process
        Then school admin sees the values of the study plan items in "master" study plan changed correctly
        And school admin sees the values of "many" study plan items in individual study plan of "student S1" changed correctly
        And school admin sees the values of "many" study plan items in individual study plan of "student S2" changed correctly

        Examples:
            | action                                      | date       | time       | tab      |
            | 1 of [Edit Available From, Edit Start Date] | start date | start time | advance  |
            | 1 of [Edit Available Until, Edit Due Date]  | end date   | end time   | postpone |

    #TCID:syl-1055,syl-1003
    Scenario Outline: School admin bulk <tab> edits study plan items in one topic in individual study plan
        Given school admin is at the individual study plan details page of "student S1"
        When school admin edits the study plan content
        And school admin selects "one" topics in "individual" study plan
        And school admin selects "<action>" in bulk edit menu
        And school admin updates study plan items with "<date>" and "<time>" which are available for studying
        And school admin updates study plan items with "<tab>" action
        And school admin saves the editing study plan content process
        Then school admin sees the values of "many" study plan items in individual study plan of "student S1" changed correctly
        And school admin sees values of these study plan items in individual study plan of "student S2" unchanged

        Examples:
            | action                                      | date       | time       | tab      |
            | 1 of [Edit Available From, Edit Start Date] | start date | start time | advance  |
            | 1 of [Edit Available Until, Edit Due Date]  | end date   | end time   | postpone |