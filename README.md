# lwc-related-list
Related lists are a crucial part of the Salesforce UI, yet Salesforce doesn't allow developers to create or customize their own. `lwc-related-list` includes everything you need to make your own custom related list components. 

This framework offers many benefits, including:

- **Simplicity**: With just a few lines of code, developers can create custom related list components which closely resemble standard counterparts.

- **Flexiblity**: At their core, related lists are just a highly stylized `lightning-datatable`. Developers can provide their own `columns` and `records` to support a wide variety of use cases. 

- **Security**: Related Lists automatically check for Object-level permissions. If the target Object is not accessibile by the current user, the list will not render - just like standard components. 

![Usage](media/example.gif)

## Usage

### How to Use
Create two Lightning Web Components, which wrap the `c-related-list` and `c-related-list-page` components respectively.

```
<!-- In myRelatedList.html -->
<c-related-list
    columns={columns}
    is-loading={isLoading}
    object-api-name={myObject}
    records={data}
    view-all-component={viewAllComponent}>
</c-related-list>
```
```
<!-- In myRelatedPage.html -->
<c-related-list-page
    columns={columns}
    object-api-name={myObject}
    record-id={recordId}
    records={data}>
</c-related-list-page>
```
Since related lists are themselves essentially datatables, some implementation details will resemble the [`lightning-datatable`](https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/example) component. For example, you will need to define columns and data in the same way. 

You can learn more about the implementation of these components in the [Component Reference](docs/ComponentReference.md). 

### When to Use
You should only use this library if your use case is not supported by standard related list components available in the Lightning App Builder. Bear in mind that [recent advancements](https://help.salesforce.com/s/articleView?id=release-notes.rn_forcecom_lab_dynamic_related_lists.htm&release=238&type=5) in standard related list components help close some of the gaps left by the original version of this component group. Always prefer the standard components where possible. 

However, there are some fringe use cases that require customization. For example, this framework was inspired by the need to display related `Log__c` records. Since Salesforce does not support custom polymorphic lookup fields, the "relationship" between logs is facilitated by a text field which optionally contains the Id of a parent record: `RelatedRecordId__c`. 

### Example Usage
You can view an implementation of this framework in the `apex-logger` [repository](https://github.com/jasonsiders/apex-logger):
- [`c-log-related-list`](https://github.com/jasonsiders/apex-logger/tree/main/force-app/main/default/lwc/logRelatedList)
- [`c-log-related-page`](https://github.com/jasonsiders/apex-logger/tree/main/force-app/main/default/lwc/logRelatedPage)

## Getting Started
`lwc-related-list` is available as an unlocked package. Obtain the latest package version id (starting with `04t`) via the [Releases](https://github.com/jasonsiders/lwc-related-list/releases/latest) tab. 

Run the following command to install the package to your environment. Replace `04t...` with your desired package version Id:
```
sf package install -p 04t... -w 3
```
