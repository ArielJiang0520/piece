import { ToggleButton } from "./Toggle";

type SettingGroupProps = {
    settings: { [key: string]: boolean },
    asks: { [key: string]: string },
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
}

const SettingGroup: React.FC<SettingGroupProps> = ({ settings, asks, setFieldValue }) => {
    const handleToggle = (field: string) => (value: boolean) => {
        setFieldValue(`settings.${field}`, value);
    };

    return (
        <div className="my-4 flex flex-col items-start space-y-4">
            {Object.keys(settings).map(field => (
                <div key={field} className="flex flex-col items-start space-y-4">
                    <div key={`${field}-ask`} className="text-small font-normal font-mono text-foreground">
                        {asks[field]}
                    </div>
                    <ToggleButton
                        key={`${field}-button`}
                        handleToggle={handleToggle(field)}
                        isEnabled={settings[field]}
                    />
                </div>
            ))}
        </div>
    );
};

export default SettingGroup;