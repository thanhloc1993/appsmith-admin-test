@cms
@lesson
@lesson-location-settings-cms

Feature: School admin can apply location settings in detailed past lesson page
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page

    Scenario Outline: School admin can apply location settings in detailed past lesson page
        When "school admin" opens location settings in nav bar on CMS
        And "school admin" applies "<type>" location which matches location of "past" lesson
        And "school admin" confirms to apply location settings
        Then "school admin" is redirected to "future" lessons list page
        And "school admin" sees lesson which has location is included in "past" lessons list page in selected location settings
        And "school admin" sees "<order>" location name under school admin's name
        Examples:
            | type                          | order                                                                                                                                               |
            | one child location of parent  | one child                                                                                                                                           |
            | all child locations of parent | one smallest id child location along with number of remained child                                                                                  |
            | one parent                    | one parent location and one smallest id child location along with number of remained child                                                          |
            | org                           | org and one smallest id parent location along with number of remained parent and one smallest id child location along with number of remained child |