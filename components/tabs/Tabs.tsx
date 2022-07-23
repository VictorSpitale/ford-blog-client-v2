import React, {useState} from 'react';
import Tab from "./Tab";

type PropsType = {
    children: JSX.Element[]
}

const Tabs = ({children}: PropsType) => {

    const [activeTab, setActiveTab] = useState(children[0].props['data-label']);

    const onClickTabItem = (tab: string): void => {
        setActiveTab(tab);
    };

    return (
        <>
            <ol className={"mb-2"}>
                {children.map((child, i) => {
                    return <Tab key={i} activeTab={activeTab} label={child.props['data-label']}
                                onClick={onClickTabItem} />;
                })}
            </ol>
            <>
                {children.map((child) => {
                    if (child.props['data-label'] !== activeTab) return null;
                    return child;
                })}
            </>
        </>
    );
};

export default Tabs;