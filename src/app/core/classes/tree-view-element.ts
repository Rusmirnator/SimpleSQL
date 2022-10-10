import { ITreeViewElement } from "../interfaces/itree-view-element";

export class TreeViewElement implements ITreeViewElement {
    index?: number;
    header: string;
    isSelected: boolean;
    isExpanded: boolean;
    parent?: ITreeViewElement | undefined;
    children?: ITreeViewElement[] | undefined;

    constructor(header: string, isSelected: boolean, isExpanded: boolean, index?: number, parent?: ITreeViewElement, children?: ITreeViewElement[]) {
        this.header = header;
        this.isSelected = isSelected;
        this.isExpanded = isExpanded;
        this.index = index;
        this.parent = parent;
        this.children = children;
    }

    addChild(child: ITreeViewElement): void {
        child.parent = this;
        this.children?.push(child);
    }

    getAllChildren(): ITreeViewElement[] {
        let current: ITreeViewElement | undefined = this;
        let next: ITreeViewElement | undefined;
        let children: ITreeViewElement[] = [];

        for (let i = 0; this.children !== undefined && i < this.children?.length; i++) {
            current = this.children[i];
            children.push(current);

            while (current !== undefined) {
                current.children?.map((c) => {
                    if (next === undefined) {
                        next = c;
                    }
                    children.push(c);
                });
                current = next;
                next = undefined;
            }
        }

        return children;
    }

    getAllParents(): ITreeViewElement[] {
        let current: ITreeViewElement | undefined = this;
        let parents: ITreeViewElement[] = [];

        while (current !== undefined) {
            parents.push(current);
            current = current.parent;
        }

        return parents;
    }

}