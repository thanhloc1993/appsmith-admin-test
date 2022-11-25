@cms @teacher @jprep
@user @sync-data @ignore
Feature: Able login teacher & school admin account after sync

    Scenario: Login teacher account after sync data
        When system syncs teacher from partner
        Then teacher can login Teacher App with teacher partner account

    Scenario: Edit teacher name by sync data
        Given system has synced teacher from partner
        When system syncs teacher with edited teacher name
        Then teacher sees edited teacher name on Teacher App
    # E2E tracking: if has chat function/live lesson, student -> see edited teacher name

    Scenario: Delete teacher account by sync data
        Given system has synced teacher from partner
        When system syncs teacher with deleted teacher
        Then teacher can not login Teacher App with teacher partner account

    Scenario: Login school admin account
        When staff creates school admin account for partner manually
        Then school admin logins CMS successfully with school admin partner account