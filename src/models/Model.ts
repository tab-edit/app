import TabTree from "./TabTree";
import {TreeNavigator} from "./TabTree";
import {DiffMatchPatch} from "diff-match-patch-typescript";
import TabFragment from "./TabFragment";

type Diff = ReturnType<DiffMatchPatch["diff_main"]>[0];
export default class Model {
    #oldText:string = "";
    #newText:string = "";
    #textState:string = "";
    #tree:TabTree;
    static last:Model|null = null

    updateInterval = 500;
    
    #isActive:boolean = false;
    #interruptFlag:boolean = false;

    constructor() {
        this.#tree = new TabTree();
    }

    get isActive() { return this.#isActive }
    update(newText:string) {
        console.log(Model.last===this)
        Model.last = this;
        this.#isActive = true;
        this.#newText = newText;

        let res;
        let tokens = this.getParseTokens();
        if (tokens) res = this.parse(tokens);

        this.#isActive = false;
        return res;   //for debug purposes
    }

    //only returns null when interrupted
    getParseTokens() : ParseToken[]|null {
        let navigator = this.#tree.navigator;
        if (!navigator) {   //the TabTree is empty. our model has nothing
            return [{
                itemsToRemove: [],
                position:0,
                content: this.#newText,
                isDirty:true,
                addAfterNav:null
            }]
        }
        const diff = new DiffMatchPatch();
        let textDiffs = diff.diff_main(this.#textState, this.#newText);

        let parseTokens:ParseToken[] = [];
        
        let oldTextIndexTracker = 0;
        let newTextIndexTracker = 0;
        let currentTreeNav:TreeNavigator|null = new TreeNavigator(this.#tree, navigator);
        let prevTreeNav:TreeNavigator|null = null;
        let treeContentsToRemove:TreeNavigator[] = []


        let nextDiffIdx = 0;
        let currentDiff = textDiffs[nextDiffIdx++];
        let currentDiffChain:Diff[] = [];
        let currentTextChain:string = "";
        let unhandledOverlap = false;
        let changeFound = false;

        parseLoop:
        while (currentTreeNav && currentDiff) {
            if (this.#interruptFlag) {
                this.#interruptFlag = false;
                return null;
            }

            let comp:number = 0;
            //-----------Comparison section: comparing the diff and the currentTreeNav. returns 0 if a change overlaps with currentTreeNav -----------------
            let compDiffStart;   //comparing the position of this currentTreeNav to the position where the diff starts
            let compDiffEnd;
            compDiffStart = currentTreeNav.content.compareTo(oldTextIndexTracker);
            
            //if this diff starts before the currentTreeNav and the diff is a removal, the only case when the diff doesn't overlap with the node is if the diff also ends before the currentTreeNav.
            if (compDiffStart>0 && currentDiff[0]===-1) {   //currentTreeNav comes after the diff's start and diff is a removal
                compDiffEnd =currentTreeNav.content.compareTo(oldTextIndexTracker+currentDiff[1].length);
                if (compDiffEnd<0) comp = compDiffStart;    //currentTreNav comes after diff ends
                else comp = 0;  //we either partially or wholly removed the text that initially made up currentTreeNav
            }else comp = compDiffStart;
            //---------------------------------------------------------------------------------------------------------------------------

            while (currentDiff && comp>0) {    //while we have a diff and currentTreeNav is ahead of the current diff
                currentDiffChain.push(currentDiff);
                currentTextChain += currentDiff[0]>=0 ? currentDiff[1] : "";
                oldTextIndexTracker += currentDiff[0]===0 ? currentDiff[1].length : 0;
                newTextIndexTracker += currentDiff[0]===0 ? currentDiff[1].length : currentDiff[0]*currentDiff[1].length;
                changeFound = currentDiff[0]!==0;
                currentDiff = textDiffs[nextDiffIdx++];
                if (!currentDiff) break parseLoop;

                //----------Comparison section: read comments in comoparison section above for explanation----------
                compDiffStart = currentTreeNav.content.compareTo(oldTextIndexTracker);

                if (compDiffStart>0 && currentDiff[0]===-1) {   //currentTreeNav comes after the diff's start and diff is a removal
                    compDiffEnd =currentTreeNav.content.compareTo(oldTextIndexTracker+currentDiff[1].length);
                    if (compDiffEnd>0) comp = 0;
                    else comp = compDiffStart;
                }else comp = compDiffStart;
                //--------------------------------------------------------------------------------------------------
            }

            unhandledOverlap = comp===0 && currentDiff[0]!==0;
            if (!unhandledOverlap) {
                parseTokens.push({
                    itemsToRemove: treeContentsToRemove,
                    position:newTextIndexTracker,
                    content: currentTextChain,
                    isDirty:changeFound,
                    addAfterNav:prevTreeNav
                });
                currentTextChain = "";
                currentDiffChain = [];
                treeContentsToRemove = [];
                prevTreeNav = currentTreeNav;
                changeFound = false;
            }else {
                treeContentsToRemove.push(currentTreeNav);
            }
            currentTreeNav = currentTreeNav.next();
            
            //overlap is defined as when the oldTextIndexTracker value at the time the diff is explored overlaps with the node
            //if diff overlaps node, parse what you have and store to usedDiffs
            //if diff is ahead of navigator, parse what you have and store to usedDiffs
            //if overlaps, get the last diff that overlaps with it and check if it also overlaps with the next TreeNode. if so, repeat the same overlap logic (get last overlapping diff, etc...) with the next TreeNode until you either run out of diffs or you have a node that didnt overlap. remove all the nodes you collected in this process that overlapped and create a new parseToken with a string starting from the end position of the initial non-overlap before this chain of overlaps, till the start position of the last non-overlap which ended this chain of overlaps.
        }
        if (!currentDiff) return parseTokens;
        while (currentDiff) {    //while this node is ahead of the current diff and there is no ongoing overlap
            currentDiffChain.push(currentDiff);
            currentTextChain += currentDiff[0]>=0 ? currentDiff[1] : "";
            oldTextIndexTracker += currentDiff[0]===0 ? currentDiff[1].length : 0;
            newTextIndexTracker += currentDiff[0]===0 ? currentDiff[1].length : currentDiff[0]*currentDiff[1].length;
            changeFound = currentDiff[0]!==0;
            currentDiff = textDiffs[nextDiffIdx++];
        }
        parseTokens.push({
            itemsToRemove: treeContentsToRemove,
            position:newTextIndexTracker,
            content: currentTextChain,
            isDirty:changeFound||unhandledOverlap,
            addAfterNav:prevTreeNav
        });
        return parseTokens;
    }

    parse(tokens:ParseToken[]) : {newText:string, parsedTokens:ParseToken[]} {
        let parsedTokens:ParseToken[] = [];

        let prevToken:ParseToken = {
            itemsToRemove: [],
            position: 0,
            content: "",
            isDirty:false,
            addAfterNav: null
        };
        let lastIdxUpdatedToken:ParseToken = prevToken;
        let textState = "";
        let indexOffset = 0;
        for (let i=0; i<tokens.length; i++) {
            let token = tokens[i];
            textState += token.content;
            if (this.#interruptFlag || !token.isDirty) continue;

            for (let item of token.itemsToRemove) {
                indexOffset -= item.content.length;
                item.removeNode();
            }
            if (token.content==="") {   //nothing to add to the tree
                parsedTokens.push(token);  //fragments were removed and 
                continue;
            }

            //--------if token is undefined (end of document) or we are adding items to the tree, update the indices of the whole tree starting from the last unupdated point.

            this.offsetTreeIdx(indexOffset, lastIdxUpdatedToken.addAfterNav?.next());
            lastIdxUpdatedToken = token;
            indexOffset = 0;
            if (this.parseAndAddFragments(token)) {
                parsedTokens.push(token);
            }
            indexOffset += token.content.length;
            prevToken = token;
        }
        this.offsetTreeIdx(indexOffset, lastIdxUpdatedToken.addAfterNav?.next());

        this.#interruptFlag = false;

        return {newText:textState, parsedTokens:parsedTokens}
    }

    offsetTreeIdx(offset:number, startNav:TreeNavigator|null|undefined) {
        let nav = startNav || this.#tree.navigator;
        while (nav) {
            nav.content.position+=offset;
            nav = nav.next();
        }
    }

    parseAndAddFragments(token:ParseToken) : boolean {
        let fragmentAdded = false;
        let startIdx = token.position;
        const regexp = new RegExp('([\n\r]{2}|^)([^\n\r]+([\n\r]|$))+([\n\r]|(?<=$))','g');
        const matches = token.content.matchAll(regexp);

        for (const match of matches) {
            let fragment = new TabFragment(match[0], startIdx+match.index!);
            if (token.addAfterNav) {
                token.addAfterNav.addAfter(fragment)
            }else {
                this.#tree.add(fragment);
            }
            fragmentAdded = true;
        }
        return fragmentAdded;
    }

    uncache() {
        this.#oldText = "";
        this.#textState = "";
        this.#newText = "";
    }
    interrupt() {
        if (!this.#isActive) return;
        this.#interruptFlag = true;
    }
}

type ParseToken = {
    itemsToRemove:TreeNavigator[],
    position:number
    content:string
    isDirty:boolean
    addAfterNav:TreeNavigator|null
}