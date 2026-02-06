interface ProductSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
    category: string;
    onCategoryChange: (value: string) => void;
    categories: string[];
}
export declare function ProductSearch({ search, onSearchChange, category, onCategoryChange, categories, }: ProductSearchProps): import("react/jsx-runtime").JSX.Element;
export {};
