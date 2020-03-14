##  Intro to LWCs

Many people want to start with writing LWCs but have a hard time finding where to start (even with the Trailheads). This resource serves as fundamental knowledge to supplement other resources.

You can treat this resource as an index of nouns and table of contents for all the self-learning you will need to do by yourself to get fully up to speed on LWC.

## How to get started using this repo?

1) Install [Salesforce CLI](https://developer.salesforce.com/docs/atlas.en-us.224.0.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm#sfdx_setup_install_clihttps://developer.salesforce.com/tools/sfdxcli).
2) Install VS Code and [Salesforce Extensions for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode).
3) Install [Git](https://git-scm.com/downloads).
4) [Set up](https://help.github.com/articles/set-up-git/) Git.
5) Familiarize yourself VSCode Quick Start Trailhead [Module](https://trailhead.salesforce.com/content/learn/projects/quickstart-vscode-salesforce).
6) Open VSCode's terminal and navigate to a directory where you want to clone this repo:
    - MacOs / Windows: Ctrl+`
    - Run `git clone https://github.com/tsalb/intro-to-lwcs.git` to your desired directory.
7) Using VSCode, File => Open the `intro-to-lwc` folder that was just cloned.
8) Authorize your sandbox / trailhead sandbox using `SFDX: Authorize an Org` in the command palette.
    - MacOs: Cmd+Shift+P
    - Windows: Ctrl+Shift+P
    - Sandbox => Any alias (something easy to type) => Enter => Provide credentials
9) If it didn't already set, at the bottom of VSCode click on `No Default Org Set` and choose the sandbox you had just authed into.
10) In the File Explorer, navigate to the `manifest` folder and right click the `package.xml` and do `SFDX: Deploy Source in Manifest to Org`.

We will be using the [Org Development Model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models/#org-development-model) nouns such as `deploy` and `retrieve` in the this guide.

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

```js
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
```js
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
```js
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

### 3) Event Driven

There are a handful of communication models going from basic to advanced. These communications models are how you pass data up and down your component tree.

![datatable](/readme-images/event-comms-model.png?raw=true)

#### Parent to Child - Attributes / Properties

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

#### Child to Parent - Events - No Payload

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
```js
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

```js
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
```js
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

#### Child to Parent - Events - Payloads

Payloads carry information about the child to any components listening above. By default, it will only *bubble* to the direct parent. You can modify this behavior but we won't be getting in that here. Read here on granular control for [event propagation](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/events_propagation).

This is an example of sending the `itemName` property in an event before clearing it out on the child.

```js
// item.js
...
    clearName() {
        this.dispatchEvent(new CustomEvent('clear', { detail: this.itemName }));
        this.itemName = '';
    }
...
```
```js
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

The above example isn't *super* useful, but consider the next section.

#### Child to Parent - Event Target

```js
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
```js
// storeFront.js
...
    handleClear(evt) {
        const itemIdentifier = evt.target.name;
        console.log(itemIdentifier); // outputs 'third_item'
    }
...
```

You might be wondering why the payload is now removed. That's because there is another way to access information about where the event was coming from using `evt.target`. This is useful to differentiate from which child the event is coming from.

>**Exercise 1**: Use a switch/case statement in the `handleClear` function on `<c-store-front>` so that it blanks out the `parentSuppliedName` property only when the third `<c-item>` is clicked. Clicks on any other item should just produce `console.log(evt.target.name)`. Use the following template to start:

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

If you get stuck here, branch `exercise-2` has the answer(s). From now on every following exercise branch will contain the answers to the previous step. You can click [here](https://github.com/tsalb/intro-to-lwcs/tree/exercise-2#parent-to-child---accessing-public-properties) to go to the next branch and section.

#### Parent to Child - Accessing public properties
====================
<!-- Psuedo-spoiler tags can be formed like this. Line break is required! -->
<details>
    <summary>Answer to Exercise 1</summary>

```js
// storeFront.js
...
    handleClear(evt) {
        switch (evt.target.name) {
            case 'third_item':
                this.parentSuppliedName = '';
                break;
            default:
                console.log(evt.target.name);
                break;
        }
    }
...
```
</details>

====================

Now we have communication up our component tree with the parent `handleClear` function properly handling clearing the `parentSuppliedName`.

What if we wanted a "Clear All" type of button? Wouldn't that be much easier?

```html
<!-- storeFront.html -->
...
        <div slot="actions">
            <lightning-layout vertical-align="end">                
                <lightning-input onkeyup={inputKeyUp}></lightning-input>
                <lightning-button
                    class="slds-p-left_xx-small"
                    label="Clear All"
                    onclick={clearAll}
                ></lightning-button>
            </lightning-layout>
        </div>
...
```
```js
// storeFront.js
...
    clearAll(evt) {
        const children = this.template.querySelectorAll('c-item');
        for (let item of children) {
            item.itemName = '';
        }
    }
...
```

#### Parent to Child - Accessing public methods / functions

We got lucky that the `itemName` was marked as public. What if we wanted a more complex function to be run or if we wanted to modify something on a child that wasn't public?

We can ask the child to expose one of its functions just like how it exposes its properties and then call the function from `<c-store-front>`

```js
// item.js
...
    @api
    clearName() {
        this.dispatchEvent(new CustomEvent('clear'));
        this.itemName = '';
    }
...
```
```js
// storeFront.js
...
    clearAll(evt) {
        const children = this.template.querySelectorAll('c-item');
        for (let item of children) {
            item.clearName();
        }
    }
...
```

The added benefit is that the previous clearing of `parentSuppliedName` will work as before.

>**Important Note**: Both `querySelector` and `querySelectorAll` are part of the browser but the `synthetic-shadow` requires that you use `this.template` to refer to the current component. Otherwise, you can read more about the spec [here](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) and the official lwc docs [here](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/create_javascript_methods).

#### Intercomponent communication

Right now is an unfortunate time since there is no platform supported way to communicate between LWCs. There are primarily two options:

1) Fill in the gap using the lwc-recipe's `pubsub` component. There are official samples from that [repo](https://github.com/trailheadapps/lwc-recipes).

2) Wait for [Lightning Message Channel](https://developer.salesforce.com/blogs/2019/10/lightning-message-service-developer-preview.html) to GA out of beta. I cover some of its use in my other [repo](https://github.com/tsalb/lwc-utils/commit/e2330c539eef2e5b40ff8e93e6d460ecbeb3b350).

We won't be covering those in this example as they are a bit out of intro depth.

### 3) Standards Driven

As the browser spec becomes improved over time with more APIs, LWC will grow as well. While we don't have time to get into every topic covered I'll highlight some of the more useful ones.

1) Data looping
    - [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
    - [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
2) Data manipulation
    - [.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    - [.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
    - [.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
3) Data manipulation for validation
    - [.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
    - [.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
4) [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for flow control.
    - JS is single threaded so server side calls or multiple functions might need to wait for a callback
    - Calls to apex and `@wire` within an LWC are all promise-ified. Get comfortable with promises.
    - [Async await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) is syntactic sugar on top of promises to make them easier to use.
        - See [here](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/get_started_supported_javascript) on current limitations for async await.
5) [Object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) for property control.

### 4) HTML Directives

If you were wondering how to deal with collections or dynamic visibility, these are wrapped up in what are called Directives. The [official docs](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/lwc.reference_directives) have a more descriptive summary and so please refer to that.

However, I will highlight the two major ones here:

1) Loop Control
    - **`for:each={array}`**, **`for:item="currentItem"`**, and **`key`**
    -   ```html
        <template for:each={contacts} for:item="contact">
            <li key={contact.Id}>
                {contact.Name}, {contact.Title}
            </li>
        </template>
        ```

2) Dynamic Visibility
    - **`if:true|false={expression}`**
    -   ```html
        <template if:true={showSpinner}>
            ...
        </template>
        ```

>**Exercise 2**: Right now we are using hardcoded `<c-item>` inside the template for `<c-store-front>` but we want to change that. Instead, we want it to run off the `storeFrontItems` collection in `storeFront.js`.
>
>We will be deprecating the `parentSuppliedName` and related features but keeping the `clear` event features.
>
>**Extra Credit**: Use the `for:index` directive to bound to the `name` attribute so that `handleClear` can still differentiate which `<c-item>` the click originated from.
>
>Use the following template and js to start:


```html
<!-- storeFront.html -->
<template>
    <lightning-card>
        <div slot="actions">
            <lightning-layout vertical-align="end">                
                <lightning-button
                    class="slds-p-left_xx-small"
                    label="Clear All"
                    onclick={clearAll}
                ></lightning-button>
            </lightning-layout>
        </div>
        <c-item name="first" item-name="Milk" onclear={handleClear}></c-item>
        <c-item name="second" item-name="Eggs" onclear={handleClear}></c-item>
        <c-item name="third" onclear={handleClear}></c-item>
        <c-item name="fourth" onclear={handleClear}></c-item>
    </lightning-card>
</template>
```
```js
// storeFront.js
import { LightningElement } from 'lwc';

export default class StoreFront extends LightningElement {
    storeFrontItems = ['Milk', 'Eggs', 'Bread', null];

    handleClear(evt) {
        console.log(evt.target.name);
    }

    clearAll() {
        const children = this.template.querySelectorAll('c-item');
        for (let item of children) {
            item.clearName();
        }
    }
}
```

If you get stuck here, branch `exercise-3` has the answer(s).

[Click here to go to the next branch](https://github.com/tsalb/intro-to-lwcs/tree/exercise-3#5-lwc-lifecycle-and-flexipage-context).

### 5) LWC Lifecycle and Flexipage Context
====================
<!-- Psuedo-spoiler tags can be formed like this. Line break is required! -->
<details>
    <summary>Answer to Exercise 2</summary>

```html
<!-- storeFront.html -->
<template>
    <lightning-card>
        <div slot="actions">
            <lightning-layout vertical-align="end">
                <lightning-button
                    class="slds-p-left_xx-small"
                    label="Clear All"
                    onclick={clearAll}
                ></lightning-button>
            </lightning-layout>
        </div>
        <template for:each={storeFrontItems} for:item="item" for:index="idx">
            <c-item
                name={idx}
                key={item}
                item-name={item}
                onclear={handleClear}
            ></c-item>
        </template>
    </lightning-card>
</template>
```
</details>

====================

Before we get into more advanced functions, let's take a step back and look at what happens when an LWC is created on the page and some of its useful features while it does.

The official docs describe the lifecycle of an LWC in [better detail](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/create_lifecycle_hooks_intro).

The two more important ones are these:

```js
connectedCallback() {
    // Do stuff when the component is inserted into the DOM.
    // Typically this is where you would run most functions to 
    // get apex or to get the current flexipage's Record Id.
}
renderedCallback() {
    // Do stuff when the component renders. A component can render multiple times
    // so if you want to run code only once then you can use a hasRendered Boolean.
}
```

And, if you use the following, you can get both the `recordId` and the `objectApiName`:

```js
import { LightningElement, api } from 'lwc';
export default class StoreFront extends LightningElement {
    @api recordId;
    @api objectApiName;

    connectedCallback() {
        console.log(this.recordId); //outputs a record Id, e.g. `a01xxxxxxxxxxx`
        console.log(this.objectApiName); // outputs something like `Account`
    }
}
```

### 6) Serverside Apex - Imperative

So far all we've done is manipulate the UI with some base components and JS.

For something useful, we need some data from the server. A couple of important things about serverside apex:

1) It's promisified.
2) It's immutable if (cacheable=true) is used.

We'll go into each one of those in this section, but first - this is what you need to grab a `List<Contact>` from the server. Let's assume that we put the `<c-store-front>` LWC on an `Account` record's flexipage.

Go ahead and deploy this class to your org:

```java
public class StoreDataService {
    @AuraEnabled
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email FROM Contact WHERE AccountId =: accountId];
    }
}
```

And this is how an LWC would use it. I use the same JS function name as the apex method name `getContacts` but you don't have to. They can be different if you wish.

```js
import getContacts from '@salesforce/apex/StoreDataService.getContacts';

export default class StoreFront extends LightningElement {
    @api recordId;
    ...
    async connectedCallback() {
        let contacts = await getContacts({accountId: this.recordId});
    }
    ...
}
```

Remember the promise-ification of apex natively? `async/await` is the easier way to deal with promises. This is telling that line of code to `await` until the server is done getting the contacts.

This is a much easier way to manage your serverside callouts.

What then, is immutability? Consider the following scenario:

```java
public class StoreDataService {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email FROM Contact WHERE AccountId =: accountId];
    }
}
```
```js
    ...
    async connectedCallback() {
        let contacts = await getContacts({accountId: this.recordId});
        for (let con of contacts) {
            con.Name = 'Change the Name'; // proxy trap error, aka immutability error
        }
    }
    ...
```
When an `@AuraEnabled` apex method is marked with `cacheable=true`, the LWC won't let you modify the data returned directly. You'll have to copy it to a different array or use it in read only format!

### 7) Serverside Apex - Wire

We will be skipping this in detail, but know that there are **two** ways to call apex from an LWC. 

Calling apex from an `@wire` is something special but the [official docs](https://developer.salesforce.com/docs/component-library/documentation/en/48.0/lwc/lwc.apex) explain it much better in detail.

To both summarize that documentation and explain what a `@wire` is for the next section, please keep in mind the following points:

1) `@wire` is a decorator that *wires* a property.
    - You can wire to apex and you can wire to a *Lightning Data Service adapter* (next section).
    - The wire can return to either the property itself:
        ```js
        @wire(getContacts) contacts; // not passing any parameter
        ...
        @wire(getContacts, {accountId: '$recordId'}) contacts; // pass the recordId parameter
        ```
    - OR a function callback
        ```js
        @wire(getContacts)
        contactsWireFunction({error, data}) {
            console.log(error);
            console.log(data); // process data when wire is done
        }
        ...
        @wire(getContacts, {accountId: '$recordId'})
        contactsWireFunction({error, data}) {
            console.log(error);
            console.log(data); // process data when wire is done
        }
        ```
2) There's a bit of magic with the `$` prefix on the property. This marks the property as *reactive*. This special prefix is **only** used with `@wire`.
3) When a property bound to a wire changes, the wire automatically goes and fetches the function again. 
    - You might be wondering why this is useful, consider the following example:
        ```js
        @wire(findContacts, { searchKey: '$searchKey' })
        contacts;
        ```
    - Based on a user typing a search function, the wire automatically retrieves any contacts based on the newest `searchKey`. Soemthing like a name or email!
4) `@wire` return an immutable property.
    - This is because there is special caching on wire functions meaning if you pass the same parameter to the wire, it doesn't need to go to server again!
    - Consider the following example:
        - User searches `James` => Serverside call.
        - User searches `Joy` => Serverside call.
        - User searches `James` => Cached callback, no serverside call!
5) `@wire` is always run initially on load!
    - Sometime slightly before `connectedCallback()` which gives a silent failure since the `$input` is null. This is by design!
    - And the second run on load when the `$input` variable is given.
        - This can be either from the UI input OR something like `recordId` is passed from the flexipage to the wire (`$recordId`).
6) `@wire` is not guaranteed to finish by the end of `connectedCallback()` or `renderedCallback()`. They are promisified but we dont (currently) have control over the order or when they fully return.
    - This means chaining wires can prove challenging if order matters!

### 8) Base Components

You might be wondering why I consider this more advanced than apex. With apex, there is full control over exactly what you get back from the server and you have the flexibility to add / remove parameters to change how you get the data.

Whatever complexty there is, at the end of the day all you're using apex for inside an LWC is just about getting data.

With Base Components, complexity ranges from easy to use: 
- `lightning-card` 
- `lightning-record-form`
- `lightning-record-edit-form`

to really difficult:
- `lightning-datatable`
- `lightning-tree-grid`
- `message-service`

On top of the difficulty level for various base components to use, you're limited by the current `@api` they expose and the `events ` they emit that you can capture and use.

However, they are the building blocks of your LWC. When in doubt, always check the [component library](https://developer.salesforce.com/docs/component-library/overview/components) to see if there is something that the salesforce team has already developed for you to use.

### 9) Lightning Data Service

The most complicated but also most useful feature of LWCs: `adapters` for Lightning Data Service (LDS).

What is an adapter? You can think of these as utility functions that are given for an LWC to `import` and use. Things like getting a single record's details, updating a record and so forth. You can do all if this with LDS and not write a single line of apex!

Here are some samples:

```js
// Example of getting a record's data
import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

...

@wire(getRecord, { recordId: '001456789012345678', fields: [NAME_FIELD, INDUSTRY_FIELD]})
account;

get industry(){
    return getFieldValue(this.account.data, INDUSTRY_FIELD);
}
```
```js
// Example of updating a record's data
import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';

...
@api recordId;
...

const fields = {};
fields[ID_FIELD.fieldApiName] = this.recordId;
fields[FIRSTNAME_FIELD.fieldApiName] = 'John';
fields[LASTNAME_FIELD.fieldApiName] = 'Doe';
const recordInput = { fields };
updateRecord(recordInput)
```

```js
//todo more
```

