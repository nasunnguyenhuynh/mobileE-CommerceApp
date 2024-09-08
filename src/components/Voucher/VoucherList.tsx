import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import api, { endpoints } from '../../utils/api';
import remainDateTime from '../../constants/remainDateTime';
import VoucherCard from './VoucherCard';
import Notify from '../Alert/Notify';
// interfaces
import { Voucher, MyVoucher, Condition, createMyVoucher } from '../../interfaces/voucher';
// redux
import store from '../../redux/store';
import type { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { addVoucher } from '../../redux/voucher/voucherSlice';

const VoucherList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [openModel, setOpenModal] = useState(false);
    const [notifyText, setNotifyText] = useState('');

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await api.get(endpoints.vouchers);
            if (response.status === 200 && response.data) {
                console.log('fetchVoucherData: ', response.data);
                setVouchers(response.data.filter((voucher: Voucher) =>
                    remainDateTime(voucher.end_date) !== "Time has passed."));
            }
        } catch (error) {
            console.error('vouchers not found', error);
        }
    };

    const handlNotify = (notifyText: string) => {
        setNotifyText(notifyText)
        setOpenModal(true)
        const timeout = setTimeout(() => {
            setOpenModal(false)
        }, 800);

        return () => clearTimeout(timeout)
    }

    const handleSaveVoucher = (voucher: Voucher, condition: Condition) => {
        if (voucher.conditions.find(cond => cond.id === condition.id)?.remain) {
            if (!voucher.is_multiple && store.getState().voucher.vouchers.
                find(item => item.id === voucher.id)?.conditions.
                find(cond => cond.id === condition.id)) {
                handlNotify('This voucher can be owned 1');
            }
            else {
                const myVoucher = createMyVoucher(voucher, condition);
                dispatch(addVoucher(myVoucher))
            }
        }
        else {
            handlNotify('Voucher not remain')
        }

    }

    return (
        <>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {vouchers.length > 0 ? vouchers.map(voucher => voucher.conditions.map(cond =>
                    <VoucherCard
                        key={voucher.id.toString() + cond.id.toString()}
                        voucher={voucher}
                        condition={cond}
                        onSaveVoucher={handleSaveVoucher}
                    />
                )) : null}
            </ScrollView>
            {openModel && <Notify visible={openModel} text={notifyText} />}
        </>
    );
};

export default VoucherList;
