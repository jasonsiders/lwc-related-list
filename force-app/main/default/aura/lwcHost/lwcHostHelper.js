({
    decodeComponent : function(component) {
        // Convert the hashed value in c__cmp to a JS object,
        // representing the lightning component to instantiate
        const encoded = this.getEncoded(component);
        component.set("v.hash", encoded);
        return JSON.parse(atob(encoded));
    },
    getEncoded: function(component) {
        const pageRef = component.get("v.pageReference") || {};
        const params = pageRef.state || {};
        return params.c__cmp;
    },
    initialize: function(component) {
        const newComponent = this.decodeComponent(component); 
		if (newComponent) {
            // Create the component
            this.insertComponent(component, newComponent);
            // Set the tab info
            const tabInfo = newComponent.tabInfo; 
            this.setTabInfo(component, tabInfo);
        } 
    },
    insertComponent: function(component, newComponent) {
        // Create an instance of the newComponent,
        // and set it as the current component"s content attribute
        $A.createComponent(
            newComponent.componentDef, 
            newComponent.attributes,
            function(createdComp, status, error) {
                if (status === "SUCCESS") {
                    component.set("v.content", createdComp);
                } else {
                    console.error("c:lwcHost could not insert component\n" + status + ": " + error);
                }
            }
        );
    },
    setTabInfo: function(component, tabInfo) {
        const workspaceApi = component.find("workspace");
        workspaceApi.isConsoleNavigation().then((isConsole) => {
            if (isConsole && tabInfo) {
                workspaceApi.getFocusedTabInfo().then(currentTab => {
                    // Process the currently open tab
                    this.processTab(component, currentTab, tabInfo); 
                    // Process all of its subtabs (if any)
                    const subtabs = currentTab.subtabs || [];
                    subtabs.forEach((subtab) => {
                        this.processTab(component, subtab, tabInfo); 
                    });
                })
            }
        }).catch((error) => {
            console.error("c:lwcHost could not set tab info: " + JSON.stringify(error));
        });
    },
    processTab: function(component, tab, tabInfo) {
        const workspaceApi = component.find("workspace");
        // Ignore unrelated tabs
        const isValid = this.isTabInstance(component, tab);
        if (isValid) {
            // Set the tab icon
            workspaceApi.setTabIcon({
                tabId: tab.tabId, 
                icon: tabInfo.iconName,
                iconAlt: tabInfo.title
            });
            // Set the Tab Label
            workspaceApi.setTabLabel({
                tabId: tab.tabId, 
                label: tabInfo.title
            });
        }
    },
    isTabInstance: function(component, tab) {
        // Returns true if the tab is an instance of the hashed component
        // Prevents common bugs with the workspace api, ie changing unrelated tabs.
        const componentHash = component.get("v.hash");
        const currentVal = tab.pageReference && tab.pageReference.state
            ? tab.pageReference.state.c__cmp 
            : undefined; 
        return currentVal === componentHash;  
    }
})
