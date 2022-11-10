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

export const callForMessages = (setFunction, dev) => {
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