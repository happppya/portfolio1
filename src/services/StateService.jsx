import { useRef } from "react";

let currentState;

export const States = Object.freeze({EXPLORE: 0, WORK: 1, ABOUT: 2})

export const getState = () => { 
    return currentState;
}

export const setState = (state) => {
    currentState = state;
}