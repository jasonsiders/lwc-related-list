public abstract class ExampleRelatedListController {
    @AuraEnabled(cacheable=true)
    public static List<Log__c> getLogs(String recordId) {
        try {
            if (String.isBlank(recordId)) {
                throw new AuraHandledException('Missing Record Id');
            }
            return [
                SELECT 
                    Id, Body__c, Context__c, CreatedById, CreatedBy.Name, CreatedDate, 
                    Level__c, Name, RelatedRecordId__c
                FROM Log__c
                WHERE RelatedRecordId__c = :recordId
                ORDER BY Id DESC
                LIMIT 50000
            ];
        } catch (Exception error) {
            throw new AuraHandledException(error?.getMessage());
        }
    }
}