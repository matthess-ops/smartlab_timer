const [timer, setTimer] = useState(-1);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      window.close();
    }
  }, [timer]);

function submitStartTimer(){
  setTimer(3);
    swal({
      title: "Thank You!",
      text:
        "You have successfully Submitted your Data! This tab is going to close!",
      icon: "success",
      button: false,
    });
}