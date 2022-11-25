@cms
@user @sibling

Feature: View sibling section after updating student info

    Background:
        Given "school admin" logins CMS

    Scenario: View sibling section after updating student info
        Given school admin has created "student S1" and "student S2" with same parent
        When school admin updates "student S2" info
        Then school admin sees "student S2" info is updated correctly
        And school admin sees "student S2" info in sibling section of "student S1" is updated correctly
        And school admin does not see any change of "student S1" info in sibling section of "student S2"