({
    rerender: function(component, helper) {
        // Force the component to refresh if a new cmp instance is provided on subsequent renders
        // This is done to prevent collisions when multiple components use lwcHost at the same time
        // Ex., two related list components (one for each object)
        this.superRerender(); 
        const cmp = helper.getEncoded(component);
        const current = component.get("v.hash");
        if (cmp !== current) {
            helper.initialize(component);
        }
    }
})
