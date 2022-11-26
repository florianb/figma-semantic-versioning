# Figma Semantic Versioning

Simplified [Semantic Versioning][semver] for your Figma Nodes without external dependencies and consumable via API.

# Recent Changes

- Add list overview over all versioned nodes if no node is selected
- Make nodes in list views clickable to change selection quickly
- Improve list rendering of nodes
- Major ui changes to allow the change of selection while the plugin is opened.
- Add support for save of "Figma document version" on version change.
- Add support for plugin-internal version history enabling a "revert".
- Add support for commit messages.
- Minor ui changes to improve readability.
- Fix behavior of "Available Options" list to be reset to "Keep" after save.

## Introduction

Usually the design work is embedded in a wholesome work process where any design is part of a more complex product. This plugin intents to help you keeping track of changes to your design by simply attaching a version number to your nodes.

The version number might be used to indicate the expected backend work triggered by the current design changes.

And it also allows you to reference the version in other tools and assets like issue trackers and documentation.

This plugin has **no** external dependencies, the version information is saved in the current document.

>> Be aware the meaning of the word "backend" depends highly on your project setup. In a progressive web app the "backend" is usually a front-end implementation whereas backend in a classical server-based webpage will be the actual server-side webapp implementation.

## User guide

Plaese see the Figma page of the plugin for further information

## API

Purpose of this interface is to provide external access to the stored version number (and future properties to possibly come).

Currently all relevant data is stored as "shared plugin data" to allow other plugins consuming the data. All following described fields are part of stable API of this plugin and should be safe to rely on.

### sharedPluginData: version

- Type: `string` – SemVer-compatible string

The version is stored as SemVer-compatible string matching the following regular expression:

```
/\d+\.\d+\.\d+(-rfc\.\d+)?/i
```

### sharedPluginData: history

- Type: `array` – Array with history objects

#### HistoryObject

- version: `string | undefined`
- commitMessage: `string | undefined`

The history stack up to 5 version changes saving the version alongside the optional commit message.
The first history element (index `0`) might miss a `version` property, this happens when a user drafted a commit message but did not save it away.

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
            "version": "2.0.0-rfc.1",
            "history": [
              {
                "commitMessage":"Add color",
                "version":"1.1.0"
              }
            ]
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
