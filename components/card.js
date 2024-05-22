const Card = ({ children }) => {
    const cardStyle = {        
        width: "40%",
        margin:"0px auto",
        // border:"2px solid red",
        paddingBottom: "10px",
       marginBottom: " 10px", 
        boxShadow: "1px 4px 8px rgba(0, 0, 0, 0.2)",
             
    };
    return <div style= {cardStyle}> {children} </div>;
};
export default Card; 
