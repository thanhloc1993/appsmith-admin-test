@cms
@cms-syllabus-integration
@syllabus
@book @studyplan

Feature: [Integration] School admin update multiple study plan items by select bulk edit action in individual study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created a "content without quiz" book
        And school admin has created a matched study plan with active and archived items

    Scenario: School admin cannot use bulk action in menu without selecting any items in individual study plan
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin clicks the bulk action menu button without selecting items
        Then school admin sees all edit actions are disabled

    Scenario Outline: School admin selects <set> topics in individual study plan
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin selects "<set>" topics in "individual" study plan
        And school admin sees "<set>" topics in "individual" study plan are selected
        Then school admin sees all active and archived study plan items in "<set>" topics in "individual" study plan are selected

        Examples:
            | set  |
            | many |
            | one  |
            | all  |

    Scenario Outline: School admin selects many study plan items in <amount> topics in individual study plan
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin selects 2 study plan items in <amount> topics in "individual" study plan to update
        Then school admin sees only 2 study plan items in "individual" study plan are selected

        Examples:
            | amount |
            | 1      |
            | 2      |
