# Figma Semantic Versioning

Simplified [Semantic Versioning][semver] for your Figma Nodes without external dependencies and consumable via API.

## Introduction

Usually the design work is embedded in a wholesome work process where any design is part of a more complex product. This plugin intents to help you keeping track of changes to your design by simply attaching a version number to your nodes.

The version number might be used to indicate the expected backend work triggered by the current design changes.

And it also allows you to reference the version in other tools and assets like issue trackers and documentation.

This plugin has **no** external dependencies, the version information is saved in the current document.

>> Be aware the meaning of the word "backed" depends highly on your project setup. In a progressive web app the "backend" is usually a front-end implementation whereas backend in a classical server-based webpage will be the actual server-side webapp implementation.

## How to use this Plugin?

Select one or more nodes and run the plugin.

If you select multiple nodes you will get a list of the selected nodes with their current version status read from the internal plugin data.

If you select a single node you will get an interface to change the current version of that node according to the implemented version workflow.

## How to use the Version Workflow?

The version number consist of three to four numerical parts:

```
MAJOR.MINOR.PATCH(-rfc.RFC)
```

The Rfc-part in brackets is optional and depends on the "requests for comments" setting.

The numbers are supposed to increment only. Goal of providing the version numbers is to allow automagical dependency checking by dependent systems.

#### MAJOR

The MAJOR-release number increase marks a **backward-incompatible** change of your design.

Imagine you changed a frame containing a form by removing an input. As you can imagine this will break the current implementation of the app using this design because the app actually works with that input and might expect a value attached to it.

Propagating this change will likely break the backend-implementation. You communicate this by increasing the major release number by one actually saying this is a backward-incompatible change. And you expect it to break the current implementation.

#### MINOR

The MINOR-release number increase marks a **backward-compatible** change of your design, usually by adding a feature.

Imagine you extended the functionality of a frame by changing the design to display an additional input element. While this will require backend work to make the input actually work, rolling out the deign won't break the application. So that is a backward compatible change of the current design.

Increasing the MINOR release version communicates you added a change which might require backend work but won't break the current backend implementation.

#### PATCH

The PATCH-release number increase marks a simple fix of your design which does not require any backend work.

Let's say you adjust some colors or got a ticket telling you a responsiveness feature isn't working as expected. By fixing this you correct the intentional implementation of the current design.

By using the PATCH version number you communicate there is no change in the backend-interface of your design and it won't require any backend changes.

#### RFC

Depending on your surrounding development process you might not be able to decide on your own when a design is ready to release. In this case you are able to enable the "request for comments"-based workflow.

The Rfc-workflow adds a `-rfc.1`-postfix reflecting the current iteration in your approval process.

Let's say you make a first draft of a form, since it's a minor change, you choose to add a minor-change and because you have the rfc-workflow enabled you're only minor release option (given your current version is `1.0.0`) is `1.1.0-rfc.1`. This communicates you drafted a first version of the intended minor change.

Your team then discusses your draft and gives you some feedback which requires changes. After these changes you increase the Rfc number resulting in `1.1.0-rfc.2`. After another discussion with your team all are fine with the changes and you release the design to `1.1.0`.

## How to use the Settings?

The settings are saved per document. That said you will have to adjust the settings once per document.

### Use "request for comments"

Checking this option enables a "pre-release" path for your versioning which adds the `-rfc.<<number>>` counter to the version. Using this feature allows you to mark your changes as a "proposal" depending on the workflow your design work is embedded in.

Unchecking this option changes only the available options for you next version change and does **not** automatically change any saved versions in the document.

### Use version postfix at Node names

Checking this option enables `@`-prefixed version postfixes for the node names. When a version get's saved an `@`-symbol gets added to node name (if it not already exists) and the saved version get's appended to the name.

This feature also adds two more version options "From Name" and "To Name" to the user interface (if the version postfix and the stored version differ) allowing you to f.e. manually set the version. Please keep in mind that `0.x` versions for initial development are not supported.

Unchecking this option does currently not remove any version postfixes, if you want to remove any version postfixes from your nodes you will have to do this manually at the moment.

## API

Purpose of this interface is to provide external access to the stored version number (and future properties to possibly come).

Currently all relevant data is stored as "shared plugin data" to allow other plugins consuming the data. All following described fields are part of stable API of this plugin and should be safe to rely on.

### sharedPluginData: version

- Type: `string` – SemVer-compatible string

The version is stored as SemVer-compatible string matching the following regular expression:

```
/\d+\.\d+\.\d+(-rfc\.\d+)?/i
```

#### Example

This example shows how to extract the stored version information from a nopde programatically 

Access the stored property using the [`GET file nodes`][rest-api-files-endpoint]:

```
curl -H 'X-FIGMA-TOKEN: <<YOUR_FIGMA_TOKEN>>' 'https://api.figma.com/v1/files/<<YOUR_FIGMA_FILE_ID>>/nodes?ids=<<YOUR_FIGMA_NODE_ID>>&plugin_data=shared'
```

Results in:

```
{
  "name": "My Fancy Document Title",
  ...
  "nodes": {
    "108:3": {
      "document": {
        "id": "108:3",
        "name": "Frame 1@2.0.0-rfc.1",
        "sharedPluginData": {
          "com.github.florianb.figma_semantic_versioning": {
            "version": "2.0.0-rfc.1"
          }
        }
        ...
      }
    }
  }
}
```

Please Note: i omitted unnecessary outputs from the result.

As you can see the actual version of the node appears twice, so you might be tempted to use the versions extracted from the node names (which would allow you to use the "cheaper" `GET file` endpoint). But be aware the authorative "version" is the one stored in the `sharedPluginData` section.

The reason is the user might have renamed the Node changing or removing the version. And there is no way to track this change without the stored plugin data.

## Contribute

Thank you for reading so far, any help is welcome. May it be constructive feedback or a Pull Request. We are happy to hear from you.

---

License MIT.

[semver]: https://semver.org/
[rest-api-files-endpoint]: https://www.figma.com/developers/api#get-files-endpoint
