import React from 'react';
import {Map} from "../Map";
import {NodeList} from "../NodeList";

export default {
    title: 'Map',
    component: Map
};

export const Default = () => <Map nodeListInstance={new NodeList()}/>;
