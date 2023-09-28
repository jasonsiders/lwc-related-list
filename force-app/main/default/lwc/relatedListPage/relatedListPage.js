import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
const DEFAULT_DISPLAY_SIZE = 50; 
const LOAD_MORE_INCREMENT = 20;
const MISSING_DATA_DETAIL = "There's nothing in your list yet. Try adding a new record."; 
const MISSING_DATA_HEADER = "Nothing to see here";
const MISSING_DATA_SRC = "/img/chatter/Desert.svg";

export default class RelatedListPage extends NavigationMixin(LightningElement) {
    @api columns = [];					// * [Required] The columns to display
	@api objectApiName; 				// * [Required] The child record's SObjectType ApiName (ex., "namespace__My_Object__c")
    @api recordId; 						// * [Required] The parent record's Id
    @api records = []; 					// * [Required] The rows to display
    displaySize = DEFAULT_DISPLAY_SIZE;
    enableInfiniteLoading = true; 
	iconColor;
	iconUrl;
    isLoading = true; 
    keyField = "Id";
	missingDataDetail = MISSING_DATA_DETAIL;
	missingDataHeader = MISSING_DATA_HEADER;
	missingDataSrc = MISSING_DATA_SRC;
    rows = [];
    table; 
	title = "";

	get hasRows() {
		return !!this.rows?.length;
	}

    get parentLabel() {
		return this.recordId ? "< Back" : "";
	}

	get showingAll() {
        // Returns true if all records are being displayed
		return this.rows?.length === this.records?.length;
	}

    get subtitle() {
		const numRows = this.rows?.length || 0;
		const count = this.showingAll ? numRows : `${this.displaySize}+`;
		return `${count} Items • Sorted by Date`;
	}

    get tableStyle() {
		return `height: ${window.innerHeight * 0.65}px`;
	}

    connectedCallback() {
        this.renderData().then(() => {
            this.toggleSpinner(this, false);
        });
    }

	@wire(getObjectInfo, { objectApiName: "$objectApiName" })
	objectInfoResponse({ data, error }) {
		if (data) {
			this.title = data?.labelPlural || "";
			this.iconColor = data?.themeInfo?.color;
			this.iconUrl = data?.themeInfo?.iconUrl;
		}
	}

    async renderData() {
		// Render the specified number of rows 
		this.rows = this.records?.slice(0, this.displaySize);
	}

    handleNavBack(event) {
		// Returns the user back to the source record
		if (this.recordId) {
			this[NavigationMixin.Navigate]({
				type: "standard__recordPage",
				attributes: {
					recordId: this.recordId,
					actionName: "view"
				}
			});
		}
	}

    handleLoadMore(event) {
		// Handle the onloadmore event from the lightning-datatable
		event?.preventDefault();
		this.table = event?.target;
		if (this.showingAll === true) {
			// No more data to load - disable
			this.enableInfiniteLoading = false;
		} else {
			// Display additional records; already loaded by the @wire method
			this.toggleSpinner(this.table, true);
			const totalRows = this.records?.length || 0; 
			const newNumRows = (this.displaySize + LOAD_MORE_INCREMENT); 
			this.displaySize = Math.min(newNumRows, totalRows);
			this.renderData().then(() => {
                this.toggleSpinner(this.table, false);
            });
		}
	}

    toggleSpinner(target, value) {
		// Sets the target's isLoading property to a specified value
		// Used to dipslay the current component's spinner,
		// or the inner lightning-datatable's spinner depending on the context 
		if (target) {
			const waitMs = (value) ? 0 : 50; 
			setTimeout(() => { target.isLoading = value }, waitMs);
		}
	}
}