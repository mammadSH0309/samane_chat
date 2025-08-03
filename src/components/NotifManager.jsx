import React from 'react'

function NotifManager() {

    const [subject, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const { data: tickets, isLoading } = useSupportTickets();
    const createTicket = useCreateTicket();
    const deleteTicket = useDeleteTicket();

    return (
        <div className="w-full font-YekanBakh_Regular">

            <div className="rounded-md p-6 overflow-scroll no-scrollbar max-w-xl mx-auto">
                <div className="flex flex-col w-full gap-4 mb-6 text-[13px]">
                    <div>
                        <label className="block mb-1 text-gray-600">عنوان پیام</label>
                        <input
                            value={message}
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
        </div>
    )
}

export default NotifManager
