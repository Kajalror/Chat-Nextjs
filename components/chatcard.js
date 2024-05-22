const ChatCard = ({ children }) => {
    const cardStyle = {        
        width: "100%",
        display:"flex",
        justifyContent:"around-between",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                
    };
    return <div style={cardStyle}>{children}</div>;
};
export default ChatCard;
