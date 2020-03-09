// storeFront.js
import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    parentSuppliedName;

    inputKeyUp(evt) {
        this.parentSuppliedName = evt.target.value.toUpperCase();
    }
}