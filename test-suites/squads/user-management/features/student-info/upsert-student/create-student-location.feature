@cms @learner @learner2
@user @student-location
Feature: Create Student with Location on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data
        And school admin selects all locations on location setting

    @ignore
    Scenario: Create student without not required fields
        When school admin creates a new student without not required fields
            | not required fields |
            | phoneNumber         |
            | studentExternalId   |
            | studentNote         |
            | birthday            |
            | gender              |
            | location            |
        Then school admin sees newly created student on CMS
        And school admin sees not required fields blank
        And student logins Learner App successfully with credentials which school admin gives

    Scenario Outline: Create student with <amount> locations
        Given school admin has many locations
        When school admin wants to add a new student
        And school admin fills all fields with "<amount>" locations
        And school admin sees first "<amount>" selected locations display with "<result>" number chips
        And school admin creates student
        Then school admin sees newly created student on CMS
        And school admin sees selected locations on student detail page
        And student logins Learner App successfully with credentials which school admin gives
        Examples:
            | amount | result             |
            | <= 10  | no                 |
            | > 10   | remaining location |

    Scenario Outline: Create student with select <amount> of <locationType>
        Given school admin has many locations
        When school admin wants to add a new student
        And school admin fills all fields with "<amount>" locations of "<locationType>"
        And school admin sees parent location "<result>" and "<ChildrenLocationAmount>" children locations are selected
        And school admin sees only children location display on Selected on Select Location popup
        And school admin clicks save button on Select Location popup
        And school admin creates student
        Then school admin sees newly created student on CMS
        And school admin sees selected locations on student detail page
        And student logins Learner App successfully with credentials which school admin gives
        Examples:
            | amount | locationType      | result     | ChildrenLocationAmount |
            | 1      | children location | unselected | 1                      |
            | all    | children location | selected   | all                    |
            | 1      | parent location   | selected   | all                    |