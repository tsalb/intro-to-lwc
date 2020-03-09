import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    storeFrontItems = ['Milk', 'Eggs', 'Bread', null];

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
