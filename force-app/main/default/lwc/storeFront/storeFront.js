import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    parentSuppliedName;

    inputKeyUp(evt) {
        this.parentSuppliedName = evt.target.value.toUpperCase();
    }

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
}