import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'


export function MyRadioGroup() {
    let [plan, setPlan] = useState('startup')

    return (
        <RadioGroup value={plan} onChange={setPlan}>

            <RadioGroup.Option value="startup">
                {({ checked }) => (
                    <span className={checked ? 'bg-blue-200' : ''}>Startup</span>
                )}
            </RadioGroup.Option>
            <RadioGroup.Option value="business">
                {({ checked }) => (
                    <span className={checked ? 'bg-blue-200' : ''}>Business</span>
                )}
            </RadioGroup.Option>

        </RadioGroup>
    )
}
