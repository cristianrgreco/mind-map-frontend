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

            const expectedNode = aNode();
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        })

        it('should add a new node with a parent when another node is selected', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false);

            const result = setup.addNode(100, 100);

            const expectedNode1 = aNode({isNew: false});
            const expectedNode2 = aNode({id: 'id-2', isRoot: false, isSelected: false, parent: expectedNode1.id});
            expect(result.nodes).toEqual([expectedNode1, expectedNode2]);
            expect(result.selectedNodes).toEqual([expectedNode1.id]);
        });
    });

    describe('#cancelAddNode', () => {
        it('should cancel adding a node and reset the selected node', () => {
            const setup = nodeList.addNode(100, 100);

            const result = setup.cancelAddNode();

            expect(result.nodes).toEqual([]);
            expect(result.selectedNodes).toEqual([]);
        });

        it('should not cancel adding a node if the node is not new', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false);

            const result = setup.cancelAddNode();

            const expectedNode = aNode({isNew: false});
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });

        it('should not cancel adding a node if the node is new and has value', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setValue('id-1', 'value', 0, 0);

            const result = setup.cancelAddNode();

            const expectedNode = aNode({value: 'value'});
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });

        it('should set the selected node to the previously selected node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)
                .setIsSelected('id-2')

            const result = setup.cancelAddNode();

            const expectedNode = aNode({isNew: false});
            expect(result.nodes).toEqual([expectedNode]);
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

            const expectedNode = aNode({isNew: false});
            expect(result.nodes).toEqual([expectedNode]);
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

            const expectedNode = aNode({isNew: false});
            expect(result.nodes).toEqual([expectedNode]);
            expect(result.selectedNodes).toEqual([expectedNode.id]);
        });
    });

    it('should set the value, width and height of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setValue('id-1', 'value', 100, 200);

        const expectedNode = aNode({value: 'value', width: 100, height: 200});
        expect(result.nodes).toEqual([expectedNode]);
    });

    it('should set the position of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setPosition('id-1', 200, 200);

        const expectedNode = aNode({isNew: true, x: 200, y: 200});
        expect(result.nodes).toEqual([expectedNode]);
    });

    it('should set the isNew of the node', () => {
        const setup = nodeList.addNode(100, 100);

        const result = setup.setIsNew('id-1', false);

        const expectedNode = aNode({isNew: false});
        expect(result.nodes).toEqual([expectedNode]);
    });

    describe('#setIsSelected', () => {
        it('should set the isSelected of the node', () => {
            const setup = nodeList
                .addNode(100, 100)
                .setIsNew('id-1', false)
                .addNode(100, 100)

            const result = setup.setIsSelected('id-2');

            const expectedNode1 = aNode({isNew: false, isSelected: false});
            const expectedNode2 = aNode({id: 'id-2', isRoot: false, parent: 'id-1'});
            expect(result.nodes).toEqual([expectedNode1, expectedNode2]);
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

        const result = setup.getNode('id-1');

        const expectedNode = aNode();
        expect(result).toEqual(expectedNode);
    });

    it('should return the selected node', () => {
        const setup = nodeList
            .addNode(100, 100)

        const result = setup.getSelectedNode();

        expect(result).toEqual('id-1');
    });
});

function aNode(overrides) {
    const node = {
        id: 'id-1',
        value: '',
        isNew: true,
        isRoot: true,
        isSelected: true,
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        parent: null
    };

    return {...node, ...overrides};
}
