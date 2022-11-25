@cms
@user @student-location

Feature: Edit Student info with Location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin selects all locations on location setting

    Scenario Outline: Edit student with "<amount>" location
        Given school admin has created a student with "<number>" location
        When school admin edits student location by adding "<amount>" location
        And school admin sees "<amount>" location on Location Selection popup
        And school admin saves the editing process
        Then school admin sees "<amount>" new location with "<number>" previous added locations on student detail page
        Examples:
            | number | amount   |
            | 1      | one      |
            | 1      | multiple |

    Scenario: Able to deselect newly added location
        Given school admin has created a student with "1" location
        When school admin edits student location by adding "one" location
        And school admin saves the Select Location popup
        And school admin deselects previously added location
        Then school admin sees previously added location is unselected
        And school admin does not see previously added location display on Selected part

    Scenario: Edit student general info except location
        Given school admin has created a student with "1" location
        When school admin edits student general info except location
        And school admin saves the editing process
        Then school admin sees general info display with updated information except location

    @ignore
    Scenario: Unable to remove archived location
        Given school admin has created a student with "1" location
        And school admin has archived that location
        When school admin edits student general info
        Then school admin does not see the archived location display on Select Location popup