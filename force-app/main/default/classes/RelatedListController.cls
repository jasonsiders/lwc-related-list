public abstract class RelatedListController {
    @AuraEnabled(cacheable=true)
	public static Boolean hasAccess(String objectApiName) {
        return Schema.getGlobalDescribe()?.get(objectApiName)?.getDescribe()?.isAccessible() == true; 
	}
}