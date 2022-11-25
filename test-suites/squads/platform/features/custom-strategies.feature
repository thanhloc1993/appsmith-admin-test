@platform @unleash-admin @unleash-custom-strategies

Feature: Custom strategies
    Background:
        Given "unleash admin" logins Unleash Admin

    Scenario Outline: create new feature then see that feature is <status> on unleash proxy client with "<env>" and "<org>" when "<action>"
        Given Create new feature flag with "<envs>" and "<orgs>"
        When I "<action>" that feature
        Then see that feature is "<status>" on unleash proxy client with "<env>" and "<org>"

        Examples:
            | action  | env     | org | status   | envs        | orgs |
            | disable |         |     | disabled |             |      |
            | disable | staging |     | disabled | staging,uat |      |
            | enable  |         |     | disabled | staging,uat |      |
            | disable |         | a   | disabled |             | a,b  |
            | enable  |         |     | disabled |             | a,b  |
            | disable | staging |     | disabled | staging,uat | a,b  |
            | enable  | staging | b   | enabled  | staging,uat | a,b  |
            | enable  | staging |     | enabled  | staging,uat | a,b  |
            | enable  |         |     | disabled | staging,uat | a,b  |
