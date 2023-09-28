import CONTEXT_FIELD from "@salesforce/schema/Log__c.Context__c";
import CREATED_DATE_FIELD from "@salesforce/schema/Log__c.CreatedDate";
import LEVEL_FIELD from "@salesforce/schema/Log__c.Level__c";
import LOG_NAME_FIELD from "@salesforce/schema/Log__c.Name";
import BODY_FIELD from "@salesforce/schema/Log__c.Body__c";
const URL_FIELD = "LogUrl";
const CREATED_BY_NAME_FIELD = "CreatedByName";
const CREATED_BY_URL_FIELD = "CreatedByUrl";
const COLUMNS = [
	{
		label: "Log",
		fieldName: URL_FIELD,
        includeInRelatedList: true,
		type: "url",
		typeAttributes: {
			label: { fieldName: LOG_NAME_FIELD?.fieldApiName }
		}
	},
	{
		label: "Body",
		fieldName: BODY_FIELD?.fieldApiName,
        includeInRelatedList: true
	},
	{
		label: "Level",
		fieldName: LEVEL_FIELD?.fieldApiName,
        includeInRelatedList: true
	},
    {
        label: "Context",
        fieldName: CONTEXT_FIELD?.fieldApiName
    },
    {
        label: "Created By",
        fieldName: CREATED_BY_URL_FIELD,
        type: "url",
        typeAttributes: {
            label: { fieldName: CREATED_BY_NAME_FIELD }
        }
    },
	{
		label: "Created Date",
		fieldName: CREATED_DATE_FIELD?.fieldApiName,
        includeInRelatedList: true,
		type: "date",
		typeAttributes: {
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			month: "2-digit",
			year: "2-digit"
		}
	}
];

export default function getColumns() {
    return COLUMNS;
} 