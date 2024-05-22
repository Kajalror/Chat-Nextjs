const User = ({ children }) => {
    const cardStyle = {  
        marginTop: "10px",
        display: "flex",
        borderBottom: "1px solid #9c9c94",   
        
    };
    return <div style={cardStyle}>{children}</div>;
};
export default User;
