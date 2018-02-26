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
 *     const CK = symbol.nodes.cluekeeper.CK;
 *
 *   Then you can use CK library methods within your code for example:
 *     CK.submitString("ABC");
 */

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
     * Returns the context (i.e. clue start, clue content, hunt start, etc.) and
     * corresponding state in which this zap was launched.
     *
     * See the LaunchContext interface below for details.
     */
    static getLaunchContext(): CK.LaunchContext {
        var launchContextType = CK.LaunchContextType.NONE;
        switch (CK._getAppData().launchContextType) {
            case "NONE":
                launchContextType = CK.LaunchContextType.NONE;
                break;
            case "HUNT_START":
                launchContextType = CK.LaunchContextType.HUNT_START;
                break;
            case "CLUE_START":
                launchContextType = CK.LaunchContextType.CLUE_START;
                break;
            case "CLUE_CONTENT":
                launchContextType = CK.LaunchContextType.CLUE_CONTENT;
                break;
            case "PREMETA_CONTENT":
                launchContextType = CK.LaunchContextType.PREMETA_CONTENT;
                break;
        }
        var launchContext: CK.LaunchContext = {
            type: launchContextType
        };
        const launchContextKey = CK._getAppData().launchContextKey;
        if (launchContextKey == CK.getHuntState()._key) {
            launchContext.state = CK.getHuntState();
            return launchContext;
        } else {
            for (var clueState of CK.getClueStates()) {
                if (launchContextKey == clueState._key) {
                    launchContext.state = clueState;
                    return launchContext;
                }
                if (clueState.miniStates) {
                    for (var miniState of clueState.miniStates) {
                        if (launchContextKey == miniState._key) {
                            launchContext.state = miniState;
                            return launchContext;
                        }
                    }
                }
            }
        }
        return launchContext;
    }

    /**
     * Returns a ClueState object representing the hunt state.
     *
     * See the ClueState interface below for details.
     */
    static getHuntState(): CK.ClueState {
        return CK._getAppData().huntState;
    }

    /**
     * Returns an array of ClueState objects. The objects in the array will be
     * in the same order as the default clue order for the hunt.
     *
     * See the ClueState interface below for details.
     */
    static getClueStates(): CK.ClueState[] {
        return CK._getAppData().clueStates;
    }

    /**
     * Plays a sound to get the user's attention. This is the same sound used
     * when a new message becomes available, a clue opens, or a clue nears
     * expiration.
     */
    static playAlertSound(): void {
        CK._playSound(_SoundId.ALERT);
    }

    /**
     * Plays the sound used to indicate that a clue or the hunt has expired.
     */
    static playExpireSound(): void {
        CK._playSound(_SoundId.EXPIRE);
    }

    /**
     * Plays the sound used to indicate that a new free hint is available.
     */
    static playHintSound(): void {
        CK._playSound(_SoundId.HINT);
    }

    /**
     * Plays the sound used to indicate that a clue was solved successfully.
     */
    static playSolveSound(): void {
        CK._playSound(_SoundId.SOLVE);
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
     * Note: This feature is experimental and likely to change!
     *
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
     * Shows a standard system dialog using the given title and message.
     * Both title and message are interpreted as HTML.
     */
    static showInfoDialog(title: string, text: string): void {
        var payload = {"title": title, "message": text};
        var message:_MessageToClueKeeper = {"type": "SHOW_INFO_DIALOG",
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
            CK._appData = {
                teamId: "",
                canSubmit: false,
                isSolved: false,
                launchContextKey: "",
                launchContextType: CK.LaunchContextType.NONE,
                huntState: {},
                clueStates: []
            };
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

    static _playSound(soundId: _SoundId): void {
        var payload = {"soundId": soundId};
        var message:_MessageToClueKeeper = {"type": "PLAY_SOUND",
                                            "payload": payload};
        CK._sendMessage(message);
    }
}

interface _MessageToClueKeeper {
    type: string;
    payload?: any;
}

enum _SoundId {
    ALERT = 0,
    EXPIRE = 1,
    HINT = 2,
    SOLVE = 3,
}

export namespace CK {

    /**
     * This interface represents the state of a given clue (or hunt).
     *
     * See getClueStates() (or getHuntState()).
     */
    export interface ClueState {
        _key: string;
        title: string;
        isStarted: boolean;
        isInProgress: boolean;
        isSolved: boolean;
        isFinished: boolean;
        miniStates?: ClueState[];
    }

    /**
     * This enum represents the possible contexts from which a zap can be
     * launched.
     */
    export enum LaunchContextType {
        NONE,
        HUNT_START,
        CLUE_START,
        CLUE_CONTENT,
        PREMETA_CONTENT
    }

    /**
     * This interface represents the launch context and state from which a zap
     * was launched.
     *
     * See getLaunchContext().
     */
    export interface LaunchContext {
        type: LaunchContextType;
        state?: ClueState;
    }
}
