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
            nodeList.addNode(100, 100);

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: true,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parents: []
            };
            expect(nodeList.nodes).toEqual([expectedNode]);
            expect(nodeList.selectedNode).toEqual(expectedNode.id);
            expect(nodeList.selectedNodes).toEqual([expectedNode.id]);
        })

        it('should add a new node with a parent when another node is selected', () => {
            nodeList.addNode(100, 100);
            nodeList.setIsNew('id-1', false);

            nodeList.addNode(100, 100);

            const expectedNode1 = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parents: []
            };
            const expectedNode2 = {
                id: 'id-2',
                value: '',
                isNew: true,
                isRoot: false,
                isSelected: false,
                x: 100,
                y: 100,
                parents: [expectedNode1.id]
            };
            expect(nodeList.nodes).toEqual([expectedNode1, expectedNode2]);
            expect(nodeList.selectedNode).toEqual(expectedNode1.id);
            expect(nodeList.selectedNodes).toEqual([expectedNode1.id]);
        });

        it('should not add a new node if one is already in progress', () => {
            nodeList.addNode(100, 100);

            nodeList.addNode(100, 100);

            const expectedNode = {
                id: 'id-1',
                value: '',
                isNew: true,
                isRoot: true,
                isSelected: true,
                x: 100,
                y: 100,
                parents: []
            };
            expect(nodeList.nodes).toEqual([expectedNode]);
            expect(nodeList.selectedNode).toEqual(expectedNode.id);
            expect(nodeList.selectedNodes).toEqual([expectedNode.id]);
        });
    });

    it('should set the value of the node', () => {
        nodeList.addNode(100, 100);

        nodeList.setValue('id-1', 'value');

        const expectedNode = {
            id: 'id-1',
            value: 'value',
            isNew: true,
            isRoot: true,
            isSelected: true,
            x: 100,
            y: 100,
            parents: []
        };
        expect(nodeList.nodes).toEqual([expectedNode]);
    });

    it('should set the position of the node', () => {
        nodeList.addNode(100, 100);

        nodeList.setPosition('id-1', 200, 200);

        const expectedNode = {
            id: 'id-1',
            value: '',
            isNew: true,
            isRoot: true,
            isSelected: true,
            x: 200,
            y: 200,
            parents: []
        };
        expect(nodeList.nodes).toEqual([expectedNode]);
    });

    it('should set the isNew of the node', () => {
        nodeList.addNode(100, 100);

        nodeList.setIsNew('id-1', false);

        const expectedNode = {
            id: 'id-1',
            value: '',
            isNew: false,
            isRoot: true,
            isSelected: true,
            x: 100,
            y: 100,
            parents: []
        };
        expect(nodeList.nodes).toEqual([expectedNode]);
    });

    describe('#setIsSelected', () => {
        it('should set the isSelected of the node', () => {
            nodeList.addNode(100, 100);
            nodeList.setIsNew('id-1', false);
            nodeList.addNode(100, 100);

            nodeList.setIsSelected('id-2');

            const expectedNode1 = {
                id: 'id-1',
                value: '',
                isNew: false,
                isRoot: true,
                isSelected: false,
                x: 100,
                y: 100,
                parents: []
            };
            const expectedNode2 = {
                id: 'id-2',
                value: '',
                isNew: true,
                isRoot: false,
                isSelected: true,
                x: 100,
                y: 100,
                parents: ['id-1']
            };
            expect(nodeList.nodes).toEqual([expectedNode1, expectedNode2]);
            expect(nodeList.selectedNode).toEqual('id-2');
            expect(nodeList.selectedNodes).toEqual(['id-1', 'id-2']);
        });

        it('should not add to selectedNodes if an already selected node is selected', () => {
            nodeList.addNode(100, 100);
            nodeList.setIsNew('id-1', false);
            nodeList.addNode(100, 100);

            nodeList.setIsSelected('id-2');
            nodeList.setIsSelected('id-2');

            expect(nodeList.selectedNodes).toEqual(['id-1', 'id-2']);
        });
    });
});
