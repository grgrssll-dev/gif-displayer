import React, { useRef, useEffect } from 'react';
import './Extension.css';
import ImageStat from '../ImageStat';
import { ucFirst } from '../../utils';

type Props = {
    type: string;
    data: any;
};


export default function Extension(props: Props) {
    const { type, data } = props;

    const values: Record<string, string | number> = {
        introduction: data.intraduction,
        label: data.label,
    };
    if (type === 'application') {
        values.application = data.application;
        values.hex = data.hex;
        values.subblock = data.subblock;
        values.skip = data.skip;
        values.loopCount = data.loopCount;
    } else if (type === 'text') {
        values.text = data.text;
        values.hex = data.hex;
    } else if (type === 'comment') {
        values.comment = data.comment;
        values.hex = data.hex;

    } else {
        return (<span></span>);
    }

    values.terminator = data.terminator;

    return (
        <div className="gif-extension">
            <h3>{ucFirst(type)} Extension</h3>
            {Object.entries(values).map(([key, value]) => (
                <ImageStat
                    label={ucFirst(key)}
                    value={value} />
            ))}
        </div>
    )
}