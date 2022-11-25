@cms
@user @student-info

Feature: Fail to Create Student on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Able to cancel create student
        When school admin creates a new student with draft information
        And school admin cancels the creating student using "<button>"
        Then school admin sees create student full-screen dialog closed
        Examples:
            | button |
            | close  |
            | cancel |
            | escape |

    Scenario Outline: Can not create a student without required fields
        When school admin creates a student with missing "<requiredField>"
        Then school admin sees required error message
        Examples:
            | requiredField     |
            | firstName         |
            | lastName          |
            | email             |
            | grade             |
            | enrollment status |

    Scenario: Can not create a student account with existing unique field
        Given school admin has created a student with student info
        When school admin creates a new student with existing unique email
        Then school admin sees email exists error message
        And school admin can not create a new student with existing unique email
