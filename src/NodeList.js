export class NodeList {
    constructor(idGenerator) {
        this.idGenerator = idGenerator;
        this.nodes = [];
        this.selectedNode = null;
        this.selectedNodes = [];
    }

    addNode(x, y) {
        if (this.nodes.some(node => node.isNew)) {
            return;
        }

        const isOnlyNode = this._isOnlyNode();
        const parents = this.selectedNode ? [this.selectedNode] : [];

        const newNode = {
            id: this.idGenerator(),
            value: '',
            isNew: true,
            isRoot: isOnlyNode,
            isSelected: isOnlyNode,
            x,
            y,
            parents
        }

        if (isOnlyNode) {
            this.selectedNode = newNode.id;
            this.selectedNodes = [newNode.id];
        }

        this.nodes = [...this.nodes, newNode];
    }

    setValue(id, value) {
        this.nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, value};
            } else {
                return node;
            }
        });
    }

    setPosition(id, x, y) {
        this.nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, x, y};
            } else {
                return node;
            }
        });
    }

    setIsNew(id, isNew) {
        this.nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isNew};
            } else {
                return node;
            }
        });
    }

    setIsSelected(id) {
        this.nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isSelected: true};
            } else {
                return {...node, isSelected: false};
            }
        });

        this.selectedNode = id;

        if (this._lastSelectedNode() !== id) {
            this.selectedNodes = [...this.selectedNodes, id];
        }
    }

    _isOnlyNode() {
        return this.nodes.length === 0;
    }

    _lastSelectedNode() {
        return this.selectedNodes[this.selectedNodes.length - 1];
    }
}
