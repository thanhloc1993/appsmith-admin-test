@cms
@cms-syllabus-integration
@syllabus
@book @studyplan

Feature: [Integration] School admin update multiple study plan items by select bulk edit action in master study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created a "content without quiz" book
        And school admin has created a matched study plan with active and archived items

    Scenario: School admin cannot use bulk action in menu without selecting any items in master study plan
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin clicks the bulk action menu button without selecting items
        Then school admin sees all edit actions are disabled

    Scenario Outline: School admin selects <set> topics in master study plan to bulk edit
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin selects "<set>" topics in "master" study plan
        And school admin sees "<set>" topics in "master" study plan are selected
        Then school admin sees all active and archived study plan items in "<set>" topics in "master" study plan are selected

        Examples:
            | set  |
            | one  |
            | many |
            | all  |

    Scenario Outline: School admin selects many study plan items in <amount> topics in master study plan to bulk edit
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin selects 2 study plan items in <amount> topics in "master" study plan to update
        Then school admin sees only 2 study plan items in "master" study plan are selected

        Examples:
            | amount |
            | 2      |
            | 1      |
