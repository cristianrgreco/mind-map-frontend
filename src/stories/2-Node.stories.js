import React from 'react';
import {Node} from "../Node";

export default {
    title: 'Node',
    component: Node
};

export const Default = () => <Node value="Title" isNew={false}/>;

export const New = () => <Node isNew={true}/>;

export const Edit = () => <Node value="Title" isNew={true}/>;
