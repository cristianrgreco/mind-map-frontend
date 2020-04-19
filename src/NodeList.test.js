import {NodeList} from "./NodeList";

describe('NodeList', () => {
    let nodeList;
    let idCount;

    beforeEach(() => {
        idCount = 0;
        const idGenerator = () => `id-${++idCount}`;
        nodeList = new NodeList(idGenerator);
    });

    describe('#addNode', () => {
        it('should add a new node and select it if it is the only node', () => {
            const result = nodeList.addNode(100, 100);

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: true,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNode).toEqual(expectedNode.id);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        })

        it('should add a new node with a parent when another node is selected', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false);

            const result = setup.addNode(100, 100);

            const expectedNode1 = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            const expectedNode2 = {
                id: 'id-2',
                value: '',
                isNew: true,
                isRoot: false,
                isSelected: false,
                x: 100,
                y: 100,
                parent: expectedNode1.id
            };
            expect(result.nodes).toEqual([expectedNode1, expectedNode2]);
            expect(result.selectedNode).toEqual(expectedNode1.id);
            expect(result.selectedNodes).toEqual([expectedNode1.id]);
        });

        it('should not add a new node if one is already in progress', () => {
            const setup = nodeList.addNode(100, 100);

            const result = setup.addNode(100, 100);

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: true,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNode).toEqual(expectedNode.id);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });
    });

    describe('#cancelAddNode', () => {
        it('should cancel adding a node and reset the selected node', () => {
            const setup = nodeList.addNode(100, 100);

            const result = setup.cancelAddNode();

            expect(result.nodes).toEqual([]);
            expect(result.selectedNode).toEqual(null);
            expect(result.selectedNodes).toEqual([]);
        });

        it('should set the selected node to the previously selected node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)
                .setIsSelected('id-2')

            const result = setup.cancelAddNode();

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNode).toEqual(expectedNode.id);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });
    });

    describe('#removeNode', () => {
        it('should remove a node and reset the selected node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false);

            const result = setup.removeNode('id-1');

            expect(result.nodes).toEqual([]);
            expect(result.selectedNode).toEqual(null);
            expect(result.selectedNodes).toEqual([]);
        });

        it('should set the selected node to the previously selected node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)
                .setIsNew('id-2', false)
                .setIsSelected('id-2')

            const result = setup.removeNode('id-2');

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNode).toEqual(expectedNode.id);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });

        it('should also remove orphaned nodes', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)
                .setIsNew('id-2', false)

            const result = setup
                .setIsSelected('id-2')
                .addNode(100, 100)
                .setIsNew('id-3', false)
                .removeNode('id-2')

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parent: null
            };
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNode).toEqual(expectedNode.id);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });
    });

    it('should set the value of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setValue('id-1', 'value');

        const expectedNode = {
            id: 'id-1',
            value: 'value',
            isNew: true,
            isRoot: true,
            isSelected: true,
            x: 100,
            y: 100,
            parent: null
        };
        expect(result.nodes).toEqual([expectedNode]);
    });

    it('should set the position of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setPosition('id-1', 200, 200);

        const expectedNode = {
            id: 'id-1',
            value: '',
            isNew: true,
            isRoot: true,
            isSelected: true,
            x: 200,
            y: 200,
            parent: null
        };
        expect(result.nodes).toEqual([expectedNode]);
    });

    it('should set the isNew of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setIsNew('id-1', false);

        const expectedNode = {
            id: 'id-1',
            value: '',
            isNew: false,
            isRoot: true,
            isSelected: true,
            x: 100,
            y: 100,
            parent: null
        };
        expect(result.nodes).toEqual([expectedNode]);
    });

    describe('#setIsSelected', () => {
        it('should set the isSelected of the node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)

            const result = setup.setIsSelected('id-2');

            const expectedNode1 = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: false,
                x: 100,
                y: 100,
                parent: null
            };
            const expectedNode2 = {
                id: 'id-2',
                value: '',
                isNew: true,
                isRoot: false,
                isSelected: true,
                x: 100,
                y: 100,
                parent: 'id-1'
            };
            expect(result.nodes).toEqual([expectedNode1, expectedNode2]);
            expect(result.selectedNode).toEqual('id-2');
            expect(result.selectedNodes).toEqual(['id-1', 'id-2']);
        });

        it('should not add to selectedNodes if an already selected node is selected', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)

            const result = setup
                .setIsSelected('id-2')
                .setIsSelected('id-2');

            expect(result.selectedNodes).toEqual(['id-1', 'id-2']);
        });
    });

    it('should return a node by ID', () => {
        const setup = nodeList
            .addNode(100, 100)

        const result = setup.findById('id-1');

        const expectedNode = {
            id: 'id-1',
            value: '',
            isNew: true,
            isRoot: true,
            isSelected: true,
            x: 100,
            y: 100,
            parent: null
        };
        expect(result).toEqual(expectedNode);
    });
});
