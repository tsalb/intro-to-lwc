import { LightningElement, api } from 'lwc';

export default class Item extends LightningElement {
    @api itemName = 'New Item';

    clearName() {
        this.dispatchEvent(new CustomEvent('clear'));
        this.itemName = '';
    }
}
