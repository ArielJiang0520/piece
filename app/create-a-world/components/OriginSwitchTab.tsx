import { useState } from 'react'
import { SolidSwitchTab } from '@/components/ui/switch-tab/switch-tab'
import TextInput from '@/components/ui/input/InputText'
import { useFormikContext } from 'formik';

interface OriginSwitchTab {

}

const FandomInput = () => <TextInput name={'origin'} placeholder={'Add your fandom...'} textSize={'text-xl'} multiline={1} />;

export default function OriginSwitchTab({ }: OriginSwitchTab) {
    const { setFieldValue } = useFormikContext();  // Formik context to access its functions
    const [activeTab, setActiveTab] = useState(0); // State to keep track of active tab

    const titles = ['original', 'fandom'];


    const handleTabsChange = (index: number) => {
        setActiveTab(index);
        if (index === 0) {
            setFieldValue('origin', '');
        }
    };

    const contents = [<></>, <FandomInput />];

    return <SolidSwitchTab titles={titles} contents={contents} onTabChange={handleTabsChange} />;
}