import TabTree from "./TabTree";
import {TreeNavigator} from "./TabTree";
import {DiffMatchPatch} from "diff-match-patch-typescript";
import TabFragment from "./TabFragment";
import TabRange from "../utils/TabRange";

type Diff = ReturnType<DiffMatchPatch["diff_main"]>[0];
export default class Model {
    #newText:string = "";
    #textState:string = "";
    #tree:TabTree;

    updateInterval = 500;
    
    #isActive:boolean = false;
    #interruptFlag:boolean = false;

    constructor() {
        this.#tree = new TabTree();
    }

    get isActive() { return this.#isActive }
    update(newText:string) {
        this.#isActive = true;
        this.#newText = newText;
        let tokens = this.getParseTokens();
        if (tokens) this.#textState = this.parse(tokens).newText;
        this.#isActive = false;
    }



    getParseTokens() :ParseToken[]|null {
        let navigator:TreeNavigator|null = this.#tree.navigator;
        if (!navigator) {   //the TabTree is empty. our model has nothing
            return [{
                itemsToRemove: [],
                position:0,
                content: this.#newText,
                isDirty:true,
                addAfterNav:null,
                diffs:[]
            }]
        }

        let parseTokens:ParseToken[] = [];
        let textDiffs = new DiffMatchPatch().diff_main(this.#textState, this.#newText);
        
        let emptyDiffArr:Diff[] = []
        let diffNav = {
            curr: textDiffs[0],
            currDiffIxd: 0,
            oldTextIdx:  0,
            newTextIdx:  0,
            textCollector: "",
            diffCollector:emptyDiffArr,
            next(customNext?:Diff) {
                this.diffCollector.push(this.curr);
                this.textCollector += this.curr[0]>=0 ? this.curr[1] : "";
                this.oldTextIdx += this.curr[0]===0 ? this.curr[1].length : 0;
                this.newTextIdx += this.curr[0]===0 ? this.curr[1].length : this.curr[0]*this.curr[1].length;
                this.curr = customNext || textDiffs[++this.currDiffIxd];
            },
            splitAt(idx:number) {
                //we will not split additions because we are splitting based on the old text and addition is at a single point from the reference of the old text
                if (this.curr[0]===1) throw new Error('Cannot split additions to a text'); 
                //cut in two
                let splitIdx = this.oldTextIdx-idx;

                //we have a certain size of text that this current diff contains. we cannot split past the range of that text
                if (splitIdx<0 || splitIdx>this.oldTextIdx+this.curr[1].length) throw new Error('Diff split range out of bounds');

                let firstHalf = this.curr[1].substring(0, splitIdx);
                let secondHalf = this.curr[1].substring(splitIdx);
                this.curr = [this.curr[0], firstHalf];
                this.next([this.curr[0], secondHalf]);
                return true;
            },
            emptyCollectors() {
                this.diffCollector = [];
                this.textCollector = "";
            },
            overlaps(treeNodeNav:TreeNavigator) : boolean {
                //since we are performing operations based on the old text, an addition never covers a range of the original text. An addition is always made on a single point.
                let range;
                if (this.curr[0]===1) range = this.oldTextIdx;
                else range = new TabRange(this.oldTextIdx, this.oldTextIdx+this.curr[1].length);
                return treeNodeNav.content.compareTo(range, true)===0;
            },
            overflows(treeNodeNav:TreeNavigator) : boolean {
                let overlaps = this.overlaps(treeNodeNav);
                //since we are performing operations based on the old text, an addition never covers a range of the original text.
                //An addition is always made on a single point. so it can never be partially within the treeNodeNav and partially outside
                if (overlaps && this.curr[0]===1) return false;

                let diffEndIdx = this.oldTextIdx+this.curr[1].length;
                let diffPartiallyOut = treeNodeNav.content.compareTo(diffEndIdx,true)===-1;
                return overlaps && diffPartiallyOut;
            }
        }
        let emptyTreeNavArr:TreeNavigator[] = [];
        let parseTokenBuilder = {
            diffNav:          diffNav,
            itemsToRemove:    emptyTreeNavArr,
            changeFound:      false,
            currentFragNode: navigator,
            lastUnchangedFragNode:navigator,

            get currentDiff() { return this.diffNav.curr; },

            collectDiff() {
                this.changeFound = this.diffNav.curr[0]!==0;
                this.diffNav.next();
            },

            getNextFragNode() : TreeNavigator|null {
                let currentFragNode = this.currentFragNode.next();
                if (currentFragNode) this.currentFragNode = currentFragNode;
                return currentFragNode;
            },
            
            splitDiff() {
                let splitIdx = this.currentFragNode.content.position-this.diffNav.oldTextIdx;
                this.diffNav.splitAt(splitIdx);
            },

            getToken() {
                return {
                    itemsToRemove: this.itemsToRemove,
                    position:this.diffNav.newTextIdx,
                    content: this.diffNav.textCollector,
                    isDirty:this.changeFound,
                    addAfterNav:this.lastUnchangedFragNode,
                    diffs:this.diffNav.diffCollector
                };
            },
            
            submitToken(customToken?:ParseToken) : boolean {
                parseTokens.push(
                    customToken || this.getToken()
                );
                this.changeFound = false;
                this.itemsToRemove = [];
                this.lastUnchangedFragNode = this.currentFragNode;
                this.diffNav.emptyCollectors();
                return true;
            },
            
            diffOverlapping() {
                return this.diffNav.overlaps(this.currentFragNode);
            },

            diffOverflowing() {
                return this.diffNav.overflows(this.currentFragNode);
            }
        }

        while (parseTokenBuilder.getNextFragNode()) {
            while(!parseTokenBuilder.diffOverlapping()) {
                parseTokenBuilder.collectDiff();
            }
            parseTokenBuilder.splitDiff();
            let tokenAtInitialSplit = parseTokenBuilder.getToken();
            let criticalOverlap = false;
            while(!parseTokenBuilder.diffOverflowing()) {
                if (parseTokenBuilder.currentDiff[0]!==0) {
                    criticalOverlap = true;
                }
                parseTokenBuilder.collectDiff();
            }
            parseTokenBuilder.splitDiff();

            if (!criticalOverlap) {
                if (parseTokenBuilder.changeFound) {
                    parseTokenBuilder.submitToken(tokenAtInitialSplit);
                }
                parseTokenBuilder.submitToken();
            }
        }
        parseTokenBuilder.submitToken();
        return parseTokens;
    }

    parse(tokens:ParseToken[]) : {newText:string, parsedTokens:ParseToken[]} {
        let parsedTokens:ParseToken[] = [];

        let prevToken:ParseToken = {
            itemsToRemove: [],
            position: 0,
            content: "",
            isDirty:false,
            addAfterNav: null,
            diffs: []
        };
        let lastIdxUpdatedNav:TreeNavigator|null = prevToken.addAfterNav || this.#tree.navigator;
        let lastAddedNav:TreeNavigator|null;
        let textState = "";
        let indexOffset = 0;

        let token;
        for (let i=0; i<tokens.length; i++) {
            token = tokens[i];
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

            this.offsetTreeIdx(indexOffset, lastIdxUpdatedNav?.next());
            indexOffset = 0;
            lastAddedNav = this.parseAndAddFragments(token)
            if (lastAddedNav) {
                parsedTokens.push(token);
                lastIdxUpdatedNav = lastAddedNav;
            }
            indexOffset += token.content.length;
            prevToken = token;
        }
        let offsetFrom = lastIdxUpdatedNav?.next();
        if (offsetFrom) this.offsetTreeIdx(indexOffset, offsetFrom);

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

    parseAndAddFragments(token:ParseToken) : TreeNavigator|null {
        let lastAddedNav:TreeNavigator|null = null;
        let startIdx = token.position;
        const regexp = new RegExp('([\n\r]{2}|^)([^\n\r]+([\n\r]|$))+([\n\r]|(?<=$))','g');
        const matches = token.content.matchAll(regexp);

        for (const match of matches) {
            let fragment = new TabFragment(match[0], startIdx+match.index!);
            if (token.addAfterNav) {
                lastAddedNav = token.addAfterNav.addAfter(fragment)
            }else {
                lastAddedNav = this.#tree.add(fragment);
            }
        }
        return lastAddedNav;
    }

    uncache() {
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
    addAfterNav:TreeNavigator|null,
    diffs:Diff[]
}