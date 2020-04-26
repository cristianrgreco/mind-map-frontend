export class NodeList {

    constructor(idGenerator = () => `id-${Date.now()}`, nodes = [], selectedNodes = []) {
        this.idGenerator = idGenerator;
        this.nodes = nodes;
        this.selectedNodes = selectedNodes;
    }

    addNode(x, y) {
        const isOnlyNode = this._isOnlyNode();
        const parent = this.selectedNodes.length ? this.getSelectedNode() : null;

        const newNode = {
            id: this.idGenerator(),
            value: '',
            isNew: true,
            isRoot: isOnlyNode,
            isSelected: isOnlyNode,
            x,
            y,
            width: 0,
            height: 0,
            parent
        }

        const nodes = [...this.nodes, newNode];
        const selectedNodes = isOnlyNode ? [newNode.id] : this.selectedNodes;

        return new NodeList(this.idGenerator, nodes, selectedNodes)
            .setIsSelected(newNode.id);
    }

    removeEmptyNodes() {
        return this.nodes
            .filter(node => node.value.length === 0)
            .reduce((nodeList, node) => nodeList.removeNode(node.id), this);
    }

    removeNode(id) {
        let nodes = this.nodes.filter(node => node.id !== id);
        let selectedNode = this.getSelectedNode();
        let selectedNodes = this.selectedNodes.filter(node => node !== id);

        if (selectedNode === id) {
            const lastSelectedNode = selectedNodes[selectedNodes.length - 1];

            selectedNode = lastSelectedNode ? lastSelectedNode : null;

            if (selectedNode) {
                nodes = nodes.map(node => {
                    if (node.id === selectedNode) {
                        return {...node, isSelected: true};
                    } else {
                        return {...node, isSelected: false};
                    }
                });
            } else {
                nodes = nodes.map(node => {
                    if (node.isRoot) {
                        return {...node, isSelected: true};
                    } else {
                        return {...node, isSelected: false};
                    }
                });
            }
        }

        nodes = nodes.map(node => {
            return {...node, parent: node.parent === id ? null : node.parent};
        });

        const orphanedNodes = nodes.filter(node => !node.isRoot && node.parent === null)

        if (orphanedNodes.length === 0) {
            return new NodeList(this.idGenerator, nodes, selectedNodes);
        } else {
            return orphanedNodes.reduce(
                (prev, next) => prev.removeNode(next.id),
                new NodeList(this.idGenerator, nodes, selectedNodes)
            );
        }
    }

    setValue(id, value, width, height) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, value, width, height};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes);
    }

    setPosition(id, x, y) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, x, y};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes);
    }

    setIsNew(id, isNew) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isNew};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes);
    }

    setIsSelected(id) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isSelected: true};
            } else {
                return {...node, isSelected: false, isNew: false};
            }
        });

        const selectedNodes = this.getSelectedNode() !== id ? [...this.selectedNodes, id] : this.selectedNodes;

        return new NodeList(this.idGenerator, nodes, selectedNodes);
    }

    getColour(node) {
        if (node.isRoot) {
            return node.isSelected ? '#ccc' : '#aaa';
        }

        const rootNode = this.getRootNode();

        const dx = node.x - rootNode.x;
        const dy = node.y - rootNode.y;

        const hue = Math.floor(this._radiansToDegrees(Math.atan2(dy, dx)) + 180);
        const saturation = 100
        const lightness = node.isSelected ? 30 : 20;

        return `hsl(${hue},${saturation}%,${lightness}%)`
    }

    getNode(id) {
        return this.nodes.find(node => node.id === id);
    }

    getRootNode() {
        return this.nodes.find(node => node.isRoot);
    }

    getSelectedNode() {
        return this.selectedNodes[this.selectedNodes.length - 1];
    }

    getNewNode() {
        return this.nodes.find(node => node.isNew);
    }

    _isOnlyNode() {
        return this.nodes.length === 0;
    }

    _radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
}
