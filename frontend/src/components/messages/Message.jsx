const Message = () => {
    return (
        <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind css chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>
            <div className={`chat-bubble text-white bg-blue-500`}>Hi! What is upp!</div>
            <time className="text-xs opacity-50">12:45</time>
            
        </div>
      )
    }

export default Message;
