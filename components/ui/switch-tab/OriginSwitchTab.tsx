import { useState } from 'react'
import SwitchTab from './SwitchTab'
import TextInput from '../input/InputText'
import { useFormikContext } from 'formik';

interface OriginSwitchTab {

}

const FandomInput = () => <TextInput name={'origin'} placeholder={'Your fandom name...'} textSize={'text-xl'} multiline={1} />;

export default function OriginSwitchTab({ }: OriginSwitchTab) {
    const { setFieldValue } = useFormikContext();  // Formik context to access its functions
    const [activeTab, setActiveTab] = useState(0); // State to keep track of active tab

    const titles = ['original', 'fandom'];


    const handleTabsChange = (index: number) => {
        setActiveTab(index);
        if (index === 0) { // If 'original' tab is active, set 'origin' field to null
            setFieldValue('origin', null);
        }
    };

    const contents = [<></>, <FandomInput />];

    return <SwitchTab titles={titles} contents={contents} onTabChange={handleTabsChange} />;
}