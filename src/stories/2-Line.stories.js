import React from 'react';
import {Line} from "../Line";

export default {
    title: 'Line',
    component: Line
};

export const Vertical = () => <Line from={{x: 100, y: 100}} to={{x: 100, y: 200}}/>;

export const Horizontal = () => <Line from={{x: 100, y: 100}} to={{x: 200, y: 100}}/>;

export const Diagonal = () => <Line from={{x: 100, y: 100}} to={{x: 200, y: 200}}/>;
