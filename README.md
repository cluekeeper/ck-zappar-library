# ck-zappar-library
Library and examples for communication between ClueKeeper and Zappar

## Installation instructions
- Open a zap within ZapWorks Studio
- Create a new script by right clicking on the root node (or anywhere else in the node hierarchy), then select New --> Script --> blank
- Rename the script node from `script0` to `cluekeeper`
- Paste the entire contents of the [src/cluekeeper.ts](https://raw.githubusercontent.com/cluekeeper/ck-zappar-library/master/src/cluekeeper.ts) file into your new cluekeeper script.

## Usage instructions
- Within your other script files import the CK library by adding this line:<br>
    `const CK = symbol.nodes.cluekeeper.CK;`
- Then you can use CK library methods listed below.

## Supported Methods
| Method | Description |
|:--- |:--- |
| getTeamId(): string | Returns a unique identifier for the team.<br><br>Usage:<br>`CK.getTeamId();` |
| canSubmit(): boolean | Returns true if players can submit a string as a start code or solution. This corresponds to when the submit button is enabled.<br><br>Usage:<br>`CK.canSubmit();` |
| isSolved(): boolean | Returns true if this clue has been solved.<br><br>Usage:<br>`CK.isSolved();` |
| getClueStates(): ClueState[] | Returns an array of `ClueState` objects, each defined as follows:<br>`interface ClueState {`<br>&nbsp;&nbsp;`title: string;`<br>&nbsp;&nbsp;`isStarted: boolean;`<br>&nbsp;&nbsp;`isInProgress: boolean;`<br>&nbsp;&nbsp;`isSolved: boolean;`<br>&nbsp;&nbsp;`isFinished: boolean;`<br>&nbsp;&nbsp;`miniStates: ClueState[];`<br>`}`<br><br>The objects in the array will be in the same order as the default clue order for the hunt.<br><br>Usage:<br>`const clueStates = CK.getClueStates();`<br>`const firstClueTitle = clueStates[0].title;` |
| playAlertSound(): void | Plays a sound to get the user's attention. This is the same sound used when a new message becomes available, a clue opens, or a clue nears expiration.<br><br>Usage:<br>`CK.playAlertSound();` |
| playExpireSound(): void | Plays the sound used to indicate that a clue or the hunt has expired.<br><br>Usage:<br>`CK.playExpireSound();` |
| playHintSound(): void | Plays the sound used to indicate that a new free hint is available.<br><br>Usage:<br>`CK.playHintSound();` |
| playSolveSound(): void | Plays the sound used to indicate that a clue was solved successfully.<br><br>Usage:<br>`CK.playSolveSound();` |
| submitString(guess: string): void | Submits a start code or solution to the ClueKeeper app.  The response will be the same as if submitted manually via the submit button.<br><br>Usage:<br>`CK.submitString("ABC");` |
| submitStringAndRelaunchOnSuccess(guess: string, deepLink?: string): void | Submits a solution to the ClueKeeper app, then launches a new zap if the guess is correct.<br><br>If a deepLink for the subsequent zap is not present, the current zap will be relaunched with isSolved() returning true.<br><br>This feature is only available for clue solves (not clue starts). <br><br>Usage:<br>`CK.submitStringAndRelaunchOnSuccess("ABC");`<br><br>***Note: This feature is experimental and likely to change.*** |
| showInfoDialog(title: string, text: string): void | Shows a standard system dialog using the given title and message.<br><br>Usage:<br>`CK.showInfoDialog("Title of dialog", "Message of dialog");`<br><br>*Note: This feature is only available to players using app version 1.17.1 and higher.* |
| close(): void | Closes the zap.<br><br>Usage:<br>`CK.close();` |
| closeAndContinue(): void | Closes the zap and navigates the player to the next appropriate screen, using the same logic as the confirmation dialog presented when a clue is solved. For example, in a linear hunt the next screen is the next clue, while in a scramble the next screen is the clue list.<br><br>If the clue has not been solved or the hunt is not in progress, this behaves the same as close().<br><br>Usage:<br>`CK.closeAndContinue();` |

## Examples
To get started with this library, you can view some of the included examples:

| Example File | Description |
|:--- |:--- |
| submit-string.zpp | Shows how to submit a string for a clue start or clue solution from within a Zap. |
| double-zap.zpp | Shows how to relaunch the zap for a post-solve user experience. |

Instructions for using examples:
- Download the .zpp file you want from the examples directory.
- In ZapWorks Studio, select OPEN PROJECT --> IMPORT A ZPP FILE, then select the .zpp file.
- Publish the zap and test within ClueKeeper as normal.
