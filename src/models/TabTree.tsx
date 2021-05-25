import TabFragment from "./TabFragment"
const secretToken = Symbol('secretToken');//used to restrict operations to only be performable in the scope pf this file
export default class TabTree {
    head:TreeNode|null = null;
    size:number = 0;

    get navigator() : TreeNavigator|null {
        if (!this.head) return null;
        let current = this.head;
        while (current.left) current = current.left;
        return current.navigator; 
    }

    add(fragment:TabFragment) : TreeNavigator|null {
        if (!this.head) {
            this.head = new TreeNode(this, fragment, null);
            return this.head.navigator;
        }
        let returnVal = this.addFrom(this.head, fragment);
        return returnVal;
    }

    addFrom(subtreeRoot:TreeNode, fragment:TabFragment) : TreeNavigator|null {
        let nearestNode = this.searchNearestNode(subtreeRoot, fragment);
        let newNode = new TreeNode(this, fragment, nearestNode);
        let comp = newNode.compareTo(nearestNode);
        if (comp===0) return null;
        else if (comp<0) nearestNode.setLeft(newNode);
        else nearestNode.setRight(newNode);
        this.rebalance(nearestNode, null);
        this.size++;
        return newNode.navigator;
    }

    remove(fragment:TabFragment) : boolean {
        if (!this.head) return false;
        let detachedNode = this.removeAndReturnDetachedNode(this.head, fragment);
        if (!detachedNode) return false;
        this.rebalance(detachedNode, detachedNode.right ? detachedNode.right : detachedNode.left);
        return true;
    }

    removeFrom(subtreeRoot:TreeNode, fragment:TabFragment) : boolean {
        let node = this.searchNearestNode(subtreeRoot, fragment);
        if (!node) return false;
        let detachedNode = this.removeAndReturnDetachedNode(subtreeRoot, fragment);
        if (!detachedNode) return false;
        //make sure navigator pointing to the removed content is nullified
        node.navigator._nullify(secretToken);

        //make sure that the navigator for the node whose content we used as a replacement now navigates from this node
        //(i.e make sure that )
        detachedNode.navigator._setNode(secretToken, node);
        node._setNavigator(secretToken, detachedNode.navigator);

        return true;
    }

    removeAndReturnDetachedNode(node:TreeNode, fragment:TabFragment) : TreeNode|null {
        let comp = TreeNode.compare(fragment, node);
        if (comp) return null;  //item is not present in tree. (the nearest node to our content is not our content)

        if (!node.right) {
            if (node===this.head) {
                this.head = node.left;
            }else if (node.isLeftChild) {
                node.parent?.setLeft(node.left);
            }else {
                node.parent?.setRight(node.left);
            }

            node.left?.setParent(node.parent);
            this.size--;
            return node;
        }

        let replacement = node.right;
        while (replacement.left) {
            replacement = replacement.left;
        }

        replacement.right?.setParent(replacement.parent);
        if (replacement.isLeftChild) {
            replacement.parent?.setLeft(replacement.right);
        }else {
            replacement.parent?.setRight(replacement.right);
        }
        this.rebalance(replacement, replacement.right ? replacement.right : replacement.left);

        node.content = replacement.content;
        this.size--;
        return replacement;
    }
    

    rebalance(node:TreeNode|null, child:TreeNode|null) : void {
        if (!node || node.balFac===0) return;
        if (node.balFac===-1 || node.balFac===1) {
            if (!node.parent) return;
            this.rebalance(node.parent, node);
        } else {
            this.rotate(node, !child ? 0 : child.balFac);
        }
    }

    rotate(node:TreeNode, childBal:number) {
        if (node.balFac===2 && childBal===1) this.rrRotate(node);
        else if (node.balFac===-2 && childBal===-1) this.llRotate(node);
        else if (node.balFac===2 && childBal===-1) this.lrRotate(node);
        else if (node.balFac===-2 && childBal===1) this.rlRotate(node);
    }

    rlRotate(node:TreeNode) : void {
        const rightChild = node.right;
        node.setRight(node.right?.left);
		node.right?.setParent(node);

		rightChild?.setLeft(node.right?.right);
        rightChild?.left?.setParent(rightChild);

		node.right?.setRight(rightChild);
		node.right?.right?.setParent(node.right);

		this.llRotate(node);
    }
    lrRotate(node:TreeNode) : void {
        const leftChild = node.left;
        node.setLeft(node.left?.right);
		node.left?.setParent(node);

		leftChild?.setRight(node.left?.left);
		leftChild?.right?.setParent(leftChild);

		node.left?.setLeft(leftChild);
		node.left?.left?.setParent(node.left);

		this.rrRotate(node);
    }
    rrRotate(node:TreeNode) : void {
        if (!node.parent) {  //root node
            this.head = node.left;
            this.head?.setParent(null);
        } else {
            if (node.isLeftChild) node.parent.setLeft(node.left);
            else node.parent.setRight(node.left);
            node.left?.setParent(node.parent);
        }

        const leftRightChild = node.left?.right;
        
        node.left?.setRight(node);
        node.setParent(node.left);

        node.setLeft(leftRightChild);
        leftRightChild?.setParent(node);
    }
    llRotate(node:TreeNode) : void {
        if (!node.parent) {
            this.head = node.right;
            this.head?.setParent(null);
        } else {
            if (node.isLeftChild) node.parent.setLeft(node.right);
            else node.parent.setRight(node.right);
            node.right?.setParent(node.parent);
        }

        const rightLeftChild = node.right?.left;

        node.right?.setLeft(node);
        node.setParent(node.right);

        node.setRight(rightLeftChild);
        rightLeftChild?.setParent(node);
    }

    searchNearestNode(node:TreeNode, fragment:TabFragment) : TreeNode {
        let nearestNode = node;
        let comp;
        while(nearestNode!==null) {
            comp = TreeNode.compare(fragment, nearestNode);
            if (comp===0) return nearestNode;
        
            if (comp<0) {
                if (nearestNode.left===null) break;
                nearestNode = nearestNode.left;
            }else if (comp>0) {
                if (nearestNode.right===null) break;
                nearestNode = nearestNode.right;
            }
        }
        return nearestNode;
    }

    inorder() : TabFragment[] {
        let arr:TabFragment[] = [];
        return this.inorderHelper(this.head, arr);
    }

    inorderHelper(subtreeRoot:TreeNode|null, arr:TabFragment[]) : TabFragment[]{
        if (subtreeRoot) {
            this.inorderHelper(subtreeRoot.left, arr);
            arr.push(subtreeRoot.content);
            this.inorderHelper(subtreeRoot.right, arr)
        }
        return arr;
    }
}

class TreeNode {
    #tree:TabTree;
    #parent:TreeNode|null;
    #left:TreeNode|null;
    #right:TreeNode|null;
    #isLeftChild:boolean = false;
    content:TabFragment;

    #height:number = 0;
    balFac:number = 0;

    #navigator:TreeNavigator;

    constructor(tree:TabTree, content:TabFragment, parent:TreeNode|null, left?:TreeNode, right?:TreeNode) {
        this.#tree = tree;
        this.content = content;
        this.#parent = parent;
        this.#left = left || null;
        this.#right = right || null;
        this.updateHeight();
        this.#navigator = new TreeNavigator(this.#tree, this);
    }

    _setNavigator(token:Symbol, navigator:TreeNavigator) {
        if (token===secretToken) this.#navigator = navigator;
        else throw new Error('Method is private');
        
    }

    setLeft(node:TreeNode|null|undefined) {
        if (node===undefined) return;
        this.#left = node;
        if (node) node.#isLeftChild = true;
        this.updateHeight();
    }
    setRight(node:TreeNode|null|undefined) {
        if (node===undefined) return;
        this.#right = node;
        if (node) node.#isLeftChild = false;
        this.updateHeight();
    }
    setParent(node:TreeNode|null|undefined) {
        if (node===undefined) return;
        this.#parent = node;
        this.#parent?.updateHeight();
    }

    get left()   : TreeNode|null { return this.#left }
    get right()  : TreeNode|null { return this.#right }
    get parent() : TreeNode|null { return this.#parent }
    get isLeftChild() : boolean { return this.#isLeftChild; }

    updateHeight() {
        let currentNode:TreeNode|null = this;
        while(currentNode!==null) {
            let newHeight = 1 + Math.max(currentNode.#left===null ? 0 : currentNode.#left.#height, currentNode.#right===null ? 0 : currentNode.#right.#height);
            currentNode.balFac =(currentNode.#left===null ? 0 : currentNode.#left.#height) - (currentNode.#right===null ? 0 : currentNode.#right.#height);
            if (currentNode.#height === newHeight) break;
			currentNode.#height = newHeight;
			currentNode = currentNode.parent;
        }
		if (currentNode!==null && currentNode.parent!==null)
			currentNode.parent.balFac = (currentNode.parent.left===null ? 0 : currentNode.parent.left.#height) - (currentNode.parent.right===null ? 0 : currentNode.parent.right.#height);
    }

    compareTo(node:TreeNode|TabFragment) : number { 
        return this.content.compareTo(node instanceof TreeNode ? node.content : node);
    }
    static compare(item1:TreeNode|TabFragment, item2:TreeNode|TabFragment) : number {
        return item1.compareTo(item2 instanceof TreeNode ? item2.content : item2);
    }

    get navigator() {return this.#navigator}
}

export class TreeNavigator {
    #tree:TabTree;
    #node:TreeNode|null;
    constructor(tree:TabTree, node:TreeNode|TreeNavigator) {
        this.#tree = tree;
        if (node instanceof TreeNavigator) this.#node = node.#node;
        else this.#node = node;
    }

    addAfter(fragment:TabFragment) {
        if (!this.#node) throw new Error("Cannot operate on a node which no longer belongs to its tree");
        this.#tree.addFrom(this.#node, fragment)
    }

    removeNode() {
        if (!this.#node) throw new Error("Cannot operate on a node which no longer belongs to its tree");
        this.#tree.removeFrom(this.#node, this.#node.content);
    }

    _nullify(token:Symbol) {
        if (token===secretToken) this.#node = null;
        else throw new Error('Method is private');
    }
    _setNode(token:Symbol, node:TreeNode) {
        if (token===secretToken) this.#node = node;
        else throw new Error('Method is private');
    }

    get content() { 
        if (!this.#node) throw new Error("Cannot operate on a node which no longer belongs to its tree");
        return this.#node.content 
    }

    next() : TreeNavigator|null {
        if (!this.#node) throw new Error("Cannot operate on a node which no longer belongs to its tree");
        if (!this.#node.right) return this.#node.parent ? this.#node.parent.navigator : null;
        let current = this.#node.right;
        while (current.left) current = current.left;
        return current.navigator;
    }
}