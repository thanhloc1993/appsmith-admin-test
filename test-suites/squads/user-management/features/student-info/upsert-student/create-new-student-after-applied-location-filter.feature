@ignore
@cms
@user @student-location
Feature: Create new student after applied location filter

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data

    Scenario Outline: Create new student after applied location filter
        Given school admin "selects" 1 location on Location Setting
        And school admin goes to student list
        When school admin creates student with "<filterCondition>"
        Then school admin "<status>" newly created student display in student list
        Examples:
            | filterCondition                               | status       |
            | location belongs to filtered location         | sees         |
            | location does not belong to filtered location | does not see |
    #13045
    Scenario: All student displays under default filter mode
        Given school admin has created a student with location info
        When school admin "does not select" all location on Location Setting
        Then school admin sees the student list is displayed correctly "without" filtered location
        And school admin sees newly created student on CMS

    #13047
    Scenario: Student without Location will not display under All Location filter mode
        Given school admin creates a new student without location info
        When school admin "selects" all location on Location Setting
        # Admin sees student list displays on Student Management page
        # Admin does not see student without location displays on Student Management page
        Then school admin sees the student list is displayed correctly "with" filtered location
        And school admin does not see newly created student in the student list

    #13048-1
    Scenario: Location filter resets to default after logout
        Given school admin has created a student with location info
        When school admin "selects" all location on Location Setting
        And school admin logout CMS
        And school admin logins CMS
        And school admin goes to student list
        Then school admin sees the selected Location in Location Setting filter popup reset as default
        And school admin sees the student list is displayed correctly "without" filtered location
        And school admin sees newly created student on CMS

    #13048-2
    Scenario: Location filter stays the same after refresh page
        Given school admin has created a student with location info
        When school admin "selects" all location on Location Setting
        And school admin reloads page
        Then school admin sees the selected Location in Location Setting filter popup does not reset
        And school admin sees the student list is displayed correctly "with" filtered location
        And school admin sees newly created student on CMS

    #13049
    Scenario: Student list refreshes after deselect Location Filter
        Given school admin has created a student with location info
        And school admin "selects" all location on Location Setting
        And school admin goes to student list
        When school admin "de-selects" all location on Location Setting
        Then school admin sees the selected Location in Location Setting filter popup reset as default
        And school admin sees the student list is displayed correctly "without" filtered location
        And school admin sees newly created student on CMS