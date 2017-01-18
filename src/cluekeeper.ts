/**
 * Library for communication between ClueKeeper and Zappar 
 * 
 * Installation instructions:
 *   Create a new script in ZapWorks Studio by right clicking on the root node
 *   (or anywhere else in the node hierarchy), then select New-->Script-->blank
 *   Rename the script node from script0 to cluekeeper
 *   Paste the entire contents of this file into your new cluekeeper script.
 * 
 * Usage instructions:
 *   Within your other script files import the CK library by adding this line:
 *     var CK = symbol.nodes.cluekeeper.CK;
 * 
 *   Then you can use CK library methods within your code for example:
 *     CK.submitString("ABC");
 */

interface _MessageToClueKeeper {
    type: string;
    payload?: any;
}

    
export class CK {
    
    /**
     * Returns a unique identifier for the team.
     */
    static getTeamId(): string {
        return CK._getAppData().teamId;
    }
    
    /**
     * Returns true if players can submit a string as a start code or solution.
     * This corresponds to when the submit button is enabled.
     */
    static canSubmit(): boolean {
        return CK._getAppData().canSubmit;
    }
    
    /**
     * Returns true if this clue has been solved.
     */
    static isSolved(): boolean {
        return CK._getAppData().isSolved;
    }
    
    /**
     * Submits a start code or solution to the ClueKeeper app.  The response
     * will be the same as if submitted manually via the submit button.
     */
    static submitString(guess: string): void {
        var payload = {"guess": guess};
        var message:_MessageToClueKeeper = {"type": "SUBMIT_STRING",
                                            "payload": payload};
    	CK._sendMessage(message);
    }
    
    /**
     * Submits a solution to the ClueKeeper app, then launches a new zap if the
     * guess is correct.
     * 
     * If a deepLink for the subsequent zap is not present, the current zap
     * will be relaunched with isSolved() returning true.
     * 
     * This feature is only available for clue solves (not clue starts).
     */
    static submitStringAndRelaunchOnSuccess(guess: string,
                                            deepLink?: string): void {
        deepLink = deepLink || Z.device.deepLinkId();
        var payload = {"guess": guess, "relaunchDeepLink": deepLink};
        var message:_MessageToClueKeeper = {"type": "SUBMIT_STRING",
                                            "payload": payload};
    	CK._sendMessage(message);
    }
    
    /**
     * Closes the zap.
     */
    static close(): void {
        var message:_MessageToClueKeeper = {"type": "CLOSE"};
    	CK._sendMessage(message);
    }
    
    /**
     * Closes the zap and navigates the player to the next appropriate screen,
     * using the same logic as the confirmation dialog presented when a clue is
     * solved. For example, in a linear hunt the next screen is the next clue,
     * while in a scramble the next screen is the clue list.
     *
     * If the clue has not been solved or the hunt is not in progress, this
     * behaves the same as close().
     */
    static closeAndContinue(): void {
        var payload = {"navigate": CK.isSolved()};
        var message:_MessageToClueKeeper = {"type": "CLOSE",
                                            "payload": payload};
    	CK._sendMessage(message);
    }
    
    // Private methods
    private static _appData = null;
    static _getAppData() {
        if (CK._appData == null) {
            CK._appData = {teamId: "", canSubmit: false, isSolved: false};
            var appDataStr = Z.device.appData();
            if (appDataStr) {
                // Done safely to avoid an unpacking error if not present.
                CK._appData = JSON.parse(appDataStr);
            }
        }
        return CK._appData;
    }
    
    static _sendMessage(message: _MessageToClueKeeper): void {
        Z.device.messageHost(JSON.stringify(message));
    }
}
