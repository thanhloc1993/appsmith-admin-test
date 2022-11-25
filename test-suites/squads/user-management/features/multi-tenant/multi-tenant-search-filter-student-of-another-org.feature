@cms @cms2
@user @user-multi-tenant @User_Authentication_MultiTenantAuthentication

Feature: Search/Filter from One to Another ORG
    Background:
        Given school admin "Tenant S1" logins CMS
        And school admin "Tenant S1" creates a new student and parent info on "Tenant S1"
        And school admin "Tenant S2" logins CMS
        And school admin "Tenant S2" creates a new student and parent info on "Tenant S2"

    Scenario: Search for student of another ORG
        When school admin "Tenant S1" searches for name of student "Tenant S2"
        And school admin "Tenant S2" searches for name of student "Tenant S1"
        Then no result page is displayed on "Tenant S1" CMS
        And no result page is displayed on "Tenant S2" CMS
