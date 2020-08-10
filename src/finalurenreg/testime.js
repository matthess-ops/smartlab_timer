const Message = () => {
  const [messageObj, setMessage] = useState({ message: '', id: 1 });

  return (
    <div>
      <input
        type="text"
        value={messageObj.message}
        placeholder="Enter a message"
        onChange={e => {
          const newMessageObj = { message: e.target.value };
          setMessage(newMessageObj); // id property is lost
        }}
      />
      <p>
        <strong>{messageObj.id} : {messageObj.message}</strong>
      </p>
  </div>
  );
};


// https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/


