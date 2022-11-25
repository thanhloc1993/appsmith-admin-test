@cms
@user @student-location
@ignore
Feature: Select and Deselect Location

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Select <amount> of <locationType>
        When school admin wants to add a new student
        And school admin selects "<amount>" of "<locationType>"
        Then school admin sees parent location "<result>" and "<ChildrenLocationAmount>" children locations are selected
        And school admin sees only children location display on Selected on Select Location popup
        Examples:
            | amount | locationType      | result     | ChildrenLocationAmount |
            | 1      | children location | unselected | 1                      |
            | all    | children location | selected   | all                    |
            | 1      | parent location   | selected   | all                    |

    Scenario Outline: Select <amount> locations
        When school admin wants to add a new student
        And school admin selects "<amount>" of location
        Then school admin sees "<result>" selected locations display on Selected on Select Location popup
        Examples:
            | amount | result |
            | >= 5   | 5      |
            | 0      | 0      |

    Scenario: Select archived locations
        Given school admin has archived location
        When school admin wants to add a new student
        And school admin opens Select Location popup
        Then school admin does not see the archived location display on Select Location popup

    Scenario: Select location after change name
        Given school admin has changed location name
        When school admin wants to add a new student
        And school admin opens Select Location popup
        Then school admin see location name changed on Select Location popup

    Scenario Outline: Deselect <amount> of <locationType>
        When school admin wants to add a new student
        And school admin selects "<amount>" of "<locationType>"
        And school admin deselects "<amount>" of "<locationType>"
        Then school admin sees parent location "<result>" and "<ResultLocationAmount>" locations are selected
        And school admin sees "<ResultLocationAmount>" location display on Selected on Select Location popup
        Examples:
            | amount | locationType      | result     | ResultLocationAmount |
            | 1      | children location | unselected | 0                    |
            | all    | children location | unselected | 0                    |
            | 1      | parent location   | unselected | 0                    |

    Scenario: Able to deselect newly added location
        When school admin has created a student with "1" location
        And school admin saves the Select Location popup
        And school admin deselects previously added location
        Then school admin sees location is unselected
        And school admin sees nothing displayed on Selected part