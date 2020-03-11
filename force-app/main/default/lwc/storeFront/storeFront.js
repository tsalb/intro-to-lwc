import { LightningElement, api } from 'lwc';
import getContacts from '@salesforce/apex/StoreDataService.getContacts';

export default class StoreFront extends LightningElement {
    @api recordId;
    storeFrontItems = ['Milk', 'Eggs', 'Bread', null];

    async connectedCallback() {
        let contacts = await getContacts({accountId: this.recordId});
        console.log(contacts);
        for (let con of contacts) {
            con.Name = 'hello';
        }
    }

    handleClear(evt) {
        console.log(evt.target.name);
    }

    clearAll() {
        const children = this.template.querySelectorAll('c-item');
        for (let item of children) {
            item.clearName();
        }
    }
}
