@cms @cms2 @teacher
@user @staff-permission

Feature: Staff permission validation
    Background:
        Given "school admin" logins CMS
        And school admin has created a user group with role
            | role         | location               |
            | School Admin | all                    |
            | Teacher      | location A, location B |
            | Both roles   | all                    |

    Scenario: Staff with Teacher role
        When school admin create staff with user group "Teacher"
        Then school admin sees newly created staff on CMS
        And staff logins Teacher App successfully after forgot password
        And staff logins CMS successfully after forgot password for "Teacher"
        And staff sees screens related with user group "Teacher"

    Scenario Outline: Staff with user group has "<Granted role>"
        When school admin create staff with user group "<Granted role>"
        Then school admin sees newly created staff on CMS
        And staff logins CMS successfully after forgot password for "<Granted role>"
        Examples:
            | Granted role |
            | School Admin |
            | Both roles   |

    Scenario Outline: Staff "<options>"
        When school admin create staff "<options>"
        Then school admin sees newly created staff on CMS
        And staff "can not" login to Teacher App after forgot password
        And staff "can not" login to CMS "<options>" after forgot password
        Examples:
            | options                     |
            | without user group          |
            | with user group has no role |

    Scenario: Change Staff from Teacher role to Admin role
        Given school admin has created staff with user group "Teacher"
        And staff can see screens related with user group "Teacher"
        When school admin change role of this user group from "Teacher" to "School Admin"
        Then staff got kicked out of Teacher App
        And staff sees screens related with user group "School Admin"

    Scenario: Change Staff from Admin role to Teacher role
        Given school admin has created staff with user group "School Admin"
        And staff can see screens related with user group "School Admin"
        When school admin change role of this user group from "School Admin" to "Teacher"
        Then staff sees screens related with user group "Teacher"

    Scenario: Delete all granted roles from user group
        Given school admin has created staff with user group "Both roles"
        And staff can see screens related with user group "School Admin"
        When school admin delete all role of this user group
        Then staff got kicked out of Teacher App
        And staff can not logins Teacher App
        And staff got kicked out of CMS
        And staff can not logins CMS
