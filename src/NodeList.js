export class NodeList {

    constructor(
        idGenerator = () => `id-${Date.now()}`,
        nodes = [],
        selectedNodes = [],
        lastAddedNode = null
    ) {
        this.idGenerator = idGenerator;
        this.nodes = nodes;
        this.selectedNodes = selectedNodes;
        this.lastAddedNode = lastAddedNode;
    }

    addNode(x, y) {
        if (this.nodes.some(node => node.isNew)) {
            return this;
        }

        const isOnlyNode = this._isOnlyNode();
        const parent = this.selectedNodes.length ? this.findSelectedNode() : null;

        const newNode = {
            id: this.idGenerator(),
            value: '',
            isNew: true,
            isRoot: isOnlyNode,
            isSelected: isOnlyNode,
            x,
            y,
            parent
        }

        const nodes = [...this.nodes, newNode];
        const selectedNodes = isOnlyNode ? [newNode.id] : this.selectedNodes;
        const lastAddedNode = newNode.id;

        return new NodeList(this.idGenerator, nodes, selectedNodes, lastAddedNode);
    }

    cancelAddNode() {
        if (!this.lastAddedNode) {
            return this;
        }

        let nodes = this.nodes.filter(node => node.id !== this.lastAddedNode);
        let selectedNode = this.findSelectedNode()
        let selectedNodes = this.selectedNodes.filter(node => node !== this.lastAddedNode);

        if (selectedNode === this.lastAddedNode) {
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

        const lastAddedNode = null;

        return new NodeList(this.idGenerator, nodes, selectedNodes, lastAddedNode);
    }

    removeNode(id) {
        let nodes = this.nodes.filter(node => node.id !== id);
        let selectedNode = this.findSelectedNode();
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
            return new NodeList(this.idGenerator, nodes, selectedNodes, this.lastAddedNode);
        } else {
            return orphanedNodes.reduce(
                (prev, next) => prev.removeNode(next.id),
                new NodeList(this.idGenerator, nodes, selectedNodes, this.lastAddedNode)
            );
        }
    }

    setValue(id, value) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, value};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes, this.lastAddedNode);
    }

    setPosition(id, x, y) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, x, y};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes, this.lastAddedNode);
    }

    setIsNew(id, isNew) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isNew};
            } else {
                return node;
            }
        });

        return new NodeList(this.idGenerator, nodes, this.selectedNodes, this.lastAddedNode);
    }

    setIsSelected(id) {
        const nodes = this.nodes.map(node => {
            if (node.id === id) {
                return {...node, isSelected: true};
            } else {
                return {...node, isSelected: false};
            }
        });

        const selectedNodes = this.findSelectedNode() !== id ? [...this.selectedNodes, id] : this.selectedNodes;

        return new NodeList(this.idGenerator, nodes, selectedNodes, this.lastAddedNode);
    }

    findById(id) {
        return this.nodes.find(node => node.id === id);
    }

    findSelectedNode() {
        return this.selectedNodes[this.selectedNodes.length - 1];
    }

    _isOnlyNode() {
        return this.nodes.length === 0;
    }
}
