# ck-zappar-library
Library and examples for communication between ClueKeeper and Zappar

## Installation instructions
- Open a zap within ZapWorks Studio
- Create a new script by right clicking on the root node, then select New --> Script --> blank
- Rename the script node from `script0` to `cluekeeper`
- Paste the entire contents of the src/cluekeeper.ts file into your new cluekeeper script.
 
## Usage instructions
- Within your other script files import the CK library by adding this line:<br>
    `var CK = symbol.nodes.cluekeeper.CK;`
- Then you can use CK library methods listed below.
 
## Supported Methods
| Method | Args | Returns  | Description | Example |
|:--- |:--- |:--- |:--- |:--- |
| getTeamId | | string | Returns a unique identifier for the team. | `CK.getTeamId();` |
| canSubmit | | boolean | Returns true if players can submit a string as a start code or solution. This corresponds to when the submit button is enabled. | `CK.canSubmit();` |
| submitString | string | void | Submits a start code or solution to the ClueKeeper app.  The response will be the same as if submitted manually via the submit button. | `CK.submitString("ABC");` |
| close | | void | Closes the zap. | `CK.close();` |

## Examples
To get started with this library, you can view some of the included examples as follows:
- Download the .zpp file you want from the examples directory.
- In ZapWorks Studio, select OPEN PROJECT --> IMPORT A ZPP FILE, then select the .zpp file.
- Publish the zap and test within ClueKeeper as normal.
