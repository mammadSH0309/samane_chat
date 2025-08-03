import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { useDaste } from '../customhook/fetchData/useDaste';
import RemoveIcon from '@mui/icons-material/Remove';
import Buttons from './Buttons';
import { useMarakez } from '../customhook/fetchData/useMarakez';
import { toastNotif } from '../utils/ToastNotif';
const MarakezManager = () => {
    const [name, setName] = useState('');
    const { data, loading, create, deleted: remove } = useMarakez();
    const [open, setOpen] = useState(false);
    const onSubmit = (name) => {
        create.mutate({ name });
        setName('')
        setOpen(false)
    }

    return (
        <div className="w-full font-YekanBakh_Regular">
            {!open && (
                <div className="mb-4">
                    <Button
                        variant="outlined"
                        className="!text-sm h-8 !font-YekanBakh_Bold"
                        onClick={() => setOpen(true)}
                    >
                        + ثبت مرکز جدید
                    </Button>

                    {loading ? (
                        <div className="mt-4 text-center">در حال بارگذاری...</div>
                    ) : (
                        <div className="mt-4 overflow-y-auto no-scrollbar max-h-[320px] space-y-4">
                            {data?.length === 0 ? (
                                <div className="text-center text-gray-500">مرکزی ثبت نشده</div>
                            ) : (
                                data?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-300 w-70 h-8 flex items-center justify-between  rounded-md p-3 "
                                    >
                                        <div className="flex justify-between  w-full items-center">
                                            <div className="font-bold text-[13px]">{item.name}</div>

                                            <IconButton size="small" onClick={() => remove.mutate(item.id)}>
                                                <RemoveIcon />
                                            </IconButton>

                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {open && (
                <div className=" rounded-md p-6 overflow-scroll no-scrollbar max-w-xl mx-auto ">


                    <div className="flex justify-center w-full gap-4 mb-6 text-[13px]">


                        <div>
                            <label className="block mb-1  text-gray-600">نام مرکز</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                                type="text"
                            />
                        </div>





                    </div>

                    <div className="flex justify-center gap-4">


                        <Buttons onClick={() => {
                            onSubmit(name)
                        }} text={"ثبت مرکز جدید"} type={2} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarakezManager;
