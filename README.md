#  Intro to LWCs

Many people want to start with writing LWCs but have a hard time finding where to start (even with the Trailheads). This resource serves as fundamental knowledge to supplement other resources.

You can treat this resource as an index of nouns and table of contents for all the self-learning you will need to do by yourself to get fully up to speed on LWC.

We will be using [Org Development Model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models/#org-development-model) nouns such as `deploy` and `retrieve` in the examples below.

### Why Org Development Model?

If you're using scratch orgs in your day to day, it's likely you're already familiar with the sfdx-cli. So then, you can translate the lwc specific knowledge here to the `pull` and `push` model.

Most Lightning orgs out there are unlikely to be net new implementations so a roadmap to move from the Metadata API project structure to the SFDX project structure is necessary. In my experience, the middle ground is an **sfdx project created with a manifest** connected to a sandbox.

This is the fastest way to start producing LWCs. This is also likely the most popular way since there are still some slight gaps within the scratch org process for truly complex orgs to fully adopt them (without extra scripting) as part of their SDLC.

### What about Aura?

Migration strategy and comparison will not be covered. I have other repos that you can look at to get into that [here](https://github.com/tsalb/lwc-utils).

As much as both Salesforce won't admit and you dont wan't to, there are still situations where you will still need to reach back into Aura on an as-needed basis for base components that are not found in LWC.

We won't be covering those here.

### Browser and General JS Knowledge

LWC follows web standards adopted by most major browsers. That means that a lot of the framework you see is actually just an abstraction layer on top of the JS engine that lives inside most major browsers. This is what LWC-Open Source (LWC-OSS) is. On-Platform LWC (LWC) is a few steps behind LWC-OSS because standards and conventions get hardened there first and then adopted into the platform.

The LWC team is doing a good job this time around making sure developers don't shoot themselves in the foot and that all incoming RFCs are hardened before released globally on platform. Since Salesforce promises to support backwards compatibility ad-infinitum, anything they release cannot *usually* be backed out. I think it's a pretty good model and if you're interested in sneak-peak of *possible* features, just follow the LWC-OSS [github repo](https://github.com/salesforce/lwc) and the accompanying [rfc repo](https://github.com/salesforce/lwc-rfcs/pulls).

What this means is that learning LWC is really just learning JS first. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) is now your primary documentation for all JS knowledge and the [LWC docs](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc) inside the component library are all LWC specific things. However, not all browser JS can be used in an LWC. That is what the [Locker API prevents](https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer).

And if it wasn't confusing enough, another layer of security alongside Locker is the [Shadow DOM](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/create_dom). You won't typically hit issues this if you follow the best practices per the official docs. Shadow DOM is part of the browser spec, but the LWC framework uses something called a `synthetic-shadow` which aims to plug gaps from the current browser's implementation of the Shadow DOM.

The **tl;dr;** for Shadow DOM is that the LWC framework mostly deals with this and won't let you reach into another LWC to look at its contents or data unless that LWC *explicitly* allows you to do so via the `@api` decorator.

[More reading on Web Components and Shadow DOM in general](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

### Org Caching and CDN

The platform aggressively caches things like LWCs which is useful in production to speed up the user experience. However, it's not so great for development when you want to see rapid changes you make to a sandbox.

Make sure these settings are **disabled** (unchecked):

```
Setup > Security > Session Management > Caching >
- Enable secure and persistent browser caching to improve performance
- Enable Content Delivery Network (CDN) for Lightning Component framework
```

### Fundamentals of LWC

##### 1) Naming conventions and what goes into an LWC bundle

There are two types of naming conventions for LWC: `kebab-case` and `camelCase`.

The LWC files themselves are `camelCase` with a bundle that looks like this: 

```
myComponent
├──myComponent.html
├──myComponent.js
├──myComponent.js-meta.xml
├──myComponent.css
└──myComponent.svg
```
The more detailed rules are [here](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/lwc.create_components_folder).

The actual `myComponent.js` file would use the following `MyComponent` constructor. Notice the capitalized `M`.

```javascript
import { LightningElement } from 'lwc';
export default class MyComponent extends LightningElement {
    
}
```

If you were to use this component available to be used in another one, you need to use a namespace, `c` by default, and then flip it to `kebab-case` as such:

```html
<!-- anotherComponent.html -->
<c-my-component></c-my-component>
```

Confusing? Yes. Will you get use to it? Yes.

##### 2) Reactive properties and Decorators

The framework handles the abstraction for reactivity natively. All properties referenced in the `template` (the html file) are by default reactive. This just means that if a new value changes in the JS controller, the `template` will automatically see those changes. It is *reactive*.

Decorators `@api` and `@wire` are abstractions which tell the framework that there is something special about properties *decorated* by those pieces of text. We will get into the `@wire` decorator later. `@api` exposes the attribute for use, both setting and getting of values, by other components.

```html
<!-- item.html -->
<template>
    <div>
        <label>{itemName}</label>
    </div>
</template>
```
```javascript
// item.js
import { LightningElement, api } from 'lwc';

export default class Item extends LightningElement {
    @api itemName = 'New Item';
}
```

But this example in itself isn't useful nor a good example of what `@api` does. Here's an example of how to compose `<c-item>` into something useful and adding in a *bound* property, `parentSuppliedName`.

```html
<!-- storeFront.html -->
<template>
    <lightning-card>
        <div slot="actions">
            <lightning-input onkeyup={inputKeyUp}></lightning-input>
        </div>
        Parent Supplied Name: {parentSuppliedName}
        <c-item item-name="Milk"></c-item>
        <c-item item-name="Eggs"></c-item>
        <c-item item-name={parentSuppliedName}></c-item>
        <!-- No props set means fallback to what's in child component -->
        <c-item></c-item>
    </lightning-card>
</template>

```
```javascript
// storeFront.js
import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    parentSuppliedName;

    inputKeyUp(evt) {
        this.parentSuppliedName = evt.target.value.toUpperCase();
    }
}
```

To make this droppable onto a record page:

```xml
<!-- storeFront.js-meta.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>48.0</apiVersion>
    <isExposed>true</isExposed>
    <masterLabel>Store Front</masterLabel>
    <targets>
        <target>lightning__RecordPage</target>
    </targets>
</LightningComponentBundle>
```

>**Important Note**: You only need the `@track` decorator now for tracking data within a collection or JS object. In other words, most of the time you don't need it unless you're doing more advanced data manipulation/assignment in JS. 

##### 3) Event Driven

There are a handful of communication models going from basic to advanced. These communications models are how you pass data up and down your component tree.

![datatable](/readme-images/event-comms-model.png?raw=true)

**Parent to Child - Attributes / Properties**

As we saw in the above example, the first `<c-item>` is passing an explicitly set `string` value of `"Milk"` into the child.

The other `<c-item>` here is taking the `parentSuppliedName` property from the parent `<c-store-front>` via something called **binding**. The child's `item-name` attribute is *bound* to the parent property called `parentSuppliedName`.

Since `parentSuppliedName` is reactive, any changes to it on the `<c-store-front>` will get sent to the child `<c-item>` component.

```html
<!-- storeFront.html -->
...
    <c-item item-name="Milk"></c-item>
    ...
    <c-item item-name={parentSuppliedName}></c-item>
...
```

>**Important Note**: LWC forces *one-way data binding* meaning that if a child were to change the value of that same property, it will not automatically tell the parent. You have to do that through an **event** which we will cover next.

**Child to Parent - Events - No Payload**

First, we need to adjust the example above so that each child `<c-item>` has something it can do only within itself. We'll be using `<lightning-layout>` to help organize it:

```html
<!-- item.html -->
<template>
    <lightning-layout vertical-align="center">
        <label>{itemName}</label>
        <lightning-button 
            class="slds-p-left_small"
            label="Clear Name"
            onclick={clearName}
        ></lightning-button>
    </lightning-layout>
</template>
```
```javascript
// item.js
import { LightningElement, api } from 'lwc';

export default class Item extends LightningElement {
    @api itemName = 'New Item';

    clearName() {
        this.itemName = '';
    }
}
```

So then, now each `<c-item>` has a button which can clear out the `itemName`. You'll see that `Parent Supplied Name: {parentSuppliedName}` doesn't change. This is due to the *one-way data binding*. State passed from parent to child and if the child mutates it, remains on the child unless we notify the parent via an event like this:

```javascript
// item.js
...
    clearName() {
        this.dispatchEvent(new CustomEvent('clear'));
        this.itemName = '';
    }
...
```
```html
<!-- storeFront.html -->
...
    <c-item item-name={parentSuppliedName} onclear={handleClear}></c-item>
...
```
```javascript
// storeFront.js
...
    handleClear() {
        console.log('cleared');
        this.parentSuppliedName = '';
    }
...
```
So then now when that specific `<c-item>` clears its `itemName` prop, it will let the parent know!

>**Important Note**: `dispatchEvent` and `CustomEvent` are both part of the browser spec found [here](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) and [here](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent). The naming conventions for events make things easier to parent listeners if they are all lowercase.

**Child to Parent - Events - Payloads**

Payloads carry information about the child to any components listening above. By default, it will only *bubble* to the direct parent. You can modify this behavior but we won't be getting in that here. Read here on granular control for [event propagation](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/events_propagation).

This is an example of sending the `itemName` property in an event before clearing it out on the child.

```javascript
// item.js
...
    clearName() {
        this.dispatchEvent(new CustomEvent('clear', { detail: this.itemName }));
        this.itemName = '';
    }
...
```
```javascript
// storeFront.js
...
    handleClear(evt) {
        const clearedItemName = evt.detail;
        console.log(clearedItemName); // outputs the previous value of 'itemName'
        this.parentSuppliedName = '';
    }
...
```
>**Important Note**: The `clear` event payload uses a JS Object with a property called `detail`. You can actually use anything as the payload including only a string but best practice dictates that these can be standardized. You'll notice a lot of the salesforce events are wrapped with `detail` and I think you should follow suit. You can include *another* object as part of `detail` and then you can get into complex payloads such as `evt.detail.prop1` and `evt.detail.prop2`.

The above example isn't super useful, but consider the following:

```javascript
// item.js
...
    clearName() {
        this.dispatchEvent(new CustomEvent('clear'));
        this.itemName = '';
    }
...
```
```html
<!-- storeFront.html -->
...
        <c-item
            name="third_item"
            item-name={parentSuppliedName}
            onclear={handleClear}
        ></c-item>
...
```
```javascript
// storeFront.js
...
    handleClear(evt) {
        const itemIdentifier = evt.target.name;
        console.log(itemIdentifier); // outputs 'third_item'
    }
...
```

You might be wondering why the payload is now removed. That's because there is another way to access information about where the event was coming from using `evt.target`. This is useful to differentiate from which child the event is coming from.

>**Exercise 1**: Change `handleClear` on `<c-store-front>` so that it blanks out the `parentSuppliedName` property only when the third `<c-item>` is clicked. Use the following template to start:

```html
<!-- storeFront.html -->
<template>
    <lightning-card>
        <div slot="actions">
            <lightning-input onkeyup={inputKeyUp}></lightning-input>
        </div>
        Parent Supplied Name: {parentSuppliedName}
        <c-item
            name="first_item"
            item-name="Milk"
            onclear={handleClear}
        ></c-item>
        <c-item
            name="second_item"
            item-name="Eggs"
            onclear={handleClear}
        ></c-item>
        <c-item
            name="third_item"
            item-name={parentSuppliedName}
            onclear={handleClear}
        ></c-item>
        <!-- No props set means fallback to what's in child component -->
        <c-item name="fourth_item" onclear={handleClear}></c-item>
    </lightning-card>
</template>
```

