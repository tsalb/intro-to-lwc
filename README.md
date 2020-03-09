##  Intro to LWCs

Many people want to start with writing LWCs but have a hard time finding where to start (even with the Trailheads). This resource serves as fundamental knowledge to supplement other resources.

You can treat this resource as an index of nouns and table of contents for all the self-learning you will need to do by yourself to get fully up to speed on LWC.

We will be using [Org Development Model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models/#org-development-model) nouns such as `deploy` and `retrieve` in the examples below.

## Why Org Development Model?

If you're using scratch orgs in your day to day, it's likely you're already familiar with the sfdx-cli. So then, you can translate the lwc specific knowledge here to the `pull` and `push` model.

Most Lightning orgs out there are unlikely to be net new implementations so a roadmap to move from the Metadata API project structure to the SFDX project structure is necessary. In my experience, the middle ground is an **sfdx project created with a manifest** connected to a sandbox.

This is the fastest way to start producing LWCs. This is also likely the most popular way since there are still some slight gaps within the scratch org process for truly complex orgs to fully adopt them (without extra scripting) as part of their SDLC.

## What about Aura?

Migration strategy and comparison will not be covered. I have other repos that you can look at to get into that [here](https://github.com/tsalb/lwc-utils).

As much as both Salesforce won't admit and you dont wan't to, there are still situations where you will still need to reach back into Aura on an as-needed basis for base components that are not found in LWC.

We won't be covering those here.

## Browser and General JS Knowledge

LWC follows web standards adopted by most major browsers. That means that a lot of the framework you see is actually just an abstraction layer on top of the JS engine that lives inside most major browsers. This is what LWC-Open Source (LWC-OSS) is. On-Platform LWC (LWC) is a few steps behind LWC-OSS because standards and conventions get hardened there first and then adopted into the platform.

The LWC team is doing a good job this time around making sure developers don't shoot themselves in the foot and that all incoming RFCs are hardened before released globally on platform. Since Salesforce promises to support backwards compatibility ad-infinitum, anything they release cannot *usually* be backed out. I think it's a pretty good model and if you're interested in sneak-peak of *possible* features, just follow the LWC-OSS [github repo](https://github.com/salesforce/lwc) and the accompanying [rfc repo](https://github.com/salesforce/lwc-rfcs/pulls).

What this means is that learning LWC is really just learning JS first. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) is now your primary documentation for all JS knowledge and the [LWC docs](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc) inside the component library are all LWC specific things. However, not all browser JS can be used in an LWC. That is what the [Locker API prevents](https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer).

And if it wasn't confusing enough, another layer of security alongside Locker is the [Shadow DOM](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/create_dom). You won't typically hit issues this if you follow the best practices per the official docs. Shadow DOM is part of the browser spec, but the LWC framework uses something called a `synthetic-shadow` which aims to plug gaps from the current browser's implementation of the Shadow DOM.

The **tl;dr;** for Shadow DOM is that the LWC framework mostly deals with this and won't let you reach into another LWC to look at its contents or data unless that LWC *explicitly* allows you to do so via the `@api` decorator.

[More reading on Web Components and Shadow DOM in general](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## Org Caching and CDN

The platform aggressively caches things like LWCs which is useful in production to speed up the user experience. However, it's not so great for development when you want to see rapid changes you make to a sandbox.

Make sure these settings are **disabled** (unchecked):

```
Setup > Security > Session Management > Caching >
- Enable secure and persistent browser caching to improve performance
- Enable Content Delivery Network (CDN) for Lightning Component framework
```

## Fundamentals of LWC

### 1) Naming conventions and what goes into an LWC bundle

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

### 2) Reactive properties and Decorators

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

### Hands on exercises and next section(s)

Starting from here, the rest of this tutorial and any hands-on will be nested under each branch like so:

```
master
- exercise-1
- exercise-2
- exercise-3
...
```
Why do this? It's easier to change some of the repo code this way so that you can always `deploy` it to your sandbox.

[Click here to go to the next section](https://github.com/tsalb/intro-to-lwcs/tree/exercise-1#3-event-driven).

