'use client';

import React, { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';

// Import Jodit dynamically to avoid SSR issues
// Use 'any' for the component type if types are missing to strictly pass build
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false }) as any;

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...',
        height: 500,
        uploader: {
            insertImageAsBase64URI: true, // For simplicity, handle base64 images. Can check upload API later.
            // url: 'http://localhost:3001/upload', // Can integrate with your upload API if needed
        },
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize', 'preview', 'print'
        ],
        removeButtons: ['source', 'about'],
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        theme: 'dark', // Set theme to dark as requested
        style: {
            background: '#09090b', // darker neutral background (zinc-950)
            color: '#f3f4f6' // explicit light text (gray-100)
        }
    }), [placeholder]);

    return (
        <div className={`text-foreground ${className}`}>
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                onBlur={(newContent: string) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={() => { }}
            />
        </div>
    );
}
