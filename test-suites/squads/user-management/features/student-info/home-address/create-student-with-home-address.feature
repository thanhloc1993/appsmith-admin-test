@cms @learner
@user @student-info

Feature: Create Student with Home Address on CMS

    Background:
        Given "school admin" logins CMS

    Scenario: Create student with home address
        When school admin creates a new student with home address
        Then school admin sees newly created student with home address on CMS
        And student logins Learner App successfully with credentials which school admin gives