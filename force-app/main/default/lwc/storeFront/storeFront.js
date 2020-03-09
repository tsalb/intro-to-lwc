import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    storeFrontItems = ['Milk', 'Eggs', 'Bread', null];

    // Answer to Exercise 1 to be deprecated during Exercise 2
    handleClear(evt) {
        switch (evt.target.name) {
            case 'third_item':
                this.parentSuppliedName = '';
                break;
            default:
                console.log(evt.target.name);
                break;
        }
    }

    clearAll() {
        const children = this.template.querySelectorAll('c-item');
        for (let item of children) {
            item.clearName();
        }
    }
}
