# Component Reference


## `relatedList` 
TODO!

## `relatedListPage`
TODO

## `lwcHost`
This is an Aura component which is used to host the `relatedListPage` component. Interactions with this component are handled entirely by the internals of the `relatedList` and `relatedListPage` components. Developers should never need to directly interact with this component. 

Use of this component may not be necessary in the future, but for now it helps us bridge a couple of gaps presented by current LWC functionality:

#### **Url Addressibility**
It's not currently possible to assign a URL to a LWC. Aura provides the `lightning:isUrlAddressible` interface to allow for this. `relatedList` components use open the `relatedListPage` component in a new tab/page (depending on the type of Lightning App used). 

#### **Dynamic Component Creation**
It's not currently possible to dynamically create components in LWC. The `relatedListPage` is dynamically generated, and obtained as serialized content passed to the `lwcHost` via a url parameter (`c__cmp`). The `lwcHost` then deserializes this content, and uses it to create a component via the Aura `$A.createComponent()` method. As of this writing, LWC does not have a feature equivalent.

#### **Workspace API**
Aura gives access to the [Workspace API](https://developer.salesforce.com/docs/component-library/bundle/lightning:workspaceAPI/documentation), which gives developers the ability to finely tune navigation. This is especially useful when building apps that can be used in a lightning console. As of this writing, LWC does not have a feature equivalent. `lwcHost` uses the Workspace API to open related lists in their own tab, and assign a proper tab icon & label. 