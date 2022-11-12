export const listContacts = (setFunction, dev) => {
  fetch("http://localhost:8080/list-contacts/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        return
      }
      
      if (result !== "device offline") {
        setFunction(result)
      }
    },
    (error) => {
      console.log(error)
    }
  )
}

export const updateContacts = (setFunction, dev)  => {
  fetch("http://localhost:8080/update-contacts/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        return
      }

      if (result !== "device offline" && result['updated']) {
        setFunction(result['contacts'])
        return
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}

export const listMessages = (setFunction, dev) => {
  fetch("http://localhost:8080/list-messages/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        return
      }
      if (result !== "device offline") {
        setFunction(result)
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}

export const updateMessages = (setFunction, dev) => {
  fetch("http://localhost:8080/update-messages/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        return
      }
      if (result !== "device offline" && result['updated']) {
        setFunction(result['messages'])
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}

export async function CallSendMessage(dev, message, phone) {
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial: dev, phone: phone, message: message })
  };

  const response = await fetch('http://localhost:8080/send-message/', requestOptions);
  const data = await response.json();
  console.log(data)
}