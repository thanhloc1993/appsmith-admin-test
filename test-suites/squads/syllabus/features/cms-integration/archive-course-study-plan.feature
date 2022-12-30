@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Archive study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a "empty" book
        And school admin has created a new course without any location
        And school admin has added 2 students to the course

    #TCID:syl-0392,syl-0393,syl-0396
    Scenario: Can archive one study plan
        Given school admin has created 1 "active" study plan with "full" info
        When school admin archives 1 master study plans in master detail page
        Then school admin sees message "You have archived study plan successfully!"
        And school admin does not see the archived study plans in master tab
        And school admin sees the archived study plans by the filter in master tab
        And school admin does not see the archived study plans of all students in individual tab
        And school admin cannot filter individual study plan with showing archived study plan in individual tab

    #TCID:syl-0394,syl-0397
    Scenario: Can archive 1 more study plan after 1 study plan is archived
        Given school admin has created 3 "active" study plan with "full" info
        When school admin archives 2 master study plans in master detail page
        Then school admin does not see the archived study plans in master tab
        And school admin sees the archived study plans by the filter in master tab
        And school admin does not see the archived study plans of all students in individual tab
        And school admin cannot filter individual study plan with showing archived study plan in individual tab

    #TCID:syl-0396
    Scenario: Cannot archive an archived master study plan
        Given school admin has created 1 "archived" study plan with "full" info
        When school admin goes to the "master" study plan detail page
        Then school admin cannot "archive" the "archived" master study plan

    #TCID:syl-0393
    Scenario: Cannot archive an individual study plan
        Given school admin has created 1 "active" study plan with "full" info
        When school admin goes to the "individual" study plan detail page
        Then school admin cannot "archive" the individual study plan

    #TCID:syl-0963
    Scenario Outline: Cannot see the archived study plan without showing archived filter at master level
        Given school admin has created 1 "archived" study plan with "full" info
        When school admin filters study plans by "<filter>" without showing archived study plan in master tab
        Then school admin does not see the archived master study plans
        Examples:
            | filter |
            | name   |
            | grades |
            | book   |
