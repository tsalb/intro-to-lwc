public class StoreDataService {
    @AuraEnabled
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email FROM Contact WHERE AccountId =: accountId];
    }
}
