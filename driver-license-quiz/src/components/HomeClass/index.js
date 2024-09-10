import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getListClass } from '../../services/classService';
import "./HomeClass.scss";

function HomeClass() {
    
    const [listClass, setListClass] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getListClass();
            setListClass(response);
        };
        fetchApi();
    }, []);

    const getItems = () => (
        listClass.map((item) => {
            return (
                {
                    key: item.id.toString(),
                    label: <span>Hạng: {item.class}</span>,
                    children: <p>{item.description}</p>,
                }
            );
        })
    );

    return (
        <>
            <div>
                <Collapse
                    bordered={false}
                    accordion
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    items={getItems()}
                />
            </div>
        </>
    );
}

export default HomeClass;