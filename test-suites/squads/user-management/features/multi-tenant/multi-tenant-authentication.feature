@cms
@staging
@user @user-multi-tenant @User_Authentication_MultiTenantAuthentication

Feature: Multi tenant authentication on CMS
    Background:
        Given "school admin Tenant S2" has created a student with "Tenant S2"

    Scenario: Able to switch Tenant
        Given "school admin Tenant S1" logins with tenant on CMS
        When "school admin Tenant S1" switch to "school admin Tenant S2"
        Then "school admin Tenant S2" can see correctly menu tab of tenant
        And "school admin Tenant S2" can see correctly list student of "Tenant S2"

    Scenario: Able to refresh all tab and update to new Tenant
        Given "school admin Tenant S1" logins with tenant on CMS
        When "school admin Tenant S2" logins by another tab
        Then "school admin Tenant S1" can refresh
        And "school admin Tenant S2" can see correctly menu tab of tenant
        And "school admin Tenant S2" can see correctly list student of "Tenant S2"

    Scenario: Unable to login without tenant identifier
        When "school admin Tenant S1" logins without tenant identifier
        Then "school admin Tenant S1" can not login on CMS

    Scenario: Admin of this tenant cannot login another tenant
        Given "school admin Tenant S1" of "Tenant S1" have different account info with "school admin Tenant S2"
        When "school admin Tenant S1" logins with tenant identifier "Tenant S2"
        Then "school admin Tenant S1" can not login on CMS

    Scenario: Auto remember Org ID after login success
        Given "school admin Tenant S1" logins with tenant on CMS
        When "school admin Tenant S1" logout on CMS
        Then "school admin Tenant S1" can see Org ID is still in Back office

    Scenario: Org ID remembered is remove after login error
        Given "school admin Tenant S1" logins with tenant on CMS
        When "school admin Tenant S1" logout on CMS
        And "school admin Tenant S1" logins with tenant identifier "Tenant S2"
        Then "school admin Tenant S1" can not see Org ID remembered

    # TODO: implement after merge DB
    @ignore
    Scenario: A user is admin of 2 different tenants
        Given "school admin Tenant S1" of "Tenant S1" has same account info with "school admin Tenant S2"
        When "school admin Tenant S1" login with tenant identifier "Tenant S2"
        Then "school admin Tenant S1" can login on CMS
        And "school admin Tenant S1" can see correctly module of "Tenant S2"
