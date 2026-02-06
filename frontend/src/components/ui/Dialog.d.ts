import * as React from 'react';
interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}
declare function Dialog({ open, onClose, children }: DialogProps): import("react/jsx-runtime").JSX.Element | null;
declare function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogHeader, DialogTitle, DialogDescription };
