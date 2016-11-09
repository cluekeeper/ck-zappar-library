/**
 * Library for communication between ClueKeeper and Zappar 
 * 
 * Installation instructions:
 *   Create a new script in ZapWorks Studio by right clicking on the root node,
 *   then select New --> Script --> blank
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
        return CK._appData.teamId;
    }
    
    /**
     * Returns true if players can submit a string as a start code or solution.
     * This corresponds to when the submit button is enabled.
     */
    static canSubmit(): boolean {
        return CK._appData.canSubmit;
    }
    
    /**
     * Submits a start code or solution to the ClueKeeper app.  The response
     * will be the same as if submitted manually via the submit button.
     */
    static submitString(guess: string): void {
        var message:_MessageToClueKeeper = {"type": "SUBMIT_STRING",
                                            "payload": guess};
    	CK._sendMessage(message);
    }
    
    /**
     * Closes the zap.
     */
    static close(): void {
        var message:_MessageToClueKeeper = {"type": "CLOSE"};
    	CK._sendMessage(message);
    }
    
    
    // Private methods
    private static _appData = {teamId: "", canSubmit: false};
    static _initAppData() {
        var hack: any;
        hack = Z.device;
        var appDataStr = hack.appData();
    
        if (appDataStr) {
            // Done safely to avoid an unpacking error if not present.
            CK._appData = JSON.parse(hack.appData());
        }
    }
    
    static _sendMessage(message: _MessageToClueKeeper): void {
        Z.device.messageHost(JSON.stringify(message));
    }
}

parent.on("show", CK._initAppData);
