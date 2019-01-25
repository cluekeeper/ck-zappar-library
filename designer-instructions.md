# Simple Communication with ClueKeeper Using ZapWorks Designer

In general, to make your zaps communicate with the ClueKeeper app, we recommend the use of ZapWorks Studio with the full ck-zappar-library described [here](https://raw.githubusercontent.com/cluekeeper/ck-zappar-library/master/README.md), but if you just want to achieve some simple tasks like submitting an answer, closing your zap, or playing a sound, these are now possible with ZapWorks Designer.

## General Instructions
- In ZapWorks Designer, when adding an action to one of your objects, choose "Host message app" from the "On Tap" menu, then you simply need to fill the Message field with a format that ClueKeeper understands.  We provide several examples here of things you can do.  Other more advanced actions are possible and can be inferred from the source code [here](https://raw.githubusercontent.com/cluekeeper/ck-zappar-library/master/src/cluekeeper.ts), but the more advanced actions are probably better suited for use in ZapWorks Studio since you'd want to use them with more logic around their invocations.

## Supported Actions
| Action | Message Format |
|:--- |:--- |
| Submit a start code or solution to the ClueKeeper app.  The response will be the same as if submitted manually via the submit button. | `{"type": "SUBMIT_STRING","payload": "YOUR CUSTOM ANSWER"}` |
| Show a standard system dialog using the given title and message. Both title and message are interpreted as HTML. | `{"type": "SHOW_INFO_DIALOG","payload": {"title": "Custom Dialog Title", "message": "Custom Dialog Message"}}` |
| Close the zap. | `{"type": "CLOSE"}` |
| Play a sound to get the user's attention. This is the same sound used when a new message becomes available, a clue opens, or a clue nears expiration. | `{"type": "PLAY_SOUND","payload": {"soundId": "0"}}` |
| Play the sound used to indicate that a clue or the hunt has expired. | `{"type": "PLAY_SOUND","payload": {"soundId": "1"}}` |
| Play the sound used to indicate that a new free hint is available. | `{"type": "PLAY_SOUND","payload": {"soundId": "2"}}` |
| Play the sound used to indicate that a clue was solved successfully. | `{"type": "PLAY_SOUND","payload": {"soundId": "3"}}` |


