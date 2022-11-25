@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Edit study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course with "student S1"
        And school admin has created a "empty" book

    #TCID:syl-0386,syl-0387,syl-0388,syl-0389
    Scenario Outline: Edit study plan with "<field>" field
        Given school admin has created 1 "active" study plan with "<info>" info
        When school admin edits a master study plan with "<field>" field
        Then school admin sees message "You have edited study plan successfully!"
        And school admin sees the newly edited master study plan in master detail page
        And school admin sees "student S1" study plan matches master study plan in individual detail page
        Examples:
            | info                                    | field                                   |
            | full                                    | name                                    |
            | full                                    | empty grades, untracked school progress |
            | empty grades, untracked school progress | grades, tracked school progress         |

    #TCID:syl-0997
    Scenario: Cannot edit study plan with any missing required field
        Given school admin has created 1 "active" study plan with "full" info
        When school admin edits a master study plan with "empty name" field
        Then school admin cannot edit master study plan with "empty name" field
