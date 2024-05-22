const Head = ({ children }) => {
    const cardStyle = {        
        width: "100%",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
             
    };
    return <div style={cardStyle}>{children}</div>;
};
export default Head;
