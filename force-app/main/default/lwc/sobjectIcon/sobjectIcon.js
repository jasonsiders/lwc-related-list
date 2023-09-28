import { LightningElement, api } from 'lwc';
const Sizes = { SMALL: "small", MEDIUM: "medium", LARGE: "large" };
const DEFAULT_SIZE = Sizes.SMALL; 

export default class SObjectIcon extends LightningElement {
    @api color; 
    @api size; 
    @api url; 

    get backgroundStyle() {
        let color = "background-color: " + (this.color ? ("#" + this.color) : "") + ";";
        return color;
    }

    get containerClasses() {
        const avatarSize = Object.values(Sizes).includes(this.size) ? this.size : DEFAULT_SIZE;
        return `slds-avatar slds-avatar_${avatarSize} slds-media__figure slds-listbox__option-icon slds-m-top_none slds-m-right_none`;
    }
}