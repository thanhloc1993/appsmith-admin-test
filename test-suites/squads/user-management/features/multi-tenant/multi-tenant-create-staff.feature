@cms @cms2 @teacher @teacher2
@user @user-multi-tenant @staff-info @User_Authentication_MultiTenantAuthentication

Feature: Create staff account with multi-tenant on CMS

    Background:
        Given school admin "Tenant S1" logins CMS
        And school admin "Tenant S2" logins CMS

    Scenario Outline: Create staff account
        When school admin "Tenant S1" creates a staff on "Tenant S1"
        And school admin "Tenant S2" creates a staff on "Tenant S2"
        Then school admin "Tenant S1" sees student list and staff list display correctly
        And school admin "Tenant S2" sees student list and staff list display correctly
        And school admin "<tenant>" "sees" newly created staff "<tenant>" on CMS
        And school admin "<tenant>" "does not see" newly created staff "<anotherTenant>" on CMS
        And staff "<tenant>" logins Teacher App "successfully" after forgot password with credentials of "<tenant>"
        And staff "<tenant>" logins Teacher App "failed" after forgot password with credentials of "<anotherTenant>"
        And staff "<tenant>" logins CMS "failed" with "<anotherTenant>"
        And staff "<tenant>" logins CMS "successfully" with "<tenant>"
        Examples:
            | tenant    | anotherTenant |
            | Tenant S1 | Tenant S2     |
            | Tenant S2 | Tenant S1     |
