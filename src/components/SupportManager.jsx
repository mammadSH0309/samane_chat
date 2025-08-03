import React, { useState } from 'react';
import {
    Button,
    IconButton,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

import {
    useAdminRespondToTicket,
    useCreateTicket,
    useDeleteTicket,
    useSupportTickets
} from '../customhook/fetchData/useSupportTickets';

import Buttons from './Buttons';

function SupportManager() {
    const [subject, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [activeReplyTicketId, setActiveReplyTicketId] = useState(null);

    const { data: tickets, isLoading } = useSupportTickets();
    const createTicket = useCreateTicket();
    const deleteTicket = useDeleteTicket();
    const respondToTicket = useAdminRespondToTicket();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = userInfo?.isSuperAdmin;
    console.log(tickets)
    const handleSubmit = () => {
        if (!subject || !message) return;
        createTicket.mutate({ subject, message });
        setTitle('');
        setMessage('');
        setOpen(false);
    };

    return (
        <div className="w-full font-YekanBakh_Regular">
            {!open && (
                <>
                    <div className="mb-4">
                        <Button
                            variant="outlined"
                            className="!text-sm !font-YekanBakh_Bold"
                            onClick={() => setOpen(true)}
                        >
                            + ارسال پیام جدید
                        </Button>
                    </div>

                    <div className="space-y-5 overflow-y-auto no-scrollbar max-h-[320px]">
                        {tickets?.length === 0 ? (
                            <div className="text-center text-gray-500">پیامی ثبت نشده است</div>
                        ) : (
                            tickets?.map((ticket) => (
                                <div key={ticket.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                                    {/* هدر */}
                                    <div dir='ltr' className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                            <IconButton size="small" onClick={() => deleteTicket.mutate(ticket.id)}>
                                                <RemoveIcon fontSize="small" className="text-red-600" />
                                            </IconButton>
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            بررسی شده
                                        </div>
                                        <h3 className="text-[15px] font-bold text-gray-800 mb-1">{ticket.subject}</h3>
                                    </div>

                                    {/* اطلاعات کاربر */}
                                    <p className="text-[13px] text-gray-500 mb-3">توسط کاربر شماره {ticket.user.id}</p>

                                    {/* پیام اصلی */}
                                    <p className="text-[14px] leading-[26px] text-gray-700 whitespace-pre-wrap mb-4">
                                        {ticket.message}
                                    </p>

                                    {/* نمایش پاسخ‌های ادمین */}
                                    {ticket.responses?.length > 0 && (
                                        <div className="flex flex-col gap-2 mt-4 bg-gray-50 p-3 rounded-md">
                                            {ticket.responses.map((res, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white px-3 py-2 rounded shadow text-sm border border-gray-200"
                                                >
                                                    <strong className="text-blue-600">
                                                        {res.user?.username || res.user?.last_name || 'ادمین'}:
                                                    </strong>{" "}
                                                    {res.message}
                                                </div>
                                            ))}
                                        </div>
                                    )}


                                    {/* فرم پاسخ ادمین */}
                                    {isAdmin && (
                                        <>
                                            {activeReplyTicketId === ticket.id ? (
                                                <div className="mt-3">
                                                    <textarea
                                                        rows={3}
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                        placeholder="پاسخ خود را بنویسید..."
                                                    />
                                                    <div className="flex justify-end mt-2 gap-2">
                                                        <Buttons
                                                            type={1}
                                                            text={'لغو'}
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => setActiveReplyTicketId(null)}
                                                        />

                                                        <Buttons
                                                            text={'پاسخ'}
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => {
                                                                if (replyText.trim()) {
                                                                    respondToTicket.mutate({
                                                                        ticketId: ticket.id,
                                                                        response: replyText,
                                                                    });
                                                                    setReplyText('');
                                                                    setActiveReplyTicketId(null);
                                                                }
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            ) : (
                                               <div className='flex justify-center pt-3'>
                                                 <Buttons
                                                    type={2}
                                                    text={'پاسخ دادن به تیکت'}
                                                    onClick={() => setActiveReplyTicketId(ticket.id)}
                                                    className="mt-3 !text-sm"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                               </div>


                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* فرم ارسال تیکت جدید */}
            {open && (
                <div className="rounded-md p-6 overflow-scroll no-scrollbar max-w-xl mx-auto">
                    <div className="flex flex-col w-full gap-4 mb-6 text-[13px]">
                        <div>
                            <label className="block mb-1 text-gray-600">عنوان پیام</label>
                            <input
                                value={subject}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-600">متن پیام</label>
                            <textarea
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Buttons onClick={handleSubmit} text="ثبت تیکت جدید" type={2} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupportManager;
