import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const DEFAULT_MAX_ROWS = 6;
const LWC_HOST_COMPONENT_NAME = "c__lwcHost";

export default class RelatedList extends NavigationMixin(LightningElement) {
	@api maxRows = DEFAULT_MAX_ROWS; 	// * [Optional] The number of rows to display in the related list. Does not impact the "View All" page.	
	@api objectApiName;					// * [Required] The child record's SObjectType ApiName (ex., "namespace__My_Object__c")
	@api viewAllComponent;      		// * [Required] The View All Component definition. See example below:
	/**
	 *  {
	 *      componentDef: "c:myViewAllComponent",
	 *      attributes: { columns: this.columns, objectApiName: this.objectApiName, attribute1: "foo", ... },
	 * 		tabInfo: { iconName: "custom:custom100", title: "My Component" }
	 *  }
	 **/
	hasMore = false;
	iconColor;
	iconUrl;
	keyField = "Id";
	title = ""; 
	_columns;
	_isLoading;
	_records;

	@api set columns(value) {
		// * [Required] The columns to display
		// Note: Setter used to hide wrap/clip text options, not available on abbreviated list
		this._columns = value?.map((column) => {
			const hideDefaultActions = true;
			return { ...column, hideDefaultActions };
		});
	}

	get columns() {
		return this._columns || [];
	}

	@api set isLoading(value) {
		// * [Required] Used to manipulate the related list's spinner from parent components.
		// Note: Setter used to implement a short timeout on disable,
		// to make it more obvious to users when a refresh occurs
		const waitMs = (value) ? 0 : 50; 
		setTimeout(() => { this._isLoading = value }, waitMs);
	}

	get isLoading() {
		return this._isLoading || false;
	}

	@api set records(value) {
		// Use this property to store records/rows from the parent component to display in the list.
		// Note: Setter used to enforce the maxRows property.
		const numRows = value?.length || 0; 
		this.hasMore = (numRows > this.maxRows); 
		this._records = value?.slice(0, this.maxRows);
	}

	get records() {
		return this._records || [];
	}

	get hasRecords() {
		return !!this.records?.length; 
	}
	
	get header() {
		// Should display the number of records, unless it exceeds the row limit...
		// then indicate that the number exceeds the maximum display size
		// The user should click on the "View All" button in this case
		const numRows = this.records?.length || 0;
		const count = (this.hasMore && numRows > 0) ? `${numRows}+` : numRows; 
		return `${this.title} (${count})`;
	}

	@wire(getObjectInfo, { objectApiName: "$objectApiName" })
	objectInfoResponse({ data, error }) {
        this.title = data?.labelPlural || "";
        this.iconColor = data?.themeInfo?.color;
        this.iconUrl = data?.themeInfo?.iconUrl;
        if (error) {
            console.error(`c-related-list: ${JSON.stringify(error)}`);
        }
	}

	handleViewAll(event) {
		// Navigate to the supplied viewAllComponent
		const comp = this.viewAllComponent || {};
		this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: LWC_HOST_COMPONENT_NAME
            },
            state: {
                c__cmp: btoa(JSON.stringify(comp))
            }
        });
	}
}
