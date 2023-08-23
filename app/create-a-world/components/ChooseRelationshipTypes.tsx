'use client'
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { WorldPayload, RelationshipType } from '@/types/types';

export default function ChooseRelationshipTypes() {
    const { setFieldValue, values } = useFormikContext<WorldPayload>();
    const [selected, setSelected] = useState<RelationshipType[]>(values.relationship_types);

    const relationshipTypes: RelationshipType[] = ["M/F", "M/M", "F/F", "Others"];
    const relationshipTypesIcon = {
        "M/M": "♂♂",
        "M/F": "♂♀",
        "F/F": "♀♀",
        "Others": "∞",
        'No Relationship': '⦸'
    }


    const toggleSelection = (value: RelationshipType) => {
        if (value === "No Relationship") {
            setSelected(["No Relationship"]);
        } else {
            if (selected.includes("No Relationship")) {
                setSelected([value]);
            } else if (selected.includes(value)) {
                setSelected(selected.filter(item => item !== value));
            } else {
                setSelected([...selected, value]);
            }
        }
    };

    useEffect(() => {
        if (selected.length === 0) {
            setSelected(['No Relationship'])
            setFieldValue('relationships', [])
        }
        setFieldValue('relationship_types', selected)
    }, [selected])

    return (
        <div className="flex flex-row space-x-2 h-16 text-xs overflow-x-auto text-foreground">
            <div
                className={`cursor-pointer flex flex-col space-y-1 items-center justify-center w-28 px-4 py-2 rounded-lg ${selected.includes("No Relationship") ? "bg-brand text-white" : "bg-foreground/10"}`}
                onClick={() => toggleSelection("No Relationship")}
            >
                <div className='font-bold '>
                    {relationshipTypesIcon["No Relationship"]}
                </div>
                <div className='whitespace-nowrap'>
                    {"Not Applicable"}
                </div>
            </div>

            <div className="w-px border mx-4 h-full"></div>

            {relationshipTypes.map(type => (
                <div
                    key={type}
                    className={`cursor-pointer flex flex-col space-y-1 items-center justify-center w-16 px-4 py-2 rounded-lg ${selected.includes(type) ? "bg-brand text-white" : "bg-foreground/10"}`}
                    onClick={() => toggleSelection(type)}
                >

                    <div className='font-bold '>
                        {relationshipTypesIcon[type]}
                    </div>
                    <div className=''>
                        {type}
                    </div>
                </div>
            ))}

        </div>
    );
};


