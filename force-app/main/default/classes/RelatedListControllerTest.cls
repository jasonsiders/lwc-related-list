@IsTest 
private class RelatedListControllerTest {
    @IsTest 
    static void shouldReturnTrueIfHasAccess() {
        // OOTB, System Admins have access to Accounts!
        String objectApiName = String.valueOf(Account.SObjectType);
        Boolean results = RelatedListController.hasAccess(objectApiName);
        Assert.isTrue(results, 'Admin User does not have access to ' + objectApiName);
    }

    @IsTest 
    static void shouldReturnFalseIfNoAccess() {
        User testUser = [SELECT Id FROM User WHERE Alias = :TEST_USER_ALIAS ORDER BY CreatedDate DESC LIMIT 1];
        System.runAs(testUser) {
            SObjectType inaccessibleObject = RelatedListControllerTest.getInaccessibleObject();
            String objectApiName = String.valueOf(inaccessibleObject);
            Boolean results = RelatedListController.hasAccess(objectApiName);
            Assert.isFalse(results, 'Test User has access to ' + objectApiName);
        }
    }

    // **** HELPER **** //
    static final String TEST_USER_ALIAS = 'tUser123';
    
    @TestSetup 
    static void setup() {
        Profile standardProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        String username = 'testuser' + Crypto.getRandomInteger() + '@test.com.invalid';
        User user = new User(
            Alias = TEST_USER_ALIAS,
            EmailEncodingKey = 'UTF-8',
            Email = username,
            FirstName = 'Test',
            LanguageLocaleKey = 'en_US',
            LastName = 'User',
            LocaleSidKey = 'en_US',
            TimeZoneSidKey = 'GMT',
            ProfileId = standardProfile?.Id,
            Username = username
        );
        // Can't mix DML ops - this is a workaround
        User me = new User(Id = UserInfo.getUserId());
        System.runAs(me) {
            insert user;
        }
    }
    
    static SObjectType getInaccessibleObject() {
        for (SObjectType objectType : Schema.getGlobalDescribe()?.values()) {
            if (objectType?.getDescribe()?.isAccessible() == false) {
                return objectType;
            }
        }
        return null;
    }
}