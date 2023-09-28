# Component Reference


## `relatedList` 
![relatedList](/media/relatedList.png)

This LWC is used to display a related list as typically shown on a Lightning Record Page. This form is typically an abbreviated form of the `relatedListPage`, which can be used to display more records & columns on its dedicated page. Users can navigate to this full-page experience by clicking "View All" or the label of the related list.

### Variables
- **columns**: Defines the columns to be shown. Expects an array of `lightning-datatable` [column](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation) objects. 
- **is-loading**: When set to `true`, displays a loading spinner. Parent components can manipulate this variable when loading or refreshing data. Defaults to `false`. 
- **max-rows**: Controls the number of rows that the related list will display at a time. Defaults to `6`. If more data exists, the label will indicate this (ex., `Records (6+)`).
- **object-api-name**: The fully-qualified API Name of the target SObject. In the example above, the value is `Log__c`. It's recommended that you import this information from the `@salesforce/schema` [module](https://developer.salesforce.com/docs/platform/lwc/guide/apex-schema.html). This is used to obtain information about the Object, including its label and tab icon. This is also used to determine whether the Object is viewable by the current user. If the Object is not viewable, the component will be hidden.
- **records**: Defines the records to be shown. Expects an array of SObject [data records](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation) that correspond with column objects. The implementation here once again mirrors `lightning-datatable`.
- **view-all-component**: Used to dynamically render the related list page component in a new tab. Expects an object representing your component which wraps `relatedListPage`. Object properties include:
  - **componentDef**: The fully qualified name of the component, beginning with a namespace prefix (or `c` if none). Example, `c:myViewAllComponent`
  - **attributes**: An object containing all of the component's properties and their values. Ex., `{ columns: this.columns, objectApiName: this.objectApiName, myCustomVar: foo }`;
  - **tabInfo**: An object containing information about the tab to display the new component on. Properties include:
    - **iconName**: The SLDS icon to display in the tab. Ex., `standard:account`. Refer to the list of SLDS icons [here](https://www.lightningdesignsystem.com/icons/) for all possible values. 
    - **title**: The title of the tab. Ex., `Logs`.
## `relatedListPage`
![relatedListPage](/media/relatedListPage.png)

This LWC is used to render a full-page version of the related list component. This component functions in similar way to `relatedList`, but typically displays more columns and data.

### Variables
- **columns**: Defines the columns to be shown. Same specification as the _columns_ property in `relatedList`. 
- **object-api-name**: The fully-qualified API Name of the target SObject. Same specification as the _object-api-name_ property in `relatedList`. 
- **record-id**: Stores the Id of the record which hosts the `relatedList` component. This is used to allow navigation to the original record via the `Back` link.
- **records**: Defines the records to be shown. Same specification as the _records_ property in `relatedList`. 

## `lwcHost`
This Aura component hosts the `relatedListPage` component. Interactions with this component are handled entirely by the internals of the `relatedList` and `relatedListPage` components. Developers should never need to directly interact with this component. 

Use of this component may not be necessary in the future, but for now it helps us bridge a couple of gaps presented by current LWC functionality:

#### **Url Addressibility**
It's not currently possible to assign a URL to a LWC. Aura provides the `lightning:isUrlAddressible` interface to allow for this. `relatedList` components use open the `relatedListPage` component in a new tab/page (depending on the type of Lightning App used). 

#### **Dynamic Component Creation**
It's not currently possible to dynamically create components in LWC. The `relatedListPage` is dynamically generated, and obtained as serialized content passed to the `lwcHost` via a url parameter (`c__cmp`). The `lwcHost` then deserializes this content, and uses it to create a component via the Aura `$A.createComponent()` method. As of this writing, LWC does not have a feature equivalent.

#### **Workspace API**
Aura gives access to the [Workspace API](https://developer.salesforce.com/docs/component-library/bundle/lightning:workspaceAPI/documentation), which gives developers the ability to finely tune navigation. This is especially useful when building apps that can be used in a lightning console. As of this writing, LWC does not have a feature equivalent. `lwcHost` uses the Workspace API to open related lists in their own tab, and assign a proper tab icon & label. 