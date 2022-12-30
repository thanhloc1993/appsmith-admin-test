export declare namespace IGherkinDocument {
    export interface Location {
        line: number;
        column: number;
    }

    export interface Tag {
        type: string;
        location: Location;
        name: string;
    }

    export interface Location2 {
        line: number;
        column: number;
    }

    export interface Location3 {
        line: number;
        column: number;
    }

    export interface Location4 {
        line: number;
        column: number;
    }

    export interface Step {
        type: string;
        location: Location4;
        keyword: string;
        text: string;
    }

    export interface Location5 {
        line: number;
        column: number;
    }

    export interface Location6 {
        line: number;
        column: number;
    }

    export interface Location7 {
        line: number;
        column: number;
    }

    export interface Cell {
        type: string;
        location: Location7;
        value: string;
    }

    export interface TableHeader {
        type: string;
        location: Location6;
        cells: Cell[];
    }

    export interface Location8 {
        line: number;
        column: number;
    }

    export interface Location9 {
        line: number;
        column: number;
    }

    export interface Cell2 {
        type: string;
        location: Location9;
        value: string;
    }

    export interface TableBody {
        type: string;
        location: Location8;
        cells: Cell2[];
    }

    export interface Example {
        type: string;
        tags: any[];
        location: Location5;
        keyword: string;
        name: string;
        tableHeader: TableHeader;
        tableBody: TableBody[];
    }

    export interface Child {
        type: string;
        location: Location3;
        keyword: string;
        name: string;
        steps: Step[];
        tags: any[];
        examples: Example[];
    }

    export interface Feature {
        type: string;
        tags: Tag[];
        location: Location2;
        language: string;
        keyword: string;
        name: string;
        children: Child[];
    }

    export interface RootObject {
        type: string;
        feature: Feature;
        comments: any[];
    }
}
