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
    #updateNext:string|null = null;

    updateInterval = 500;
    
    #isActive:boolean = false;
    #interruptFlag:boolean = false;

    constructor() {
        this.#tree = new TabTree();
        
    }

    get tree() { return this.#tree }

    get isActive() { return this.#isActive }
    async update(newText:string) {
        if (this.#textState===newText) return;
        if (this.#isActive) {
            this.#interruptFlag = true;
            this.#updateNext = newText;
            return;
        }
        this.#isActive = true;
        this.#newText = newText;
        //console.log(this.#newText);
        let tokens = this.getParseTokens();
        if (tokens) this.#textState = this.parse(newText, tokens).textState;
        //console.log(this.tree.inorder());
        this.#isActive = false;
        this.#interruptFlag = false;
        // if (this.#updateNext) {
        //     let text = this.#updateNext;
        //     this.#updateNext = null;
        //     this.update(text);
        // }
    }

    getParseTokensDebug(text:string) : string {
        let textDiffsDebug = new DiffMatchPatch().diff_main(this.#textState, this.#newText);
        console.log(textDiffsDebug);
        return text;
    }

    getParseTokens() :ParseToken[]|null {
        let navigator:TreeNavigator|null = this.#tree.navigator;
        if (!navigator) {   //the TabTree is empty. our model has nothing
            return [{
                itemsToRemove: [],
                position:      0,
                oldPosition:   0,
                content:       this.#newText,
                oldContent:    this.#textState,
                isDirty:       true,
                diffs:         [],
                addAfter:      null
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
            oldTextCollector: "",
            diffCollector:emptyDiffArr,
            next(customNext?:Diff) : boolean {
                this.diffCollector.push(this.curr);
                this.textCollector += this.curr[0]>=0 ? this.curr[1] : "";
                this.oldTextCollector += this.curr[0]<=0 ? this.curr[1] : "";
                this.oldTextIdx += this.curr[0]<=0 ? this.curr[1].length : 0;
                this.newTextIdx += this.curr[0]>=0 ? this.curr[1].length : 0;
                this.curr = customNext || textDiffs[++this.currDiffIxd];
                return !!this.curr;
            },
            splitAt(idx:number) : boolean {
                //we have a certain size of text that this current diff contains. we cannot split past the range of that text
                if (idx<=0 || idx>this.curr[1].length) return false;

                //we will not split additions because we are splitting based on the old text and addition is at a single point from the reference of the old text
                if (this.curr[0]===1) return false;


                let firstHalf = this.curr[1].substring(0, idx);
                let secondHalf = this.curr[1].substring(idx);
                this.curr = [this.curr[0], firstHalf];
                this.next([this.curr[0], secondHalf]);
                return true;
            },
            emptyCollectors() {
                this.diffCollector = [];
                this.textCollector = "";
                this.oldTextCollector = "";
            },
            overlaps(treeNodeNav:TreeNavigator) : boolean {
                //since we are performing operations based on the old text, an addition never covers a range of the original text. An addition is always made on a single point.
                let range;
                if (this.curr[0]===1) range = this.oldTextIdx;
                else range = new TabRange(this.oldTextIdx, this.oldTextIdx+this.curr[1].length-1);
                return treeNodeNav.content.compareTo(range, true)===0;
            },
            overflows(treeNodeNav:TreeNavigator) : boolean {
                if (!this.curr) return true;    //in this case, you are at the end. no more diffs.  this means it always is defined as overflowing because it comes after the treeNodeNav
                let overlaps = this.overlaps(treeNodeNav);
                //since we are performing operations based on the old text, an addition never covers a range of the original text.
                //An addition is always made on a single point. so it can never be partially within the treeNodeNav and partially outside
                if (overlaps && this.curr[0]===1) return false;

                let diffEndIdx = this.oldTextIdx+this.curr[1].length-1;
                let diffPartiallyOut = treeNodeNav.content.compareTo(diffEndIdx,true)<0;
                return diffPartiallyOut;
            }
        }
        let emptyTreeNavArr:TreeNavigator[] = [];
        let parseTokenBuilder = {
            diffNav:          diffNav,
            itemsToRemove:    emptyTreeNavArr,
            changeFound:      false,
            currentFragNode:  navigator,
            lastUnchangedFragNode:navigator,
            outOfDiffs:       false,
            outOfFrags:       false,
            overlapping:      false,
            criticalOverlap:  false,
            currentPosition:  0,
            oldTextPosition: 0,

            get currentDiff() { return this.diffNav.curr; },

            collectDiff() {
                this.changeFound = this.changeFound || this.diffNav.curr[0]!==0;
                this.criticalOverlap = this.criticalOverlap || (this.overlapping && this.diffNav.curr[0]!==0);
                this.outOfDiffs = !this.diffNav.next();
            },

            resetOverlapFlag(bool:boolean) {
                this.criticalOverlap = false;
                this.overlapping = bool;
            },

            getNextFragNode() : TreeNavigator|null {
                if (this.criticalOverlap) this.itemsToRemove.push(this.currentFragNode);
                let nextFragNode = this.currentFragNode.next();
                if (nextFragNode) this.currentFragNode = nextFragNode;
                this.outOfFrags = !nextFragNode;
                return nextFragNode;
            },
            
            splitDiff(splitAtFragEnd?:boolean) {
                if (!this.diffNav.curr) return;
                let fragSplitPosition = this.currentFragNode.content.position;
                if (splitAtFragEnd) {
                    fragSplitPosition += this.currentFragNode.content.length;
                }
                let splitIdx =  fragSplitPosition-this.diffNav.oldTextIdx;
                let diffType = this.diffNav.curr[0];
                if (!this.diffNav.splitAt(splitIdx)) return;
                this.changeFound = this.changeFound || diffType!==0;
                this.criticalOverlap = this.criticalOverlap || (this.overlapping && this.diffNav.curr[0]!==0);
                if (!this.diffNav.curr) this.outOfDiffs = true;
            },

            extractTokenState() : ParseToken {
                let addAfter;
                //i cannot set lastUnchangedFragNode to initially start out as null because typescript complains.
                //so the following line handles the edge case that the very first fragment (at the head of the tree) is actually changed 
                //but it is stored as lastUnchangedFragNode.
                //this works because if you claim that you were unchanged, you shouldn't have been marked for removal.
                if (this.lastUnchangedFragNode === this.itemsToRemove[0]) {
                    addAfter = null;
                }else {
                    addAfter = this.lastUnchangedFragNode;
                }
                let tokenState =  {
                    itemsToRemove: this.itemsToRemove,
                    position:this.currentPosition,
                    oldPosition:this.oldTextPosition,
                    content:this.diffNav.textCollector,
                    oldContent: this.diffNav.oldTextCollector,
                    isDirty:this.changeFound,
                    diffs:this.diffNav.diffCollector,
                    addAfter:addAfter,
                };
                this.currentPosition += tokenState.content.length;
                this.oldTextPosition += tokenState.oldContent.length;
                this.diffNav.emptyCollectors();
                this.itemsToRemove = [];
                return tokenState;
            },

            restoreExtractedToken(tokenState:ParseToken) {
                this.currentPosition -= tokenState.content.length;
                this.oldTextPosition -= tokenState.oldContent.length;
                this.diffNav.textCollector = tokenState.content + this.diffNav.textCollector;
                this.diffNav.oldTextCollector = tokenState.oldContent + this.diffNav.oldTextCollector;
                this.diffNav.diffCollector = [...tokenState.diffs,...this.diffNav.diffCollector];
                this.itemsToRemove = [...tokenState.itemsToRemove, ...this.itemsToRemove]
            },
            
            submitToken(customToken?:ParseToken) : boolean {
                let token = customToken || this.extractTokenState();
                parseTokens.push(token);
                
                this.changeFound = false;
                if (customToken) return true;

                this.lastUnchangedFragNode = this.currentFragNode;
                return true;
            },
            
            diffOverlapping() {
                return this.diffNav.overlaps(this.currentFragNode);
            },

            diffOverflowing() {
                return this.diffNav.overflows(this.currentFragNode);
            }
        }

        do {
            parseTokenBuilder.resetOverlapFlag(false);
            while(!parseTokenBuilder.diffOverlapping()) {
                parseTokenBuilder.collectDiff();
                if (parseTokenBuilder.outOfDiffs) break;
            }
            parseTokenBuilder.resetOverlapFlag(true);

            parseTokenBuilder.splitDiff();
            let savedTokenState = parseTokenBuilder.extractTokenState();
            while(!parseTokenBuilder.diffOverflowing()) {
                parseTokenBuilder.collectDiff();
                if (parseTokenBuilder.outOfDiffs) break;
            }
            parseTokenBuilder.splitDiff(true);

            if (parseTokenBuilder.criticalOverlap) {
                parseTokenBuilder.restoreExtractedToken(savedTokenState);
            }else {
                parseTokenBuilder.submitToken(savedTokenState);
                parseTokenBuilder.submitToken();
            }
            parseTokenBuilder.getNextFragNode()
        } while(!parseTokenBuilder.outOfFrags);
        if (!parseTokenBuilder.outOfFrags) throw new Error("Your logic is wrong, dummy! either it actually is possible for a fragment to remain after the diffs run out, or your logic is still correct but not implemented correctly.");
        while (!parseTokenBuilder.outOfDiffs) {
            parseTokenBuilder.collectDiff();
        }
        parseTokenBuilder.submitToken();
        return parseTokens;
    }

    parse(originText:string, tokens:ParseToken[]) : {textState:string, parsedTokens:ParseToken[]} {
        let parsedTokens:ParseToken[] = [];

        let lastAddedNode:TreeNavigator|null = null;
        let lastIdxUpdatedNode:TreeNavigator|null = null;

        let textState = "";
        let indexOffset = 0;

        let token;
        for (let i=0; i<tokens.length; i++) {
            token = tokens[i];
            textState += token.content;
            if (lastAddedNode && token.addAfter) {
                lastIdxUpdatedNode = lastAddedNode.content.position>token.addAfter.content.position ? lastAddedNode : token.addAfter;
            }else {
                lastIdxUpdatedNode = lastAddedNode || token.addAfter;
            }
            if (this.#interruptFlag || !token.isDirty) continue;

            indexOffset += token.content.length-token.oldContent.length;
            for (let item of token.itemsToRemove) {
                item.removeNode();
            }
            if (token.content==="") {   //nothing to add to the tree
                parsedTokens.push(token);  //fragments were removed and 
                continue;
            }

            //--------if token is undefined (end of document) or we are adding items to the tree, update the indices of the whole tree starting from the last unupdated point.

            this.offsetTreeIdx(indexOffset, token.position, lastIdxUpdatedNode?.next()||null);
            indexOffset = 0;
            lastAddedNode = this.parseAndAddFragments(originText, token, lastIdxUpdatedNode);
            if (!!lastAddedNode) {
                parsedTokens.push(token);
            }
        }
        if (token) {
            this.offsetTreeIdx(indexOffset, token.position, lastIdxUpdatedNode?.next()||null);
        }

        this.#interruptFlag = false;

        return {textState:textState, parsedTokens:parsedTokens}
    }

    offsetTreeIdx(offset:number, afterIndex:number, startNav:TreeNavigator|null) {
        if (!startNav || !offset) return;
        let nav:TreeNavigator|null = startNav;
        while (nav) {
            if (nav.content.position>afterIndex) {
                nav.content.position+=offset;
                if (nav.content.position<0) nav.content.position = 0;
            }
            nav = nav.next();
        }
    }

    parseAndAddFragments(originText:string, token:ParseToken, addAfterMe?:TreeNavigator|null) : TreeNavigator|null {
        let startIdx = token.position;
        const regexp = /(?<=(\n *\n)|(^( *\n)?))(( *\S)+ *\n)*(( *\S)+ *)(?=(\n *\n)|((\n *)?$))/g;
        let matches = token.content.matchAll(regexp);

        let lastAddedNode:TreeNavigator|null = null;
        for (const match of matches) {
            let fragment = new TabFragment(originText, match[0], startIdx+match.index!);
            //console.log(`want to add:\n${fragment.content}`);
            if (!!lastAddedNode) {
                lastAddedNode = lastAddedNode.addAfter(fragment)
            }else if (addAfterMe) {
                lastAddedNode = addAfterMe.addAfter(fragment)
            }else {
                lastAddedNode = this.#tree.add(fragment);
            }
        }
        return lastAddedNode;
    }

    uncache() {
        this.#textState = "";
        this.#newText = "";
    }
}

type ParseToken = {
    itemsToRemove:TreeNavigator[]
    position:number
    oldPosition:number
    content:string
    oldContent:string
    isDirty:boolean
    diffs:Diff[]
    addAfter:TreeNavigator|null
}