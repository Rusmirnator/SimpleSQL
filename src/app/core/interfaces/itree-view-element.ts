export interface ITreeViewElement {
    index?: number;
    header: string;
    isSelected: boolean;
    isExpanded: boolean;
    parent?: ITreeViewElement,
    children?: ITreeViewElement[]

    addChild(child: ITreeViewElement): void;
    getAllChildren(): ITreeViewElement[];
    getAllParents(): ITreeViewElement[];
}
