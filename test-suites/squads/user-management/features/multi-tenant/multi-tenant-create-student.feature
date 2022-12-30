@cms @cms2 @learner @learner2 @parent @parent2
@user @user-multi-tenant @User_Authentication_MultiTenantAuthentication

Feature: Create Student with multi-tenant on CMS

    Background:
        Given school admin "Tenant S1" logins CMS
        And school admin "Tenant S2" logins CMS

    Scenario Outline: Create student with new parent
        Given school admin "Tenant S1" creates a new student and parent info on "Tenant S1"
        And school admin "Tenant S2" creates a new student and parent info on "Tenant S2"
        Then school admin "Tenant S1" sees student list and staff list display correctly
        And school admin "Tenant S2" sees student list and staff list display correctly
        And school admin "<tenant>" "sees" newly created student "<tenant>" and parent on CMS
        And school admin "<tenant>" "does not see" newly created student "<anotherTenant>" and parent on CMS
        And "student" "<tenant>" logins Learner App "failed" with credentials of "<anotherTenant>" which school admin gives
        And "student" "<tenant>" logins Learner App "successfully" with credentials of "<tenant>" which school admin gives
        And "parent" "<tenant>" logins Learner App "failed" with credentials of "<anotherTenant>" which school admin gives
        And "parent" "<tenant>" logins Learner App "successfully" with credentials of "<tenant>" which school admin gives
        And parent "<tenant>" "sees" student's "<tenant>" stats on Learner App
        And parent "<tenant>" "does not see" student's "<anotherTenant>" stats on Learner App
        Examples:
            | tenant    | anotherTenant |
            | Tenant S1 | Tenant S2     |
            | Tenant S2 | Tenant S1     |