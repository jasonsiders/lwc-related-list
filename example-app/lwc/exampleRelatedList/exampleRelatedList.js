import { LightningElement, api, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { registerRefreshContainer } from "lightning/refresh";
import getColumns from "./columns";
import getLogs from "@salesforce/apex/ExampleRelatedListController.getLogs";
import LOG_OBJECT from "@salesforce/schema/Log__c";
const VIEW_ALL_COMPONENT_NAME = "c:exampleRelatedPage";

export default class ExampleRelatedList extends LightningElement {
	@api recordId;
	allColumns = getColumns();
	cachedQueryResponse; 
	isLoading = true; 
	logs = [];
	logObject = LOG_OBJECT?.objectApiName;
	refreshContainerId;

	get relatedListColumns() {
		// Display a subset of all columns for the related list page
		// The related list page will contain the full list of columns
		const subset = this.allColumns?.filter((column) => {
			return column.includeInRelatedList === true; 
		});
		return subset;
	}

	get viewAllComponent() {
		return {
			componentDef: VIEW_ALL_COMPONENT_NAME,
			attributes: { 
				columns: this.allColumns, 
				objectApiName: this.logObject,
				recordId: this.recordId 
			},
			tabInfo: { 
				iconName: "standard:form",
				title: "Logs" 
			}
		};
	}

	connectedCallback() {
		this.refreshContainerId = registerRefreshContainer(this, this.handleRefresh);
	}

	@wire(getLogs, { recordId: "$recordId" })
	queryLogs(response) {
		this.cachedQueryResponse = response;
		if (response?.data) {
			this.mapLogs(response?.data)?.then(() => {
				this.isLoading = false;
			});
		}
	}

	async mapLogs(data) {
		this.logs = data?.map((row) => {
			const LogUrl = `/${row?.Id}`;
			return { ...row, LogUrl };
		});
	}

	handleRefresh() {
		this.isLoading = true; 
		refreshApex(this.cachedQueryResponse).then(() => {
			this.isLoading = false;
		});
	}
}
