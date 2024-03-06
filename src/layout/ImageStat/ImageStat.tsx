import React from 'react';
import './ImageStat.css';

type Props = {
    label: string;
    value: string | number;
    suffix?: string;
};

export default function ImageStat(props: Props) {
    const { label, value, suffix } = props;
    return (
        <p className="image-stat">
            <strong>{label}:</strong>
            <span>{value}</span>
            {suffix ? (
                <em>{suffix}</em>
            ) : null}
        </p>
    )
}