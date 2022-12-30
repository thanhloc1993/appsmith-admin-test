@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Create study plan

    Background:
        Given "school admin" logins CMS

    #TCID:syl-0344
    Scenario Outline: Create study plan with "<field>" field
        Given school admin has created a new course without any location
        And school admin has created a "has 1 assignment" book
        When school admin creates a master study plan with "<field>" field
        Then school admin sees message "You have added study plan successfully!"
        And school admin sees the newly created master study plan in master detail page
        And school admin has added "student S1" to course
        And school admin sees "student S1" study plan matches master study plan in individual detail page
        Examples:
            | field         |
            | full          |
            | book and name |

    #TCID:syl-0354
    Scenario: Add more student to a course which already has study plan
        Given school admin has created a new course with "student S1"
        And school admin has created a "empty" book
        When school admin creates a master study plan with "full" field
        Then school admin sees message "You have added study plan successfully!"
        And school admin sees the newly created master study plan in master detail page
        And school admin sees "student S1" study plan matches master study plan in individual detail page
        And school admin has added "student S2" to course
        And school admin sees "student S2" study plan matches master study plan in individual detail page

    #TCID:None
    Scenario: Create study plan based on a book which doesn't have any LO
        Given school admin has created a new course without any location
        And school admin has created a "has chapter and topic only" book
        When school admin creates a master study plan with "book and name" field
        Then school admin sees message "You have added study plan successfully!"
        And school admin sees the newly created master study plan in master detail page
        And school admin has added "student S1" to course
        And school admin sees "student S1" study plan matches master study plan in individual detail page

    #TCID:syl-0343
    Scenario Outline: Cannot create study plan with any missing required field
        Given school admin has created a new course without any location
        And school admin has created a "empty" book
        When school admin creates a master study plan with "<field>" field
        Then school admin cannot create master study plan with "<field>" field
        Examples:
            | field      |
            | empty book |
            | empty name |
