import React from 'react';
import {Map} from "../Map";
import {Node} from "../Node";

export default {
    title: 'Map',
    component: Map
};

export const Empty = () => <Map/>;

export const Single = () => <Map nodes={[<Node value="Node 1" isSelected={true} x={100} y={100}/>]}/>;
