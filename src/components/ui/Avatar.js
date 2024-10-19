// src/components/ui/avatar.js
import React from 'react';

const Avatar = ({ src, alt = 'User Avatar', size = '50' }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full`}
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
};

export default Avatar;
